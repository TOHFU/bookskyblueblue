import { ChakraProvider } from "@chakra-ui/react";
import type { Preview } from "@storybook/nextjs";
import "../src/app/globals.css";
import { appSystem } from "../src/styles/theme";

const preview: Preview = {
  decorators: [(Story) => <ChakraProvider value={appSystem}><Story /></ChakraProvider>],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      expanded: true,
      sort: "requiredFirst",
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;