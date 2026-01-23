import {
  useMemo,
  type ChangeEvent,
} from 'react';

import { useWrappedHandler, type ExtendBuiltin } from './helpers';

export type SelectOptionLeaf<TValue> =
| {
  value: TValue & (string | number),
  key?: string | number,
  label?: string,
  children?: undefined,
}
| {
  value: TValue,
  key: string | number,
  label: string,
  children?: undefined,
};

export type SelectOption<TValue> =
| SelectOptionLeaf<TValue>
| {
  value?: undefined,
  key: string | number,
  label: string,
  children: readonly SelectOption<TValue>[],
};

function *iterateOptions<TValue>(
  options: readonly SelectOption<TValue>[],
): Iterable<SelectOptionLeaf<TValue>> {
  for (const option of options) {
    if (option.children !== undefined) {
      yield* iterateOptions(option.children);
    } else {
      yield option;
    }
  }
}

export function getSelectMaps<TValue>(
  options: readonly SelectOption<TValue>[],
) {
  const optionsArray = Array.from(iterateOptions(options));

  return {
    keyToValue: new Map(optionsArray.map(({ key, value }) => [key ?? (value as string | number), value])),
    valueToKey: new Map(optionsArray.map(({ key, value }) => [value, key ?? (value as string | number)])),
  };
}

export function Select<const TValue>({
  options,
  value,
  onChange,
  ...rest
}: ExtendBuiltin<
  'select',
  {
    options: readonly SelectOption<TValue>[],
    value: TValue,
    onChange?: ((value: TValue) => void) | undefined,
  },
  'children'
>) {
  const { keyToValue, valueToKey } = useMemo(() => getSelectMaps(options), [options]);

  const onChangeCallback = useWrappedHandler<ChangeEvent<HTMLSelectElement>, TValue>(
    onChange,
    event => {
      const result = keyToValue.get(event.currentTarget.value);
      if (result === undefined) throw new TypeError(typeof event.currentTarget.value);
      return result;
    },
    [onChange, keyToValue],
  );

  const selectedKey = valueToKey.get(value);
  if (selectedKey === undefined) throw new TypeError();

  return <select
    onChange={onChangeCallback}
    value={selectedKey}
    {...rest}
  >
    <SelectOptions options={options} />
  </select>;
};

function SelectOptions<TValue>({
  options,
}: {
  options: readonly SelectOption<TValue>[],
}) {
  return <>
    {options.map(option => {
      if (option.children !== undefined) {
        return <optgroup
          key={option.key}
          label={option.label}
        >
          <SelectOptions options={option.children}/>
        </optgroup>
      } else {
        return <option
          key={option.key ?? (option.value as string | number)}
          value={option.key ?? (option.value as string | number)}
        >
          {option.label}
        </option>;
      }
    })}
  </>;
}
