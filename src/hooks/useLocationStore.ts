import { create } from "zustand";
import { Coords } from "@/services/types";

interface LocationStore {
  location: Coords
  setLocation: (location: Coords) => void
}

const useLocationStore = create<LocationStore>((set) => ({
  location: { latitude: 0, longitude: 0 },
  setLocation: ({ latitude, longitude }: Coords) =>
    set({ location: { latitude, longitude } }),
}));

export default useLocationStore;
