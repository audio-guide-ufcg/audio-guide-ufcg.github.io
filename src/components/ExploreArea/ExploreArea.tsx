import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import PlaceCard from "../PlaceCard";

const ExploreArea = () => {
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

      <HStack paddingX={8}>
        <PlaceCard />
      </HStack>

      {/* {hasMoreThanOnePlace && (
        <ScrollView horizontal contentContainerStyle={styles.places}>
          {orderedPlaces.map((place: TuristPoint, index: number) => (
            <PlaceCard key={index} {...place} />
          ))}
        </ScrollView>
      )}

      {!hasMoreThanOnePlace && (
        <View style={styles.places}>
          {orderedPlaces.map((place: TuristPoint, index: number) => (
            <PlaceCard key={index} {...place} />
          ))}
        </View>
      )}

      {orderedPlaces?.length === 0 && (
        <Text style={{ paddingHorizontal: 16, textAlign: "center" }}>
          Não há pontos próximos
        </Text>
      )} */}
    </VStack>
  );
};

export default ExploreArea;
