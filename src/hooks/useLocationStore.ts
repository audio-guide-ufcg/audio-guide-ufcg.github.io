import { create } from "zustand";
import { Coords } from "@/services/types";

const useLocationStore = create((set) => ({
  location: { latitude: 0, longitude: 0 },
  setLocation: ({ latitude, longitude }: Coords) =>
    set({ location: { latitude, longitude } }),
}));

export default useLocationStore;
