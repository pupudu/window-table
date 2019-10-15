import * as React from 'react';
import * as ReactWindow from 'react-window';
import { Measurer, useTableMeasurer } from './Measurer';
import {
  Column,
  WindowTableProps,
  RowCellsProps,
  HeaderRowProps,
} from './core/types';
import { areTablePropsEqual } from './helpers/areTablePropsEqual';

const { FixedSizeList, VariableSizeList, areEqual } = ReactWindow;
const { useContext, createContext, memo, useMemo } = React;

const TableContext = createContext({
  columns: [] as Column<any, any>[],
  data: [] as any[],
  Cell: 'div' as React.ElementType,
  Row: 'div' as React.ElementType,
  classNamePrefix: '',
  rowClassName: '' as string | Function,
});

const RowCells = ({
  columns,
  classNamePrefix,
  datum,
  Cell,
  index = 0,
}: RowCellsProps) => {
  return (
    <>
      {columns.map((column, i) => {
        const { key, width, Component = 'div' } = column;
        // Using i as the key, because it doesn't matter much,
        // as we are only looping through columns in one row only
        return (
          <Cell
            key={i}
            style={{
              width: `${width}px`,
              flexGrow: width,
              display: 'inline-block',
              overflow: 'auto',
              boxSizing: 'border-box',
            }}
            className={`${classNamePrefix}table-cell`}
            row={datum}
            column={column}
            index={index}
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
    rowClassName,
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
        display: 'flex',
      }}
      className={`${classNamePrefix}${rowClassNameStr}`}
      index={index}
      row={data[index]}
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

const HeaderRowRenderer: React.FunctionComponent<HeaderRowProps> = ({
  Header,
  HeaderRow,
  HeaderCell: DefaultHeaderCell,
  children,
}) => {
  const { columns, classNamePrefix } = useContext(TableContext);

  return (
    <Header className={`${classNamePrefix}table-header`}>
      <HeaderRow
        style={{
          display: 'flex',
        }}
        className={`${classNamePrefix}table-header-row`}
      >
        {children}
        {columns.map(column => {
          const { key, width, title, HeaderCell = DefaultHeaderCell } = column;
          return (
            <HeaderCell
              key={`header${key}`}
              style={{
                width: `${width}px`,
                display: 'inline-block',
                flexGrow: width,
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
  debounceWait = 0,
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

  const tblCtx = { columns, data, Cell, Row, classNamePrefix, rowClassName };

  return (
    <div
      style={{
        height: height ? `${height}px` : 'calc(100% - 16px)', // 16px less to avoid possible unnecessary scrollbars
        width: width ? `${width}px` : '100%',
        overflow: 'auto',
        maxHeight: '100vh', // By default, table height will be bounded by 100% of viewport height
        ...style,
      }}
      {...rest}
    >
      {!rowHeight && !!data.length && (
        /*Measure row height only if not supplied explicitly*/
        <Table
          style={{
            height: 0,
            opacity: 0,
            display: 'grid',
            overflow: 'hidden',
            margin: 0,
            width: `${effectiveWidth}px`,
          }}
          className={tableClassName}
        >
          <TableContext.Provider value={tblCtx}>
            <HeaderRowRenderer
              Header={Header}
              HeaderRow={HeaderRow}
              HeaderCell={HeaderCell}
            >
              <Measurer
                measure={measure}
                entity="header"
                debounceWait={debounceWait}
                innerElementType={HeaderCell}
              />
            </HeaderRowRenderer>
          </TableContext.Provider>
          <Body className={`${classNamePrefix}table-body`}>
            <Row className={`${classNamePrefix}table-row`}>
              <Measurer
                measure={measure}
                entity="row"
                debounceWait={debounceWait}
                innerElementType={Cell}
              />
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

      <TableContext.Provider value={tblCtx}>
        <div>
          {tableWidth > 0 && (
            <Table
              style={{ width: `${effectiveWidth}px`, marginBottom: 0 }}
              className={tableClassName}
            >
              <HeaderRowRenderer
                Header={Header}
                HeaderRow={HeaderRow}
                HeaderCell={HeaderCell}
              />
            </Table>
          )}
          {!!data.length && (
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
          )}
        </div>
      </TableContext.Provider>

      {(!height || !width) && (
        /*Measure table dimensions only if explicit height or width are not supplied*/
        <Measurer
          measure={measure}
          entity="table"
          debounceWait={debounceWait}
        />
      )}
    </div>
  );
}

export default memo(WindowTable, areTablePropsEqual) as typeof WindowTable;
