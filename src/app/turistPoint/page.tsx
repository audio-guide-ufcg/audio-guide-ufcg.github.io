"use client";

import { VStack } from "@chakra-ui/react";
import TuristPointTabs from "@/components/TuristPointPage/Tabs";
import BackButton from "@/components/TuristPointPage/BackButton";
import Tags from "@/components/TuristPointPage/Tags";
import ImagesCarousel from "@/components/TuristPointPage/ImagesCarousel";
import Info from "@/components/TuristPointPage/Info";

const TuristPointPage = () => {
  return (
    <VStack
      backgroundColor="background"
      minH="100%"
      color="primary-text"
      align="left"
      gap={0}
    >
      <BackButton />

      <ImagesCarousel />

      <VStack padding="16px" align="left" gap={0}>
        <Info />

        <Tags />

        {/* <AudioPlayer /> */}

        <TuristPointTabs />
      </VStack>
    </VStack>
  );
};

export default TuristPointPage;
