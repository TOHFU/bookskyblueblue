import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineLayerStyles,
  defineRecipe,
  defineSlotRecipe,
  defineTextStyles,
} from "@chakra-ui/react";

const textStyles = defineTextStyles({
  display: {
    value: {
      fontSize: "4xl",
      fontWeight: "700",
      lineHeight: "1.2",
    },
  },
  sectionTitle: {
    value: {
      fontSize: "2xl",
      fontWeight: "600",
      lineHeight: "1.3",
    },
  },
  body: {
    value: {
      fontSize: "md",
      fontWeight: "400",
      lineHeight: "1.6",
    },
  },
  caption: {
    value: {
      fontSize: "xs",
      fontWeight: "500",
      lineHeight: "1.4",
    },
  },
});

const layerStyles = defineLayerStyles({
  surface: {
    value: {
      bg: "bg.panel",
      borderWidth: "1px",
      borderColor: "border.subtle",
      borderRadius: "card",
      boxShadow: "sm",
    },
  },
  emphasis: {
    value: {
      bg: "bg",
      color: "fg.inverted",
      borderRadius: "card",
    },
  },
});

const buttonRecipe = defineRecipe({
  base: {
    borderRadius: "button",
    fontWeight: "600",
    transitionProperty: "common",
    transitionDuration: "moderate",
    _disabled: {
      bg: "interactive.disabled",
      color: "interactive.textDisabled",
      borderColor: "interactive.disabled",
      cursor: "not-allowed",
    },
  },
  variants: {
    variant: {
      solid: {
        bg: "bg",
        color: "fg.inverted",
        borderWidth: "1px",
        borderColor: "transparent",
        _hover: { bg: "interactive.hover", borderColor: "transparent" },
        _active: { bg: "interactive.active", borderColor: "transparent" },
      },
      subtle: {
        bg: "bg.subtle",
        color: "fg",
        borderWidth: "1px",
        borderColor: "border.subtle",
        _hover: { bg: "bg.muted" },
        _active: { bg: "bg.emphasized" },
      },
      outline: {
        bg: "transparent",
        color: "fg",
        borderWidth: "1px",
        borderColor: "border",
        _hover: { bg: "bg.subtle", borderColor: "border.emphasized" },
        _active: { bg: "bg.muted" },
      },
    },
    size: {
      sm: { h: "9", px: "3.5", textStyle: "sm" },
      md: { h: "10", px: "4", textStyle: "sm" },
      lg: { h: "11", px: "5", textStyle: "md" },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

const inputRecipe = defineRecipe({
  base: {
    width: "100%",
    borderRadius: "control",
    borderWidth: "1px",
    borderColor: "border.subtle",
    color: "fg",
    bg: "bg.panel",
    _placeholder: { color: "fg.subtle" },
    _disabled: {
      bg: "interactive.disabled",
      color: "interactive.textDisabled",
      borderColor: "interactive.disabled",
      cursor: "not-allowed",
    },
  },
  variants: {
    variant: {
      outline: {
        _hover: { borderColor: "border.emphasized" },
        _focusVisible: {
          borderColor: "interactive.focusRing",
          boxShadow: "0 0 0 1px var(--chakra-colors-interactive-focusRing)",
        },
      },
      subtle: {
        bg: "bg.subtle",
        borderColor: "transparent",
        _hover: { bg: "bg.muted" },
        _focusVisible: {
          bg: "bg.panel",
          borderColor: "interactive.focusRing",
          boxShadow: "0 0 0 1px var(--chakra-colors-interactive-focusRing)",
        },
      },
    },
    size: {
      sm: { h: "9", px: "3", textStyle: "sm" },
      md: { h: "10", px: "3.5", textStyle: "sm" },
      lg: { h: "11", px: "4", textStyle: "md" },
    },
  },
  defaultVariants: {
    variant: "outline",
    size: "md",
  },
});

const cardRecipe = defineSlotRecipe({
  slots: ["root", "header", "body", "footer", "title", "description"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      borderRadius: "card",
      borderWidth: "1px",
      borderColor: "border.subtle",
      bg: "bg.panel",
    },
    header: {
      px: "6",
      pt: "6",
      pb: "2",
    },
    body: {
      px: "6",
      py: "2",
      color: "fg",
      gap: "3",
    },
    footer: {
      px: "6",
      pb: "6",
      pt: "2",
      gap: "2",
    },
    title: {
      textStyle: "sectionTitle",
      color: "fg",
    },
    description: {
      textStyle: "body",
      color: "fg.muted",
    },
  },
  variants: {
    variant: {
      outline: {
        root: {
          layerStyle: "surface",
        },
      },
      subtle: {
        root: {
          bg: "bg.subtle",
          borderColor: "border.emphasized",
        },
      },
    },
  },
  defaultVariants: {
    variant: "outline",
  },
});

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: {
          value: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
        },
        body: {
          value: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
        },
      },
      fontSizes: {
        "3xs": { value: "0.625rem" },
        "2xs": { value: "0.75rem" },
        xs: { value: "0.875rem" },
        sm: { value: "1rem" },
        md: { value: "1.125rem" },
        lg: { value: "1.25rem" },
        xl: { value: "1.5rem" },
        "2xl": { value: "2rem" },
        "4xl": { value: "4rem" },
      },
      lineHeights: {
        "3.5": { value: "0.875rem" },
        "4": { value: "1rem" },
        "5": { value: "1.25rem" },
        "6": { value: "1.5rem" },
        "7": { value: "1.75rem" },
      },
      radii: {
        "2xs": { value: "1px" },
        xs: { value: "2px" },
        sm: { value: "4px" },
        md: { value: "12px" },
        lg: { value: "16px" },
        xl: { value: "24px" },
        "2xl": { value: "32px" },
        "3xl": { value: "36px" },
        "4xl": { value: "40px" },
        full: { value: "9999px" },
      },
      colors: {
        gray: {
          50: { value: "#fafafa" },
          100: { value: "#f4f4f5" },
          200: { value: "#e4e4e7" },
          300: { value: "#d4d4d8" },
          400: { value: "#a1a1aa" },
          500: { value: "#71717a" },
          600: { value: "#52525b" },
          700: { value: "#3f3f46" },
          800: { value: "#27272a" },
          900: { value: "#18181b" },
          950: { value: "#111111" },
        },
        red: {
          50: { value: "#fef2f2" },
          100: { value: "#fee2e2" },
          200: { value: "#fecaca" },
          300: { value: "#fca5a5" },
          400: { value: "#f87171" },
          500: { value: "#ef4444" },
          600: { value: "#dc2626" },
          700: { value: "#991919" },
          800: { value: "#511111" },
          900: { value: "#300c0c" },
          950: { value: "#1f0808" },
        },
        pink: {
          50: { value: "#FDF5F2" },
          100: { value: "#FBEDE8" },
          200: { value: "#F6DCD4" },
          300: { value: "#F0C0B1" },
          400: { value: "#E69880" },
          500: { value: "#DE7656" },
          600: { value: "#D5542D" },
          700: { value: "#9C3C1F" },
          800: { value: "#672814" },
          900: { value: "#3F180C" },
          950: { value: "#2B1008" },
        },
        purple: {
          50: { value: "#faf5ff" },
          100: { value: "#f3e8ff" },
          200: { value: "#e9d5ff" },
          300: { value: "#d8b4fe" },
          400: { value: "#c084fc" },
          500: { value: "#a855f7" },
          600: { value: "#9333ea" },
          700: { value: "#641ba3" },
          800: { value: "#4a1772" },
          900: { value: "#2f0553" },
          950: { value: "#1a032e" },
        },
        cyan: {
          50: { value: "#ecfeff" },
          100: { value: "#cffafe" },
          200: { value: "#a5f3fc" },
          300: { value: "#67e8f9" },
          400: { value: "#22d3ee" },
          500: { value: "#06b6d4" },
          600: { value: "#0891b2" },
          700: { value: "#0c5c72" },
          800: { value: "#134152" },
          900: { value: "#072a38" },
          950: { value: "#051b24" },
        },
        blue: {
          50: { value: "#EFFAFF" },
          100: { value: "#DBF2FE" },
          200: { value: "#BFE9FE" },
          300: { value: "#A5E0FD" },
          400: { value: "#5EC7FC" },
          500: { value: "#36B9FB" },
          600: { value: "#16AEFA" },
          700: { value: "#047DB9" },
          800: { value: "#03608F" },
          900: { value: "#023E5C" },
          950: { value: "#012639" },
        },
        teal: {
          50: { value: "#f0fdfa" },
          100: { value: "#ccfbf1" },
          200: { value: "#99f6e4" },
          300: { value: "#5eead4" },
          400: { value: "#2dd4bf" },
          500: { value: "#14b8a6" },
          600: { value: "#0d9488" },
          700: { value: "#0c5d56" },
          800: { value: "#114240" },
          900: { value: "#032726" },
          950: { value: "#021716" },
        },
        green: {
          50: { value: "#F2FBF5" },
          100: { value: "#E3F5E8" },
          200: { value: "#C6ECD0" },
          300: { value: "#98DDAB" },
          400: { value: "#4FC46E" },
          500: { value: "#3AAD59" },
          600: { value: "#2B8142" },
          700: { value: "#1F5C2F" },
          800: { value: "#174523" },
          900: { value: "#0B2010" },
          950: { value: "#07150B" },
        },
        yellow: {
          50: { value: "#F5F5F1" },
          100: { value: "#E6E5DB" },
          200: { value: "#CFCCB9" },
          300: { value: "#FFDD54" },
          400: { value: "#FFD00F" },
          500: { value: "#F2C200" },
          600: { value: "#CEA500" },
          700: { value: "#8D7100" },
          800: { value: "#4E4A35" },
          900: { value: "#312E21" },
          950: { value: "#1A1912" },
        },
        orange: {
          50: { value: "#FEF0EE" },
          100: { value: "#FEDDD6" },
          200: { value: "#FB8C76" },
          300: { value: "#FB8C76" },
          400: { value: "#F95D3E" },
          500: { value: "#F83D17" },
          600: { value: "#F95C3B" },
          700: { value: "#971D05" },
          800: { value: "#781704" },
          900: { value: "#3F0C02" },
          950: { value: "#250701" },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: "{colors.blue.600}" },
        "bg.subtle": { value: "{colors.blue.50}" },
        "bg.muted": { value: "{colors.blue.200}" },
        "bg.emphasized": { value: "{colors.blue.300}" },
        "bg.inverted": { value: "{colors.blue.800}" },
        "bg.panel": { value: "{colors.bg}" },
        "bg.error": { value: "{colors.red.700}" },
        "bg.warning": { value: "{colors.orange.700}" },
        "bg.success": { value: "{colors.green.800}" },
        "bg.info": { value: "{colors.blue.800}" },
        fg: { value: "{colors.blue.950}" },
        "fg.muted": { value: "{colors.cyan.800}" },
        "fg.subtle": { value: "{colors.blue.400}" },
        "fg.inverted": { value: "{colors.blue.50}" },
        "fg.error": { value: "{colors.red.500}" },
        "fg.warning": { value: "{colors.orange.600}" },
        "fg.success": { value: "{colors.green.600}" },
        "fg.info": { value: "{colors.blue.600}" },
        border: { value: "{colors.blue.950}" },
        "border.subtle": { value: "{colors.blue.900}" },
        "border.muted": { value: "{colors.blue.800}" },
        "border.emphasized": { value: "{colors.blue.300}" },
        "border.inverted": { value: "{colors.blue.800}" },
        "border.error": { value: "{colors.red.700}" },
        "border.warning": { value: "{colors.orange.700}" },
        "border.success": { value: "{colors.green.700}" },
        "border.info": { value: "{colors.blue.800}" },
        "interactive.hover": { value: "{colors.blue.700}" },
        "interactive.active": { value: "{colors.blue.800}" },
        "interactive.disabled": { value: "{colors.gray.200}" },
        "interactive.textDisabled": { value: "{colors.gray.500}" },
        "interactive.focusRing": { value: "{colors.blue.400}" },
      },
      radii: {
        "2xs": { value: "{radii.2xs}" },
        xs: { value: "{radii.xs}" },
        sm: { value: "{radii.sm}" },
        md: { value: "{radii.md}" },
        lg: { value: "{radii.lg}" },
        xl: { value: "{radii.xl}" },
        "2xl": { value: "{radii.2xl}" },
        "3xl": { value: "{radii.3xl}" },
        "4xl": { value: "{radii.4xl}" },
        full: { value: "{radii.full}" },
        control: { value: "{radii.md}" },
        button: { value: "{radii.lg}" },
        card: { value: "{radii.lg}" },
      },
    },
    textStyles,
    layerStyles,
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
    },
    slotRecipes: {
      card: cardRecipe,
    },
  },
});

export const appSystem = createSystem(defaultConfig, config);
