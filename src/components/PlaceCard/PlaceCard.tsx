import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Price from "./Price";
import Distance from "./Distance";
import { distanceBetweenCoords } from "@/utils/MapUtils";
import useLocationStore from "@/hooks/useLocationStore";
import PlaceCardStatus from "./PlaceCardStatus";
import { TuristPoint } from "@/services/types";
import Link from "next/link";
import usePlacesStore from "@/hooks/usePlacesStore";

interface PlaceCardProps {
  place: any;
  children: any;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const { images, name, type, entryPrice, longitude, latitude } = place;
  const { location } = useLocationStore();
  const distance = distanceBetweenCoords(location, { longitude, latitude });
  const { setSelectedPlace } = usePlacesStore();

  const calculateStatus = (place: TuristPoint) => {
    if (place.shouldContact) return "Indeterminado";

    const now = new Date();
    const workingHours = place[
      `day${now.getDay() + 1}` as keyof TuristPoint
    ] as string;

    if (!workingHours) return "Fechado";

    const times = workingHours.split(",");

    const results = times.find((val) => {
      const startingHour = val.split("-")[0];
      const finishingHour = val.split("-")[1];

      const start = new Date(`2000-01-01T${startingHour}:00`);
      var end = new Date(`2000-01-01T${finishingHour}:00`);
      if (end < start) end.setDate(end.getDate() + 1);

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const targetTime = `${hours}:${minutes}`;
      const target = new Date(`2000-01-01T${targetTime}:00`);

      return start <= target && target <= end;
    });

    return results ? "Aberto" : "Fechado";
  };

  return (
    <Link
      href="/turistPoint"
      marginX="8px"
      onClick={() => setSelectedPlace(place)}
    >
      <Flex
        backgroundImage={`url('https://image-store-five.vercel.app/${images[0].id}.jpg')`}
        backgroundSize="cover"
        backgroundPosition="center"
        height="227px"
        width="243px"
        alignItems="end"
        borderRadius="20px"
      >
        <PlaceCardStatus status={calculateStatus(place)} />
        <Grid
          width="full"
          backgroundColor="place-card-overlay"
          paddingX="16px"
          paddingY="8px"
          bottom="0"
          backdropFilter="blur(12px)"
          justifyContent="space-between"
          borderRadius="0px 0px 20px 20px"
          templateAreas={`"header header2"`}
          gridTemplateColumns={"130px 70px"}
          gap="3px"
        >
          <GridItem
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            <VStack align="left" gap="0">
              <Text fontSize="18px" color="white">
                {name}
              </Text>
              <Text fontSize="14px" color="white">
                {type}
              </Text>
            </VStack>
          </GridItem>

          <GridItem alignContent="center">
            <VStack align="end" gap="3px" flexGrow={1} flex={1}>
              <Price price={entryPrice} />
              <Distance distance={distance} />
            </VStack>
          </GridItem>
        </Grid>
      </Flex>
    </Link>
  );
};

export default PlaceCard;
