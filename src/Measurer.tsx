import * as React from 'react';
import debounce from 'lodash.debounce';
import AutoSizer from './AutoSizer';
import { MeasureAction, ReducerState, TableEntity } from './core/types';

const { useMemo, useReducer } = React;

// Define the initial state of dimensions
// Also to be used as a state which will not trigger a re-render on changes
// So that we can change state from the useReducer, only when required
let cache: ReducerState = {
  header: [0, 0],
  row: [0, 0],
  table: [0, 0],
};

export const reducer: React.Reducer<ReducerState, MeasureAction> = (
  state,
  { entity, dimensions }
) => {
  if (entity) {
    // Keep updates in cache
    cache = { ...cache, [entity]: dimensions };
    if (JSON.stringify(state[entity]) !== JSON.stringify(cache[entity])) {
      return cache;
    }
  }
  return state;
};

export const Measurer: React.FunctionComponent<{
  measure: React.Dispatch<MeasureAction>;
  entity: TableEntity;
  debounceWait: number;
  innerElementType?: any;
}> = ({ measure, entity, debounceWait, innerElementType = 'div' }) => {
  const debounced = useMemo(
    () => debounce(measure, debounceWait, { leading: true }),
    [measure, debounceWait]
  );
  const dispatch = debounceWait > 0 ? debounced : measure;
  return (
    <AutoSizer
      innerElementType={innerElementType}
      onResize={({ height, width }: { height: number; width: number }) => {
        dispatch({ dimensions: [height, width], entity });
      }}
    />
  );
};

export const useTableMeasurer = () => {
  return useReducer(reducer, cache);
};
