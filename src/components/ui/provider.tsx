"use client";

import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { appSystem } from "@/styles/theme";
import { ColorModeProvider } from "@/components/ui/color-mode";

type ProviderProps = {
  children: ReactNode;
};

export function Provider({ children }: ProviderProps) {
  return (
    <ColorModeProvider>
      <ChakraProvider value={appSystem}>{children}</ChakraProvider>
    </ColorModeProvider>
  );
}