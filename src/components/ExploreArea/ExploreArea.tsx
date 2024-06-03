import { HStack, Text, VStack } from "@chakra-ui/react";
import PlaceCard from "../PlaceCard";
import { TuristPoint } from "@/services/types";

const ExploreArea = ({ places }) => {
  return (
    <VStack
      paddingY="24px"
      position="absolute"
      bottom={0}
      backgroundColor="background"
      borderTopLeftRadius={17}
      borderTopRightRadius={17}
      flex={1}
      overflow="auto"
      width="full"
      align="left"
    >
      <Text
        fontFamily="inherit"
        color="primary-text"
        fontSize="16px"
        margin="16px"
        marginTop={0}
      >
        Próximos a você
      </Text>

      <HStack paddingX="8px" minW="full" overflowX="auto">
        {places.map((place: TuristPoint, index: number) => (
          <PlaceCard key={index} place={place} />
        ))}
      </HStack>
    </VStack>
  );
};

export default ExploreArea;
