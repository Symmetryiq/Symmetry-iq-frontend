import { ROUTINES } from '@/constants/routines';
import { Routine, RoutineID } from '@/types/routine.types';

/**
 * Get a routine by its ID.
 * @param id The ID of the routine to get.
 * @returns The routine with the specified ID.
 * @throws Error if the routine with the specified ID is not found.
 */
export function getRoutineByID(id: RoutineID): Routine {
  const routine = ROUTINES.find((routine) => routine.id === id);
  if (!routine) {
    throw new Error(`Routine with id ${id} not found`);
  }
  return routine;
}
