/**
 * Sync Layer — Offline-first background sync
 *
 * Provides a simple queue that buffers backend writes when offline.
 * Stores pending operations in MMKV and flushes them on app foreground
 * or after a successful write.
 *
 * No external dependency on NetInfo — simply tries each request and
 * re-queues on network failure.
 */

import { storage } from './mmkv';

type SyncAction = {
  id: string;
  type: 'save-scan' | 'sync-plan' | 'sync-routine' | 'save-checklist';
  payload: any;
  createdAt: string;
  retries: number;
};

const QUEUE_KEY = 'sync-queue';
const MAX_RETRIES = 5;

/** Read the current queue from MMKV */
const getQueue = (): SyncAction[] => {
  const raw = storage.getString(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
};

/** Persist the queue to MMKV */
const setQueue = (queue: SyncAction[]): void => {
  storage.set(QUEUE_KEY, JSON.stringify(queue));
};

/**
 * Add an action to the sync queue.
 * Call this instead of directly hitting the API when you want offline support.
 */
export const enqueueSync = (
  type: SyncAction['type'],
  payload: any,
): void => {
  const queue = getQueue();
  queue.push({
    id: `${type}_${Date.now()}`,
    type,
    payload,
    createdAt: new Date().toISOString(),
    retries: 0,
  });
  setQueue(queue);
};

/**
 * Process a single sync action by calling the appropriate API.
 * Returns true if successful, false if it should be retried.
 */
const processAction = async (action: SyncAction): Promise<boolean> => {
  try {
    switch (action.type) {
      case 'save-scan': {
        const { saveScan } = await import('@/services/api/scan.api');
        await saveScan(action.payload);
        return true;
      }
      case 'sync-plan': {
        const { syncPlan } = await import('@/services/api/plan.api');
        await syncPlan(action.payload);
        return true;
      }
      case 'sync-routine': {
        const { syncRoutineComplete } = await import('@/services/api/plan.api');
        const { planId, routineId, date, durationSeconds } = action.payload;
        await syncRoutineComplete(planId, routineId, date, durationSeconds);
        return true;
      }
      case 'save-checklist': {
        const { saveChecklist } = await import('@/services/api/checklist.api');
        await saveChecklist(action.payload.date, action.payload.completedTaskIds);
        return true;
      }
      default:
        return true;
    }
  } catch {
    return false;
  }
};

/**
 * Flush all pending sync actions.
 * Called on app foreground, after successful writes, or on a timer.
 * Network failures are handled gracefully — failed items stay in the queue.
 */
export const flushSyncQueue = async (): Promise<void> => {
  const queue = getQueue();
  if (queue.length === 0) return;

  const remaining: SyncAction[] = [];

  for (const action of queue) {
    const success = await processAction(action);
    if (!success) {
      action.retries += 1;
      if (action.retries < MAX_RETRIES) {
        remaining.push(action);
      }
      // else: drop after MAX_RETRIES
    }
  }

  setQueue(remaining);
};

/** Get the number of pending sync actions (for UI indicators) */
export const getPendingSyncCount = (): number => getQueue().length;
