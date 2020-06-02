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
import { useRef } from 'react';

const { FixedSizeList, VariableSizeList, areEqual } = ReactWindow;
const { useContext, createContext, memo, useMemo } = React;

const TableContext = createContext({
  columns: [] as Column<any, any>[],
  data: [] as any[],
  Cell: 'div' as React.ElementType,
  Row: 'div' as React.ElementType,
  classNamePrefix: '',
  rowClassName: '' as string | Function,
  rowWidthOffset: 0,
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

const RowRenderer: React.FunctionComponent<ReactWindow.ListChildComponentProps> = ({
  index,
  style,
}) => {
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
  const { columns, classNamePrefix, rowWidthOffset } = useContext(TableContext);
  const rowRef = useRef<HTMLElement>(null);

  const color =
    rowRef &&
    rowRef.current &&
    rowRef.current.firstChild &&
    getComputedStyle(rowRef.current.firstChild as Element).backgroundColor;

  return (
    <Header
      className={`${classNamePrefix}table-header`}
      style={{ backgroundColor: color }}
    >
      <HeaderRow
        style={{
          display: 'flex',
          width: `calc(100% - ${rowWidthOffset}px)`,
        }}
        className={`${classNamePrefix}table-header-row`}
        ref={rowRef}
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

const WindowTable = React.forwardRef(
  <T extends any = any>(
    {
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
      headerCellInnerElementType = 'div',
      tableCellInnerElementType = 'div',
      ...rest
    }: WindowTableProps<T>,
    ref: React.Ref<ReactWindow.FixedSizeList | ReactWindow.VariableSizeList>
  ) => {
    const measurerRowRef = useRef<HTMLElement>(null);

    const List: React.ElementType =
      rowHeight && typeof rowHeight === 'function'
        ? VariableSizeList
        : FixedSizeList;
    const columnWidthsSum = columns.reduce((sum, { width }) => sum + width, 0);

    const [dimensions, measure] = useTableMeasurer();

    const [tableHeight, tableWidth] = dimensions.table;
    const [headerHeight] = dimensions.header;
    const [sampleRowHeight] = dimensions.row;

    const bodyHeight: number = (height || tableHeight) - headerHeight - 2; // 2px less to avoid possible unnecessary scrollbars
    const effectiveWidth = width || Math.max(columnWidthsSum, tableWidth);

    const tableClassName = `${classNamePrefix}table ${className}`;

    const TableBody: React.FunctionComponent = ({ children, ...props }) => (
      <Table {...props} className={tableClassName}>
        <Body className={`${classNamePrefix}table-body`}>{children}</Body>
      </Table>
    );

    const rowWidth =
      (measurerRowRef.current && measurerRowRef.current.clientWidth) ||
      tableWidth;
    const rowWidthOffset = tableWidth - rowWidth;

    const tblCtx = {
      columns,
      data,
      Cell,
      Row,
      classNamePrefix,
      rowClassName,
      rowWidthOffset,
    };

    return (
      <div
        style={{
          height: height ? `${height}px` : '100%',
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
              border: 0,
              outline: 0,
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
                  innerElementType={headerCellInnerElementType}
                />
              </HeaderRowRenderer>
            </TableContext.Provider>
            <Body
              className={`${classNamePrefix}table-body`}
              style={{ overflowY: 'scroll' }}
            >
              <Row
                className={`${classNamePrefix}table-row`}
                ref={measurerRowRef}
                style={{ width: '100%', display: 'flex' }}
              >
                <Measurer
                  measure={measure}
                  entity="row"
                  debounceWait={debounceWait}
                  innerElementType={tableCellInnerElementType}
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
                ref={ref}
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
);

export default memo(WindowTable, areTablePropsEqual) as typeof WindowTable;
