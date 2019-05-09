import * as React from 'react';
import * as ReactWindow from 'react-window';
import { Measurer, MeasureAction, useTableMeasurer } from './Measurer';

const { FixedSizeList, VariableSizeList, areEqual } = ReactWindow;
const { useContext, createContext, memo, useMemo } = React;

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
  classNamePrefix: '',
  rowClassName: '' as string | Function
});

const RowCells = ({
  columns,
  classNamePrefix,
  datum,
  Cell,
  index = 0
}: {
  columns: any[];
  classNamePrefix: string;
  datum: any;
  Cell: React.ElementType;
  index?: number;
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
            <Component row={datum} column={column} index={index}>
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
  const {
    columns,
    data,
    Cell,
    classNamePrefix,
    Row,
    rowClassName
  } = useContext(TableContext);

  const rowClassNameStr = useMemo(
    () =>
      typeof rowClassName === 'function' ? rowClassName(index) : rowClassName,
    [index, rowClassName]
  );

  return (
    <Row
      style={{
        ...style,
        display: 'flex'
      }}
      className={`${classNamePrefix}${rowClassNameStr}`}
      index={index}
    >
      <RowCells
        datum={data[index]}
        Cell={Cell}
        classNamePrefix={classNamePrefix}
        columns={columns}
        index={index}
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
        {columns.map(column => {
          const { key, width, title, HeaderCell = DefaultHeaderCell } = column;
          return (
            <HeaderCell
              key={`header${key}`}
              style={{
                width: `${width}px`,
                display: 'inline-block',
                flexGrow: width
              }}
              className={`${classNamePrefix}table-header-cell`}
              column={column}
            >
              {title}
            </HeaderCell>
          );
        })}
      </HeaderRow>
    </Header>
  );
};

export type WindowTableProps<T> = {
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
  rowClassName?: string;
  classNamePrefix?: string;
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
  rowClassName = 'table-row',
  classNamePrefix = '',
  ...rest
}: WindowTableProps<T>) {
  const List: React.ElementType =
    rowHeight && typeof rowHeight === 'function'
      ? VariableSizeList
      : FixedSizeList;
  const columnWidthsSum = columns.reduce((sum, { width }) => sum + width, 0);

  const [dimensions, measure] = useTableMeasurer();

  const [tableHeight, tableWidth] = dimensions.table;
  const [headerHeight] = dimensions.header;
  const [sampleRowHeight] = dimensions.row;

  const bodyHeight: number = (height || tableHeight) - headerHeight;
  const effectiveWidth = width || Math.max(columnWidthsSum, tableWidth);

  const tableClassName = `${classNamePrefix}table ${className}`;

  const TableBody: React.FunctionComponent = ({ children, ...props }) => (
    <Table {...props} className={tableClassName}>
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
          className={tableClassName}
        >
          <Body className={`${classNamePrefix}table-body`}>
            <Row className={`${classNamePrefix}table-row`}>
              <Measurer measure={measure} entity="row" />
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
          classNamePrefix,
          rowClassName
        }}
      >
        <div>
          <Table
            style={{ width: `${effectiveWidth}px`, marginBottom: 0 }}
            className={tableClassName}
          >
            <HeaderRowRenderer
              width={effectiveWidth}
              measure={measure}
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
        <Measurer measure={measure} entity="table" />
      )}
    </div>
  );
}

export default WindowTable;
