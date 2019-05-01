import * as React from 'react';
import * as ReactWindow from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { isEqual, debounce } from 'lodash-es';

const { FixedSizeList, VariableSizeList, areEqual } = ReactWindow;
const { useContext, createContext, memo, useReducer, useMemo } = React;

export type Column<T = string, K = any> = {
  key: T;
  width: number;
  title?: string;
  Component?: React.ElementType<{ row?: K; column?: Column<T, K> }>;
  HeaderCell?: React.ElementType;
};

const TableContext = createContext({
  columns: [] as Column<any, any>[],
  data: [] as any[],
  Cell: 'div' as React.ElementType,
  Row: 'div' as React.ElementType,
  classNamePrefix: ''
});

const Measurer: React.FunctionComponent<{
  measure: React.Dispatch<MeasureAction>;
  entity: TableEntity;
}> = ({ measure, entity }) => {
  const debouncedDispatch = useMemo(
    () => debounce(measure, 100, { leading: true }),
    []
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

const RowCells = ({
  columns,
  classNamePrefix,
  datum,
  Cell
}: {
  columns: any[];
  classNamePrefix: string;
  datum: any;
  Cell: React.ElementType;
}) => {
  return (
    <>
      {columns.map(column => {
        const { key, width, Component = 'div' } = column;
        return (
          <Cell
            key={key}
            style={{
              width: `${width}px`,
              flexGrow: width,
              display: 'inline-block',
              overflow: 'auto',
              boxSizing: 'border-box'
            }}
            className={`${classNamePrefix}table-cell`}
          >
            <Component row={datum} column={column}>
              {datum[key]}
            </Component>
          </Cell>
        );
      })}
    </>
  );
};

const RowRenderer: React.FunctionComponent<
  ReactWindow.ListChildComponentProps
> = ({ index, style }) => {
  const { columns, data, Cell, classNamePrefix, Row } = useContext(
    TableContext
  );

  return (
    <Row
      style={{
        ...style,
        display: 'flex'
      }}
      className={`${classNamePrefix}table-row`}
    >
      <RowCells
        datum={data[index]}
        Cell={Cell}
        classNamePrefix={classNamePrefix}
        columns={columns}
      />
    </Row>
  );
};
const MemoRowRenderer = memo(RowRenderer, areEqual);

const HeaderRowRenderer: React.FunctionComponent<{
  width: number;
  measure: React.Dispatch<MeasureAction>;
  Header: React.ElementType;
  HeaderRow: React.ElementType;
  HeaderCell: React.ElementType;
}> = ({ measure, Header, HeaderRow, HeaderCell: DefaultHeaderCell }) => {
  const { columns, classNamePrefix } = useContext(TableContext);

  return (
    <Header className={`${classNamePrefix}table-header`}>
      <HeaderRow
        style={{
          display: 'flex'
        }}
        className={`${classNamePrefix}table-header-row`}
      >
        <Measurer measure={measure} entity="header" />
        {columns.map(
          ({ key, width, title, HeaderCell = DefaultHeaderCell }) => {
            return (
              <HeaderCell
                key={`header${key}`}
                style={{
                  width: `${width}px`,
                  display: 'inline-block',
                  flexGrow: width
                }}
                className={`${classNamePrefix}table-header-cell`}
              >
                {title}
              </HeaderCell>
            );
          }
        )}
      </HeaderRow>
    </Header>
  );
};

// Define the initial state of dimensions
// Also to be used as a state which will not trigger a re-render on changes
// So that we can change state from the useReducer, only once per all three dimension entities
interface ReducerState {
  header: [number, number];
  row: [number, number];
  table: [number, number];
}

type TableEntity = keyof ReducerState;
interface MeasureAction {
  entity: TableEntity;
  dimensions: [number, number];
}
let cache: ReducerState = {
  header: [10, 100],
  row: [10, 20],
  table: [100, 100]
};

const reducer: React.Reducer<ReducerState, MeasureAction> = (
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

function WindowTable<T = any>({
  columns,
  data,
  rowHeight,
  height,
  width,
  overscanCount = 1,
  style = {},
  Cell = 'div',
  HeaderCell = 'div',
  Table = 'div',
  Header = 'div',
  HeaderRow = 'div',
  Row = 'div',
  Body = 'div',
  sampleRowIndex = 0,
  sampleRow,
  className = '',
  classNamePrefix = '',
  ...rest
}: {
  columns: Column<keyof T, T>[];
  data: T[];
  height?: number;
  width?: number;
  rowHeight?: number;
  overscanCount?: number;
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
  classNamePrefix?: string;
}) {
  const List: React.ElementType =
    rowHeight && typeof rowHeight === 'function'
      ? VariableSizeList
      : FixedSizeList;
  const columnWidthsSum = columns.reduce((sum, { width }) => sum + width, 0);

  const [dimensions, dispatchMeasure] = useReducer(reducer, cache);

  const [tableHeight, tableWidth] = dimensions.table;
  const [headerHeight] = dimensions.header;
  const [sampleRowHeight] = dimensions.row;

  const bodyHeight: number = (height || tableHeight) - headerHeight;
  const effectiveWidth = width || Math.max(columnWidthsSum, tableWidth);

  const TableBody: React.FunctionComponent = ({ children, ...props }) => (
    <Table {...props} className={`${classNamePrefix}table`}>
      <Body className={`${classNamePrefix}table-body`}>{children}</Body>
    </Table>
  );

  return (
    <div
      style={{
        height: 'calc(100% - 16px)', // 16px less to avoid possible unnecessary scrollbars
        width: '100%',
        overflow: 'auto',
        maxHeight: '100vh', // By default, table height will be bounded by 100% of viewport height
        ...style
      }}
      {...rest}
      className={`${classNamePrefix}${className}`}
    >
      {!rowHeight && (
        /*Measure row height only if not supplied explicitly*/
        <Table
          style={{
            height: 0,
            opacity: 0,
            display: 'block',
            margin: 0,
            width: `${effectiveWidth}px`
          }}
          className={`${classNamePrefix}table`}
        >
          <Body className={`${classNamePrefix}table-body`}>
            <Row className={`${classNamePrefix}table-row`}>
              <Measurer measure={dispatchMeasure} entity="row" />
              <RowCells
                datum={sampleRow || data[sampleRowIndex]}
                columns={columns}
                classNamePrefix={classNamePrefix}
                Cell={Cell}
              />
            </Row>
          </Body>
        </Table>
      )}

      <TableContext.Provider
        value={{
          columns,
          data,
          Cell,
          Row,
          classNamePrefix
        }}
      >
        <div>
          <Table style={{ width: `${effectiveWidth}px` }}>
            <HeaderRowRenderer
              width={effectiveWidth}
              measure={dispatchMeasure}
              Header={Header}
              HeaderRow={HeaderRow}
              HeaderCell={HeaderCell}
            />
          </Table>
          <List
            height={bodyHeight}
            itemCount={data.length}
            itemSize={rowHeight || sampleRowHeight}
            width={effectiveWidth}
            innerElementType={TableBody}
            overscanCount={overscanCount}
          >
            {MemoRowRenderer}
          </List>
        </div>
      </TableContext.Provider>

      {(!height || !width) && (
        /*Measure table dimensions only if explicit height or width are not supplied*/
        <Measurer measure={dispatchMeasure} entity="table" />
      )}
    </div>
  );
}

export default WindowTable;
