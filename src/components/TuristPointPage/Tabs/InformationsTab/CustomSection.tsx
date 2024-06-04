import { Heading } from "@chakra-ui/react";

interface CustomSectionProps {
  children: any;
  title: string;
}

const CustomSection: React.FC<CustomSectionProps> = ({ children, title }) => {
  return (
    <>
      <Heading
        fontSize="16px"
        textTransform="uppercase"
        fontFamily="Montserrat-Black"
      >
        {title}
      </Heading>
      {children}
    </>
  );
};

export default CustomSection;
