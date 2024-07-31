import { defineRecipe } from '@chakra-ui/react'

export const buttonRecipe = defineRecipe({
  base: {
    display: 'inline-flex',
    appearance: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    position: 'relative',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    lineHeight: '1.2',
    isolation: 'isolate',
  },

  variants: {
    variant: {
      brand: {
        position: 'relative',
        overflow: 'hidden',
        px: 6,
        transition: 'all 0.25s ease',

        _before: {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // bgGradient: `linear(to-b, ${colorScheme}.focus, ${colorScheme}.active)`,
          bgGradient: 'to-b',
          gradientFrom: 'accent.focus',
          gradientTo: 'accent.active',
          zIndex: -1,
          transition: 'opacity 0.3s ease',
        },

        _after: {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // bgGradient: `linear(to-r, ${colorScheme}.focus, ${colorScheme}.active)`,
          bgGradient: 'to-r',
          gradientFrom: 'accent.focus',
          gradientTo: 'accent.active',
          zIndex: -1,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },

        _hover: {
          boxShadow: 'accent',
          transition: 'all 0.3s ease',
          _after: {
            opacity: 1,
          },
        },

        _active: {
          _before: {
            // bgGradient: `linear(to-b, ${colorScheme}.active, ${colorScheme}.active)`,
            bgGradient: 'to-b',
            gradientFrom: 'accent.active',
            gradientTo: 'accent.active',
          },
          _after: {
            opacity: 0,
          },
          boxShadow: 'none',
        },

        _disabled: {
          opacity: 0.6,
          cursor: 'not-allowed',
          _before: {
            // bgGradient: `linear(to-b, ${colorScheme}.focus, ${colorScheme}.active)`,

            bgGradient: 'to-b',
            gradientFrom: 'accent.focus',
            gradientTo: 'accent.active',
          },
          _after: {
            opacity: 0,
          },
        },
      },
      base: {
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        px: 0,
        mx: 0,
      },
      solid: {
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        bg: 'primary.main',
        _hover: {
          bg: 'primary.focus',
        },
      },
    },
  },
})

// import { ComponentStyleConfig, theme as baseTheme } from '@chakra-ui/react'

// export const buttonTheme: ComponentStyleConfig = {
//   defaultProps: {
//     colorScheme: 'primary',
//     variant: 'text',
//     size: 'md',
//   },
//   baseStyle: {
//     ...baseTheme.components.Button.baseStyle,
//     rounded: 'xl',
//     fontSize: 'sm',
//     fontWeight: 700,
//   },
//   sizes: {
//     md: {
//       h: 10,
//       fontSize: 'sm',
//       px: 2,
//     },
//   },
//   variants: {
//     solid: ({ colorScheme }) => ({
//       position: 'relative',
//       overflow: 'hidden',
//       px: 6,
//       transition: 'all 0.25s ease',
//       bg: 'primary.main',
//       _hover: {
//         bg: 'primary.focus',
//       },
//     }),
//   solidBrand: ({ colorScheme }) => {
//     return {
//       position: 'relative',
//       overflow: 'hidden',
//       px: 6,
//       transition: 'all 0.25s ease',

//       _before: {
//         content: '""',
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         bgGradient: `linear(to-b, ${colorScheme}.focus, ${colorScheme}.active)`,
//         zIndex: -1,
//         transition: 'opacity 0.3s ease',
//       },

//       _after: {
//         content: '""',
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         bgGradient: `linear(to-r, ${colorScheme}.focus, ${colorScheme}.active)`,
//         zIndex: -1,
//         opacity: 0,
//         transition: 'opacity 0.3s ease',
//       },

//       _hover: {
//         boxShadow: 'accent',
//         transition: 'all 0.3s ease',
//         _after: {
//           opacity: 1,
//         },
//       },

//       _active: {
//         _before: {
//           bgGradient: `linear(to-b, ${colorScheme}.active, ${colorScheme}.active)`,
//         },
//         _after: {
//           opacity: 0,
//         },
//         boxShadow: 'none',
//       },

//       _disabled: {
//         opacity: 0.6,
//         cursor: 'not-allowed',
//         _before: {
//           bgGradient: `linear(to-b, ${colorScheme}.focus, ${colorScheme}.active)`,
//         },
//         _after: {
//           opacity: 0,
//         },
//       },
//     }
//   },
// },
// }
