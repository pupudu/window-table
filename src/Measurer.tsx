import * as React from 'react';
import { debounce, isEqual } from 'lodash-es';
import AutoSizer from 'react-virtualized-auto-sizer';

const { useMemo, useReducer } = React;

// Define the initial state of dimensions
// Also to be used as a state which will not trigger a re-render on changes
// So that we can change state from the useReducer, only once per all three dimension entities
interface ReducerState {
  header: [number, number];
  row: [number, number];
  table: [number, number];
}

let cache: ReducerState = {
  header: [10, 100],
  row: [10, 20],
  table: [100, 100]
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
    // Update state only when `table` entity dimensions have updated
    if (entity === 'table' && !isEqual(state[entity], cache[entity])) {
      return cache;
    }
  }
  return state;
};

type TableEntity = keyof ReducerState;
export interface MeasureAction {
  entity: TableEntity;
  dimensions: [number, number];
}

export const Measurer: React.FunctionComponent<{
  measure: React.Dispatch<MeasureAction>;
  entity: TableEntity;
}> = ({ measure, entity }) => {
  const debouncedDispatch = useMemo(
    () => debounce(measure, 100, { leading: true }),
    [measure]
  );
  return (
    <AutoSizer>
      {({ height, width }) => {
        debouncedDispatch({ dimensions: [height, width], entity });
        return null;
      }}
    </AutoSizer>
  );
};

export const useTableMeasurer = () => {
  return useReducer(reducer, cache);
};
