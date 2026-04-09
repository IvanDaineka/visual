export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type PickedByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

export type EventHandlers<T extends Record<string, unknown>> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (payload: T[K]) => void;
};