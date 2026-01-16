import { Routine, RoutineId, Routines } from '@/data/routines';

const getRoutineById = (routineId: RoutineId): Routine => {
  const routine = Routines.find((routine) => routine.id === routineId);

  if (!routine) {
    throw new Error('Routine not found');
  }

  return routine;
};

export { getRoutineById };
