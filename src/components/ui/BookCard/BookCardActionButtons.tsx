"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { ArrowRight, X } from "lucide-react";
import type { Work } from "@/domain/entities/work";

type BookCardActionButtonsProps = {
  work: Work;
  showDeleteButton: boolean;
  showDetailButton: boolean;
  onDelete?: (work: Work) => void;
  onDetail?: (work: Work) => void;
};

export function BookCardActionButtons({
  work,
  showDeleteButton,
  showDetailButton,
  onDelete,
  onDetail,
}: BookCardActionButtonsProps) {
  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      alignItems="flex-end"
      alignSelf="stretch"
      flexShrink={0}
      minW="8"
    >
      {showDeleteButton && (
        <IconButton
          aria-label="削除"
          variant="outline"
          size="xs"
          borderColor="border"
          color="fg"
          w="8"
          h="8"
          position="absolute"
          top="-2px"
          right="-2px"
          onClick={(e) => { e.stopPropagation(); onDelete?.(work); }}
        >
          <X size={16} />
        </IconButton>
      )}
      {showDetailButton && (
        <IconButton
          aria-label="詳細を見る"
          variant="outline"
          size="xs"
          borderColor="border"
          color="fg"
          w="8"
          h="8"
          position="relative"
          bottom="-2px"
          right="-2px"
          onClick={(e) => { e.stopPropagation(); onDetail?.(work); }}
        >
          <ArrowRight size={16} />
        </IconButton>
      )}
    </Box>
  );
}
