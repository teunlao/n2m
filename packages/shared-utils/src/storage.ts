import { StoreWritable } from 'effector'

export function useLocalStorage() {
  return {
    get(key: string) {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key)
      }

      return null
    },

    set(key: string, value: string) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value)
      }
    },

    persist(store: StoreWritable<any>, { key }: { key: string }) {
      return store.watch((value) => {
        if (value) {
          this.set(key, value)
        }
      })
    },
  }
}

export function useSessionStorage() {
  return {
    get(key: string) {
      if (typeof sessionStorage !== 'undefined') {
        return sessionStorage.getItem(key)
      }

      return null
    },

    set(key: string, value: string) {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, value)
      }
    },

    persist(store: StoreWritable<any>, { key }: { key: string }) {
      return store.watch((value) => {
        if (value) {
          this.set(key, value)
        }
      })
    },
  }
}
