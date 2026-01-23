import { useMemo } from 'react';

export type ExtendBuiltin<
  TElementName extends keyof JSX.IntrinsicElements,
  TAdditional extends object = {},
  TOmit extends string = never,
> = TAdditional & Omit<JSX.IntrinsicElements[TElementName], keyof TAdditional | TOmit>;

export function useWrappedHandler<TEvent, TReturn>(
  callback: undefined | ((value: TReturn) => void),
  convert: (event: TEvent) => TReturn,
  dependencies: readonly unknown[],
) {
  return useMemo(
    () => callback && ((event: TEvent) => {
      callback(convert(event));
    }),
    [dependencies], // eslint-disable-line react-hooks/exhaustive-deps
  );
}
