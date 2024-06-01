import { HStack } from "@chakra-ui/react";
import { faDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PriceProps {
  price: number;
}

const Price: React.FC<PriceProps> = ({ price }) => {
  const category = price / 10;

  const icons = Array.from({ length: 5 }, (_, index) => {
    const isActive = index < category;

    return (
      <FontAwesomeIcon
        key={index}
        icon={faDollar}
        height="16"
        color={isActive ? "color3" : "disable"}
      />
    );
  });

  return <HStack align="end" gap={0}>{icons}</HStack>;
};

export default Price;
