import ExploreArea from "@/components/ExploreArea";
import Map from "@/components/Map";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main>
      <Map />
      <SearchBar />
      <ExploreArea />
    </main>
  );
}
