"use client";

import { Box, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace("/");
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <Box as="main" minH="100dvh" display="grid" placeItems="center" bg="bg" color="fg.inverted" px="6">
      <VStack gap="5" textAlign="center">
        <Heading size="3xl">Book Sky, Blue Blue</Heading>
        <Text>青空文庫を読み込んでいます...</Text>
        <Spinner size="xl" color="blue.200" />
      </VStack>
    </Box>
  );
}
