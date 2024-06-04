import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import TranscriptionTab from "./TranscriptionTab";
import InformationsTab from "./InformationsTab";

const TuristPointTabs = () => {
  return (
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
          <InformationsTab />
        </TabPanel>
        <TabPanel paddingX={0}>
          <TranscriptionTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TuristPointTabs;
