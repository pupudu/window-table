import * as React from 'react';
import debounce from 'lodash/debounce';

const { useState, useMemo } = React;

/**
 * A hook giving a combination of immediate and debounced state
 * @param initialState
 * @param wait
 */
export function useDebouncedState(
  initialState: any,
  wait: number = 100
): [any, any, (state: any) => void] {
  const [immediateState, setImmediateState] = useState(initialState);
  const [debouncedState, setState] = useState(initialState);

  const setDebouncedState = useMemo(() => debounce(setState, wait), [wait]);

  const setCombinedState = (state: any) => {
    setDebouncedState.cancel();
    setImmediateState(state);
    setDebouncedState(state);
  };

  return [immediateState, debouncedState, setCombinedState];
}

type UseFilter = (
  filterFn: (data: Array<Object>, filterText: string) => Array<Object>,
  data: Array<Object>,
  filterText: string
) => Array<Object>;

/**
 * A hook for fast data filtering
 * @param filterFn
 * @param data
 * @param filterText
 */
export const useFilter: UseFilter = function(filterFn, data, filterText) {
  return useMemo(() => {
    if (!filterText.length) {
      return data;
    }
    return filterFn(data, filterText);
  }, [data, filterFn, filterText]);
};

/**
 * A simple utility for creating functions for trivial data filtering
 * @param fields
 */
export function createFilter(fields: string[]) {
  return (originalData: any, filterText: string) =>
    originalData.filter((data: any) =>
      fields.some((field: string) => {
        return data[field]
          .toLowerCase()
          .includes(filterText.trim().toLowerCase());
      })
    );
}
