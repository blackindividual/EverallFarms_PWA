export type ObservableLike<T> = {
  subscribe: (
    observer:
      | ((value: T) => void)
      | {
          next: (value: T) => void
          error?: (e: any) => void
          complete?: () => void
        }
  ) => { unsubscribe: () => void }
}

