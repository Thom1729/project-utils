import type { SetStateAction } from 'react';
import {
  ObjectSubstateProvider, ArraySubstateProvider,
  applyStateUpdater,
} from './providers.js';

class MockState<T> {
  state: T;

  constructor(state: T) {
    this.state = state;
  }

  setState(action: SetStateAction<T>) {
    this.state = applyStateUpdater(action, this.state);
  };
}

describe(ObjectSubstateProvider, () => {
  type State = {
    string: string;
    optional?: string;
    number: number;
  };

  const initialState: State = {
    string: 'a',
    optional: 'a',
    number: 1,
  };

  function setup() {
    const mockState = new MockState(initialState);
    const provider = new ObjectSubstateProvider(mockState.setState.bind(mockState));
    return [mockState, provider] as const;
  }

  test('set', () => {
    const [mockState, provider] = setup();

    expect(provider.set('string')).toBe(provider.set('string'));

    provider.set('string')('b');
    expect(mockState.state).toStrictEqual({
      string: 'b',
      optional: 'a',
      number: 1,
    });
  });

  test('delete', () => {
    const [mockState, provider] = setup();

    expect(provider.delete('optional')).toBe(provider.delete('optional'));

    provider.delete('optional')();
    expect(mockState.state).not.toHaveProperty('optional');
  });
});

describe(ArraySubstateProvider, () => {
  function setup() {
    const mockState = new MockState([0, 1, 2]);
    const provider = new ArraySubstateProvider(mockState.setState.bind(mockState));
    return [mockState, provider] as const;
  }

  test('set', () => {
    const [mockState, provider] = setup();

    expect(provider.set(0)).toBe(provider.set(0));

    provider.set(0)(10);
    expect(mockState.state).toStrictEqual([10, 1, 2]);
  });

  test('delete', () => {
    const [mockState, provider] = setup();

    expect(provider.delete(0)).toBe(provider.delete(0));

    provider.delete(1)();
    expect(mockState.state).toStrictEqual([0, 2]);
  });

  test('prepend', () => {
    const [mockState, provider] = setup();

    (provider.prepend)(-1);
    expect(mockState.state).toStrictEqual([-1, 0, 1, 2]);
  });

  test('apppend', () => {
    const [mockState, provider] = setup();

    (provider.append)(3);
    expect(mockState.state).toStrictEqual([0, 1, 2, 3]);
  });
});
