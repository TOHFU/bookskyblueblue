import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingSpinner } from "./LoadingSpinner";
import { appSystem } from "@/styles/theme";

describe("LoadingSpinner", () => {
  it("status ロールで読み込み中を伝える", () => {
    render(
      <ChakraProvider value={appSystem}>
        <LoadingSpinner />
      </ChakraProvider>,
    );
    expect(screen.getByRole("status", { name: "読み込み中" })).toBeInTheDocument();
  });
});
