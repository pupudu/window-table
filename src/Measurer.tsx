import * as React from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import AutoSizer from 'react-virtualized-auto-sizer';
import { MeasureAction, ReducerState, TableEntity } from './types';

const { useMemo, useReducer } = React;

// Define the initial state of dimensions
// Also to be used as a state which will not trigger a re-render on changes
// So that we can change state from the useReducer, only when required
let cache: ReducerState = {
  header: [0, 0],
  row: [0, 0],
  table: [0, 0]
};

export const reducer: React.Reducer<ReducerState, MeasureAction> = (
  state,
  { entity, dimensions }
) => {
  if (entity) {
    // Keep updates in cache
    cache = {
      ...cache,
      [entity]: dimensions
    };
    if (
      ['row', 'table'].includes(entity) &&
      !isEqual(state[entity], cache[entity])
    ) {
      return cache;
    }
  }
  return state;
};

export const Measurer: React.FunctionComponent<{
  measure: React.Dispatch<MeasureAction>;
  entity: TableEntity;
  debounceWait: number;
}> = ({ measure, entity, debounceWait }) => {
  const debounced = useMemo(
    () => debounce(measure, debounceWait, { leading: true }),
    [measure, debounceWait]
  );
  const dispatch = debounceWait > 0 ? debounced : measure;
  return (
    <AutoSizer>
      {({ height, width }) => {
        dispatch({ dimensions: [height, width], entity });
        return null;
      }}
    </AutoSizer>
  );
};

export const useTableMeasurer = () => {
  return useReducer(reducer, cache);
};
