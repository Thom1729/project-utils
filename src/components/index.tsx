export * from './helpers.js';
export * from './input.js';
export * from './select.js';

import type { FC, ReactNode } from 'react';
import type { ExtendBuiltin } from './helpers.js';

export const Button: FC<ExtendBuiltin<'button', { label?: ReactNode }>> = ({
  type = 'button',
  label,
  children,
  ...rest
}) => {
  if (label !== undefined && label !== null && children !== null ) {
    throw new TypeError(`can't provide both label prop and children`);
  }
  return <button
    type={type}
    children={label ?? children}
    {...rest}
  />;
}
