import { ChakraProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppScreenBackground } from "./AppScreenBackground";
import { appSystem } from "@/styles/theme";

describe("AppScreenBackground", () => {
  it("装飾背景として aria-hidden になる", () => {
    const { container } = render(
      <ChakraProvider value={appSystem}>
        <AppScreenBackground />
      </ChakraProvider>,
    );
    const background = container.querySelector("[aria-hidden='true']");
    expect(background).not.toBeNull();
  });
});
