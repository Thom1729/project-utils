import { useMemo, useEffect } from 'react';

export type EventTypes<TTarget extends EventTarget> = {
  [K in keyof TTarget as (K extends `on${infer Name}` ? Name : never)]:
    Exclude<TTarget[K], null | undefined> extends ((event: infer TEvent extends Event) => unknown)
      ? TEvent
      : never
};

export function useEventListener<
  TTarget extends EventTarget,
  TEventType extends keyof EventTypes<TTarget>
>(
  target: TTarget | undefined,
  type: TEventType,
  listener: ((event: EventTypes<TTarget>[TEventType]) => void) | undefined,
  dependencies: readonly unknown[],
): void;

export function useEventListener(
  target: EventTarget | undefined,
  type: string,
  listener: ((event: Event) => void) | undefined,
  dependencies: readonly unknown[],
): void;

export function useEventListener(
  target: EventTarget | undefined,
  type: string,
  listener: ((event: Event) => void) | undefined,
  dependencies: readonly unknown[],
) {
  const callback = useMemo(() => listener, dependencies);

  useEffect(() => {
    if (target !== undefined && callback !== undefined) {
      target.addEventListener(type, callback);

      return () => { target.removeEventListener(type, callback) };
    }
  }, [target, type, callback]);
}
