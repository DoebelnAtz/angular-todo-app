export const mapTasksToArray = (taskMap: any) => {
  return Object.keys(taskMap).map((name) => ({ name, ...taskMap[name] }));
};
