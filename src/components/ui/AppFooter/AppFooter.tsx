import { Box, Link, Text } from "@chakra-ui/react";
import Image from "next/image";

/**
 * TOP / Offline などで共有するアプリフッター
 */
export function AppFooter() {
  return (
    <Box
      as="footer"
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      gap="2.5"
      pt="32"
      w="full"
    >
      <Image
        src="/images/footer-logo.svg"
        alt="BOOK SKY, BLUE BLUE"
        width={40.24}
        height={74.92}
        priority={false}
      />

      <Link
        href="https://tohfu-tronica.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        textDecoration="underline"
        fontSize="12px"
        lineHeight="16px"
        fontWeight="400"
        color="fg"
      >
        tohfu-tronica.netlify.app
      </Link>

      <Text fontSize="12px" lineHeight="16px" fontWeight="400" color="fg">
        © tohfu-tronica
      </Text>
    </Box>
  );
}
