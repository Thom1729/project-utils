export * from './helpers.js';
export * from './input.js';
export * from './select.js';

import { type FC } from 'react';
import type { ExtendBuiltin } from './helpers.js';

export const Button: FC<ExtendBuiltin<'button'>> = ({
  type = 'button',
  ...rest
}) => <button type={type} {...rest} />;
