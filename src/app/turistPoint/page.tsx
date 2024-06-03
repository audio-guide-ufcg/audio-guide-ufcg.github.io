"use client";

import usePlacesStore from "@/hooks/usePlacesStore";
import { useState } from "react";
import {
  Box,
  Circle,
  HStack,
  Heading,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Divider from "@/components/Divider";
import { useRouter } from "next/router";

const TuristPoint = () => {
//   const router = useRouter();
  const { selectedPlace } = usePlacesStore();

  const [selectedImage, setSelectedImage] = useState("");

  const { address, images, tags, name, type, transcript, entryPrice } =
    selectedPlace || {};

  const formatWorkingHours = () => {
    if (selectedPlace?.shouldContact)
      return <Text color="primaryText">Entrar em contato</Text>;

    const weekDays = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    return (
      <HStack gap="10px">
        <VStack align="left">
          {weekDays.map((val, index) => (
            <Text key={index} fontFamily="Montserrat-Bold" color="primary-text">
              {val}
            </Text>
          ))}
        </VStack>
        <VStack align="left">
          {weekDays.map((val, index) => {
            const text = selectedPlace?.[`day${index + 1}`]
              ? `${selectedPlace?.[`day${index + 1}`]}`
              : "Fechado";

            return (
              <Text key={index} color="primary-text">
                {text}
              </Text>
            );
          })}
        </VStack>
      </HStack>
    );
  };

  const formatPrice = (price: number) => {
    if (price === -1) {
      return "Entrar em contato";
    }

    if (price == 0) {
      return "Gratuita";
    }

    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: "currency",
      currency: "BRL",
    };

    return price?.toLocaleString("pt-BR", options);
  };

  return (
    <VStack
      backgroundColor="background"
      minH="100%"
      color="primary-text"
      align="left"
      gap={0}
    >
      <Circle
        position="absolute"
        top="52px"
        left="8px"
        borderRadius="100px"
        backgroundColor="bgButton"
        zIndex="1"
        textAlign="center"
        width="32px"
        height="32px"
        cursor="pointer"
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          fontSize={16}
        //   onClick={() => router.back()}
        />
      </Circle>
      <HStack marginTop="40px" gap="0" overflowX="auto">
        {images?.map((image: any, index: React.Key) => (
          <Image
            cursor="pointer"
            key={index}
            onClick={() => setSelectedImage(image)}
            src={`https://image-store-five.vercel.app/${image?.id}.jpg`}
            style={{
              height: 175,
              aspectRatio: 16 / 9,
              marginLeft: index === 0 ? 0 : 8,
            }}
          />
        ))}
      </HStack>

      <VStack padding="16px" align="left" gap={0}>
        <Text fontSize={14} textTransform="uppercase">
          {type}
        </Text>
        <Divider />
        <Text fontSize="20px" textTransform="uppercase">
          {name}
        </Text>

        <HStack marginY="12px">
          {tags?.map((tag: string, index: React.Key) => (
            <Tag
              key={index}
              size="lg"
              backgroundColor="color3"
              borderRadius="full"
            >
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))}
        </HStack>

        {/* <AudioPlayer /> */}

        <Tabs isFitted>
          <TabList>
            <Tab
              borderColor="primary-text"
              _selected={{ color: "color1", borderColor: "color1" }}
            >
              Informações
            </Tab>
            <Tab
              borderColor="primary-text"
              _selected={{ color: "color1", borderColor: "color1" }}
            >
              Transcrição
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel paddingX={0}>
              <VStack paddingBottom="18px" align="left">
                <Heading
                  fontSize="16px"
                  textTransform="uppercase"
                  fontFamily="Montserrat-Black"
                >
                  Horários
                </Heading>
                {formatWorkingHours()}
                <Divider />
                <Heading
                  fontSize="16px"
                  textTransform="uppercase"
                  fontFamily="Montserrat-Black"
                >
                  Entrada
                </Heading>
                <Text>{formatPrice(entryPrice)}</Text>
                <Divider />
                <Heading
                  fontSize="16px"
                  textTransform="uppercase"
                  fontFamily="Montserrat-Black"
                >
                  Endereço
                </Heading>
                <Text>{address}</Text>
              </VStack>
            </TabPanel>
            <TabPanel paddingX={0}>
              <Box>
                <Text
                  flexDirection="column"
                  fontSize="14px"
                  textAlign="justify"
                >
                  {transcript?.text}
                </Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </VStack>
  );
};

export default TuristPoint;
