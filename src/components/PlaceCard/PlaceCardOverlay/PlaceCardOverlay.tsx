import { Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import Price from "./Price";
import Distance from "./Distance";
import useLocationStore from "@/hooks/useLocationStore";
import { distanceBetweenCoords } from "@/utils/MapUtils";

interface PlaceCardOverlayProps {
  place: any;
}

const PlaceCardOverlay: React.FC<PlaceCardOverlayProps> = ({ place }) => {
  const { entryPrice, name, type } = place || {};
  const {
    location: { longitude, latitude },
  } = useLocationStore();

  const { location } = useLocationStore();
  const distance = distanceBetweenCoords(location, { longitude, latitude });

  return (
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
      <GridItem overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
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
  );
};

export default PlaceCardOverlay;
