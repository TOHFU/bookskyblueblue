"use client";

import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { appSystem } from "@/styles/theme";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <ChakraProvider value={appSystem}>{children}</ChakraProvider>;
}
