import usePlacesStore from "@/hooks/usePlacesStore";
import { HStack, Tag, TagLabel } from "@chakra-ui/react";

const Tags = () => {
  const { selectedPlace } = usePlacesStore();
  const { tags } = selectedPlace || {};

  return (
    <HStack marginY="12px">
      {tags?.map((tag: string, index: React.Key) => (
        <Tag key={index} size="lg" backgroundColor="color3" borderRadius="full">
          <TagLabel>{tag}</TagLabel>
        </Tag>
      ))}
    </HStack>
  );
};

export default Tags;
