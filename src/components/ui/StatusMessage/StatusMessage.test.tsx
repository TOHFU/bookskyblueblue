import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusMessage } from "./StatusMessage";
import { appSystem } from "@/styles/theme";

describe("StatusMessage", () => {
  it("status ロールでメッセージを表示する", () => {
    render(
      <ChakraProvider value={appSystem}>
        <StatusMessage>読み込み中...</StatusMessage>
      </ChakraProvider>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("読み込み中...");
  });
});
