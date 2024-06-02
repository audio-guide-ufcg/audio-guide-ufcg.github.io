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

interface PlaceCardProps {
  source: string;
  children: any;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ images, name, type }) => {
  return (
    // <Link
    //   href="/place"
    //   style={{ marginHorizontal: 8 }}
    //   onPress={() => setSelectedPlace(place)}
    // >
    <Flex
      backgroundImage={`url('https://image-store-five.vercel.app/${images[0].id}.jpg')`}
      backgroundSize="cover"
      backgroundPosition="center"
      height="227px"
      width="243px"
      alignItems="end"
      borderRadius="20px"
    >
      {/* <PlaceCardStatus status={calculateStatus(place)} /> */}
      <Grid
        width="full"
        backgroundColor="placeCardBlur"
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
            <Price />
            <Distance />
          </VStack>
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default PlaceCard;
