import { type ChakraComponent, type SystemStyleObject } from '@chakra-ui/react'
import { infer, type Inferable } from '@n2m/core-modules'
import React, { type ComponentProps, type ForwardRefExoticComponent, type RefAttributes } from 'react'

export function styled<C extends ChakraComponent<any, any>, P extends Record<string, any>>(
  Component: C,
  baseCss: Inferable<SystemStyleObject, P> = {}
) {
  return React.forwardRef<any, P>((props, ref) => {
    const inferredCss = infer(baseCss, props)
    const finalCss = props.css
      ? Array.isArray(props.css)
        ? [inferredCss, ...props.css]
        : [inferredCss, props.css]
      : inferredCss

    // @ts-ignore
    return <Component ref={ref} {...props} css={finalCss} />
  }) as ForwardRefExoticComponent<ComponentProps<C> & P & { children?: React.ReactNode } & RefAttributes<any>>
}

export type ExtractChakraProps<T> =
  T extends ChakraComponent<infer BaseProps, infer ExtendedProps> ? BaseProps & ExtendedProps : never

export type StyledComponentProps<C extends ChakraComponent<any, any>, P extends Record<string, any>> = React.FC<
  ExtractChakraProps<ChakraComponent<ComponentProps<C>, P & { children?: React.ReactNode }>>
>
