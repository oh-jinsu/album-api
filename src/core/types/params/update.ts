export type RemovePropertyParam = {
  op: "remove";
};

export type ReplacePropertyParam<T> = {
  op: "replace";
  value: T;
};
