import {
  type FC,
  type ChangeEvent,
} from 'react';

import { useWrappedHandler, type ExtendBuiltin } from './helpers';

export const TextInput: FC<ExtendBuiltin<'input', {
  value: string,
  onChange?: (value: string) => void,
}>> = ({
  type = 'text',
  value,
  onChange,
  ...rest
}) => {
  const onChangeCallback = useWrappedHandler<ChangeEvent<HTMLInputElement>, string>(
    onChange,
    event => event.currentTarget.value,
    [onChange],
  );

  return <input
    type={type}
    value={value}
    onChange={onChangeCallback}
    {...rest}
  />
};

export const NumberInput: FC<ExtendBuiltin<'input', {
  value: number,
  onChange?: (value: number) => void,
}>> = ({
  type = 'number',
  value,
  onChange,
  ...rest
}) => {
  const onChangeCallback = useWrappedHandler<ChangeEvent<HTMLInputElement>, number>(
    onChange,
    event => event.currentTarget.valueAsNumber,
    [onChange],
  );

  return <input
    type={type}
    value={value}
    onChange={onChangeCallback}
    {...rest}
  />
};

export const CheckboxInput: FC<ExtendBuiltin<'input', {
  value: boolean,
  onChange?: (value: boolean) => void,
}, 'checked' | 'type'>> = ({
  value,
  onChange,
  ...rest
}) => {
  const onChangeCallback = useWrappedHandler<ChangeEvent<HTMLInputElement>, boolean>(
    onChange,
    event => event.currentTarget.checked,
    [onChange],
  );

  return <input
    type='checkbox'
    checked={value}
    onChange={onChangeCallback}
    {...rest}
  />
};
