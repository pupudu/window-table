import * as React from 'react';

export interface ReducerState {
  header: [number, number];
  row: [number, number];
  table: [number, number];
}

export type TableEntity = keyof ReducerState;

export interface MeasureAction {
  entity: TableEntity;
  dimensions: [number, number];
}

export type Column<T = string, K = any> = {
  key: T;
  width: number;
  title?: string;
  Component?: React.ElementType<{ row?: K; column?: Column<T, K> }>;
  HeaderCell?: React.ElementType;
};

export type ReactElementType =
  | React.FunctionComponent<any>
  | React.ComponentClass<any>
  | string;

export type WindowTableProps<T> = {
  columns: Column<keyof T, T>[];
  data: T[];
  height?: number;
  width?: number;
  rowHeight?: number;
  overscanCount?: number;
  disableHeader?: boolean;
  style?: React.CSSProperties;
  Cell?: React.ElementType;
  HeaderCell?: React.ElementType;
  Table?: React.ElementType;
  Header?: React.ElementType;
  HeaderRow?: React.ElementType;
  Row?: React.ElementType;
  Body?: React.ElementType;
  sampleRowIndex?: number;
  sampleRow?: T;
  className?: string;
  rowClassName?: string | Function;
  classNamePrefix?: string;
  variableSizeRows?: boolean;
  debounceWait?: number;
  headerCellInnerElementType?: string;
  tableCellInnerElementType?: string;
  tableOuterRef?: React.Ref<any>;
  tableOuterElementType?: ReactElementType;
};

export interface RowCellsProps {
  columns: any[];
  classNamePrefix: string;
  datum: any;
  Cell: React.ElementType;
  index?: number;
  setSize?: any;
}

export interface HeaderRowProps {
  Header: React.ElementType;
  HeaderRow: React.ElementType;
  HeaderCell: React.ElementType;
  children?: any;
}

export interface Html5TableProps<T> extends WindowTableProps<T> {
  headerClassName: string;
}
