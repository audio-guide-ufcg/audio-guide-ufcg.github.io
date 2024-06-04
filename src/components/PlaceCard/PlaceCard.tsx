import { Flex } from "@chakra-ui/react";
import PlaceCardStatus from "./PlaceCardStatus";
import { TuristPoint } from "@/services/types";
import Link from "next/link";
import usePlacesStore from "@/hooks/usePlacesStore";
import PlaceCardOverlay from "./PlaceCardOverlay";
import calculateStatus from "./utils/calculateStatus/calculateStatus";

interface PlaceCardProps {
  place: any;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const { images } = place;

  const { setSelectedPlace } = usePlacesStore();

  return (
    <Link href="/turistPoint" onClick={() => setSelectedPlace(place)}>
      <Flex
        marginX="8px"
        backgroundImage={`url('https://image-store-five.vercel.app/${images[0].id}.jpg')`}
        backgroundSize="cover"
        backgroundPosition="center"
        height="227px"
        width="243px"
        alignItems="end"
        borderRadius="20px"
      >
        <PlaceCardStatus status={calculateStatus(place)} />
        <PlaceCardOverlay place={place} />
      </Flex>
    </Link>
  );
};

export default PlaceCard;
