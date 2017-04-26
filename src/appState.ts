export interface AppState {
  count: number;
}

export function getInitialAppState(): AppState {
  return {
    count: 0,
  };
}
