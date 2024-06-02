import { create } from "zustand";

const useSearchStore = create((set) => ({
  search: "",
  setSearch: (place: string) => set({ search: place }),
}));

export default useSearchStore;
