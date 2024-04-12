import create from '../../zustand-rry/lib-js/index'
import { immer } from '../../zustand-rry/lib-js/middleware/immer'

const useGlobalStore = create(
  immer((set) => ({
    bears: 10085,
    count: 100,
    increase: () => set((state) => ({ count: Number(state.count) + 1 })),
    reSet: (data) => {
      set((state) => {
        state.bears = data
      })
    },
    reset: () => set({ count: 0, bears: 0 }),
    destroy: () => set({}, true),
    radomCount: () => set(() => ({ count: Math.random() * 100 })),
  }))
)

export default useGlobalStore