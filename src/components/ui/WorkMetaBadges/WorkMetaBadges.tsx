"use client";

import { Badge, Flex } from "@chakra-ui/react";

const BADGE_MAX_LENGTH = 6;

type WorkMetaBadgesProps = {
  writingStyle?: string;
  publisher?: string;
};

function truncateBadgeLabel(value: string): string {
  return value.length > BADGE_MAX_LENGTH
    ? `${value.slice(0, BADGE_MAX_LENGTH)}…`
    : value;
}

/**
 * 文字遣い種別・出版社バッジ。BookCard / WorkDetailCard で共有する。
 */
export function WorkMetaBadges({
  writingStyle,
  publisher,
}: WorkMetaBadgesProps) {
  if (!writingStyle && !publisher) {
    return null;
  }

  return (
    <Flex
      direction="row"
      justify="flex-start"
      align="center"
      gap="2"
      flexWrap="wrap"
      minH="10"
    >
      {writingStyle && (
        <Badge
          variant="outline"
          fontSize="2xs"
          fontWeight="600"
          lineHeight="16px"
          color="gray.800"
          borderColor="border"
          borderWidth="2px"
          bg="transparent"
          boxShadow="none"
          px="1.5"
          h="5"
          display="flex"
          alignItems="center"
        >
          {truncateBadgeLabel(writingStyle)}
        </Badge>
      )}
      {publisher && (
        <Badge
          variant="outline"
          fontSize="2xs"
          fontWeight="600"
          lineHeight="16px"
          color="gray.800"
          borderColor="border"
          borderWidth="2px"
          bg="transparent"
          boxShadow="none"
          px="1.5"
          h="5"
          display="flex"
          alignItems="center"
        >
          {truncateBadgeLabel(publisher)}
        </Badge>
      )}
    </Flex>
  );
}
