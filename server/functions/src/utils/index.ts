export const sortTasks = (a: any, b: any) => {
  if (a.i < b.i) {
    return -1;
  }
  if (a.i > b.i) {
    return 1;
  }
  return 0;
};

export const mapTasksToArray = (taskMap: any) => {
  let mappedTasks = Object.keys(taskMap).map((name) => ({
    name,
    ...taskMap[name],
  }));
  return mappedTasks.sort(sortTasks);
};
