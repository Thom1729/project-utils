export type StateUpdater<TState, TPrevState = TState> =
  (value: TState | ((prevState: TPrevState) => TState)) => void;

export function applyStateUpdater<TState, TPrevState>(
  value: TState | ((prevState: TPrevState) => void),
  prevState: TPrevState,
) {
  if (typeof value === 'function') {
    return (value as (prevState: TPrevState) => TState)(prevState);
  } else {
    return value;
  }
}

function cached<TThis, TKey, TReturn>(
  originalMethod: (this: TThis, key: TKey) => TReturn,
  context: ClassMethodDecoratorContext,
): (this: TThis, key: TKey) => TReturn {
  const cacheProperty = Symbol(`__cache__${context.name.toString()}`);
  type HasCache = { [cacheProperty]: Map<TKey, TReturn> };

  context.addInitializer(function() {
    (this as HasCache)[cacheProperty] = new Map<TKey, TReturn>();
  });

  const wrappedName = `__wrapped__${context.name.toString()}`;

  return {
    [wrappedName](this: TThis, key: TKey): TReturn {
      const cache = (this as HasCache)[cacheProperty];
      if (cache.has(key)) {
        return cache.get(key)!;
      } else {
        const result = originalMethod.call(this, key);
        cache.set(key, result);
        return result;
      }
    },
  }[wrappedName];
}

export type OptionalKeyOf<T extends object> = {
  [K in keyof T]: T extends Record<K, T[K]> ? never : K
}[keyof T];

export class ObjectSubstateProvider<TBase extends object> {
  private readonly setState: StateUpdater<TBase>;

  constructor(setState: StateUpdater<TBase>) {
    this.setState = setState;
  }

  @cached
  set<TKey extends keyof TBase>(key: TKey): StateUpdater<TBase[TKey]> {
    return value => this.setState(prevState => ({
      ...prevState,
      [key]: applyStateUpdater(value, prevState[key]),
    }));
  }

  @cached
  delete(key: OptionalKeyOf<TBase>) {
    return () => this.setState(({
      [key]: _,
      ...rest
    }) => rest as TBase);
  }
}

export class ArraySubstateProvider<TItem> {
  private readonly setState: StateUpdater<TItem[], readonly TItem[]>;
  
  constructor(setState: StateUpdater<TItem[], readonly TItem[]>) {
    this.setState = setState;
  }

  @cached
  set(index: number): StateUpdater<TItem> {
    return value => this.setState(prevState => [
      ...prevState.slice(0, index),
      applyStateUpdater(value, prevState[index]),
      ...prevState.slice(index + 1),
    ]);
  }

  @cached
  delete (index: number) {
    return () => this.setState(prevState => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ])
  };

  @cached
  moveTo(index: number) {
    return (newIndex: number) => this.setState(prevState => {
      const rest = [
        ...prevState.slice(0, index),
        ...prevState.slice(index + 1),
      ];
      return [
        ...rest.slice(0, newIndex),
        prevState[index],
        ...rest.slice(newIndex),
      ];
    });
  };

  @cached
  moveBy(index: number) {
    const moveTo = this.moveTo(index);
    return (diff: number) => moveTo(index + diff);
  };

  prepend: StateUpdater<TItem, readonly TItem[]> =
    value => this.setState(prevState => [
      applyStateUpdater(value, prevState),
      ...prevState,
    ]);

  append: StateUpdater<TItem, readonly TItem[]> =
    value => this.setState(prevState => [
      ...prevState,
      applyStateUpdater(value, prevState),
    ]);
}
