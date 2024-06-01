import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import Price from "./Price";
import Distance from "./Distance";

interface PlaceCardProps {
  source: string;
  children: any;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ source }) => {
  return (
    // <Link
    //   href="/place"
    //   style={{ marginHorizontal: 8 }}
    //   onPress={() => setSelectedPlace(place)}
    // >
    <Flex
      backgroundImage={`url('https://images02.brasildefato.com.br/79b91aa53cb659f174855ab73e1b535c.jpeg')`}
      height="227px"
      width="243px"
      alignItems="end"
      borderRadius="20px"
      overflow="hidden"
    >
      {/* <PlaceCardStatus status={calculateStatus(place)} /> */}
      <HStack
        width="full"
        backgroundColor="placeCardBlur"
        paddingX="16px"
        paddingY="8px"
        bottom="0"
        backdropFilter="12"
        justifyContent="space-between"
      >
        <VStack align="left" gap="0">
          <Text fontSize="18px" color="white">
            Teste
          </Text>
          <Text fontSize="14px" color="white">
            Testee
          </Text>
        </VStack>

        <VStack align="left" gap="0">
          <Price />
          <Distance />
        </VStack>
      </HStack>
    </Flex>
  );
};

export default PlaceCard;
