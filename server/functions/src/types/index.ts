export type Task = {
  name: string;
  checked: boolean;
  i: number;
};

export type TaskMap = {
  [name: string]: {
    checked: boolean;
    i: number;
  };
};
