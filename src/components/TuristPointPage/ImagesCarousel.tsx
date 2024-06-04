import usePlacesStore from "@/hooks/usePlacesStore";
import { HStack, Image } from "@chakra-ui/react";

const ImagesCarousel = () => {
  const { selectedPlace } = usePlacesStore();
  const { images } = selectedPlace || {};

  return (
    <HStack marginTop="40px" gap="0" overflowX="auto">
      {images?.map((image: any, index: React.Key) => (
        <Image
          cursor="pointer"
          key={index}
          //   onClick={() => setSelectedImage(image)}
          src={`https://image-store-five.vercel.app/${image?.id}.jpg`}
          height={175}
          style={{
            marginLeft: index === 0 ? 0 : 8,
          }}
        />
      ))}
    </HStack>
  );
};

export default ImagesCarousel;
