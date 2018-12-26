// Type definitions for react-hyperscript 3.0
// Project: https://github.com/mlmorg/react-hyperscript
// Definitions by: tock203 <https://github.com/tock203>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

declare module 'react-hyperscript' {
  import {
    FunctionComponent,
    ComponentClass,
    StatelessComponent,
    ReactElement,
  } from 'react';

  namespace h {}

  type Element = ReactElement<any> | string | number | null;

  function h(
    componentOrTag:
      | FunctionComponent
      | ComponentClass
      | StatelessComponent
      | string,
    children?: ReadonlyArray<Element> | Element,
  ): ReactElement<any>;

  function h<P extends { [attr: string]: any }>(
    componentOrTag:
      | FunctionComponent<P>
      | ComponentClass<P>
      | StatelessComponent<P>
      | string,
    properties: P,
    children?: ReadonlyArray<Element> | Element,
  ): ReactElement<P>;

  export = h;
}
