import { Task, TaskMap } from "../types";

/**
 * sorts array of tasks by i
 * @param a
 * @param b
 */
export const sortTasks = (a: Task, b: Task) => {
  if (a.i < b.i) {
    return -1;
  }
  if (a.i > b.i) {
    return 1;
  }
  return 0;
};
/**
 * converts a firebase map of tasks into array
 * @param taskMap
 */
export const mapTasksToArray = (taskMap: TaskMap): Task[] => {
  let mappedTasks = Object.keys(taskMap).map((name) => ({
    name,
    ...taskMap[name],
  }));
  return mappedTasks.sort(sortTasks);
};
