import { useMemo } from 'react';

import {
  ObjectSubstateProvider, ArraySubstateProvider,
  type StateUpdater,
} from './providers.js';

export function useObjectSubstates<TBase extends object>(
  setState: StateUpdater<TBase>,
) {
  return useMemo(() => new ObjectSubstateProvider(setState), [setState]);
}

export function useArraySubstates<TItem>(
  setState: StateUpdater<TItem[], readonly TItem[]>,
) {
  return useMemo(() => new ArraySubstateProvider(setState), [setState]);
}
