import * as React from 'react';
import * as ReactWindow from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { debounce } from 'lodash-es';

const { FixedSizeList, VariableSizeList, areEqual } = ReactWindow;
const { useContext, createContext, useState, memo, useMemo } = React;

export type column<T = string, K = any> = {
  key: T;
  width: number;
  title?: string;
  Component?: React.ElementType<{ row?: K; column?: column<T, K> }>;
  HeaderCell?: React.ElementType;
};

const context = createContext({
  columns: [] as column<any, any>[],
  data: [] as any[],
  Cell: 'div' as React.ElementType,
  Row: 'div' as React.ElementType,
  classNamePrefix: ''
});

const useMeasurer = (
  initialHeight = 1,
  initialWidth = 1
): [number, number, React.ElementType] => {
  const [{ height: _height, width: _width }, setDimensions] = useState({
    height: initialHeight,
    width: initialWidth
  });
  const debouncedSetDimensions = useMemo(
    () => debounce(setDimensions, 1000),
    []
  );

  const Measurer: React.ElementType = () => {
    return (
      <AutoSizer>
        {({ width, height }) => {
          if (_height !== height || _width !== width) {
            debouncedSetDimensions({ height, width });
          }
          return null;
        }}
      </AutoSizer>
    );
  };

  return [_height, _height, Measurer];
};

const RowRenderer = memo(function RowRenderer({
  index,
  style
}: ReactWindow.ListChildComponentProps) {
  const { columns, data, Cell, classNamePrefix, Row } = useContext(context);

  return (
    <Row
      style={{
        ...style,
        display: 'flex'
      }}
      className={`${classNamePrefix}table-row`}
    >
      {columns.map(column => {
        const { key, width, Component = 'div' } = column;
        return (
          <Cell
            key={key}
            style={{
              width: `${width}px`,
              flexGrow: width,
              display: 'inline-block',
              overflow: 'auto'
            }}
            className={`${classNamePrefix}table-cell`}
          >
            <Component row={data[index]} column={column}>
              {data[index][key]}
            </Component>
          </Cell>
        );
      })}
    </Row>
  );
},
areEqual);

const HeaderRowRenderer = ({
  width,
  Measurer,
  Header,
  HeaderRow,
  HeaderCell: DefaultHeaderCell
}: {
  width: number;
  Measurer: React.ElementType;
  Header: React.ElementType;
  HeaderRow: React.ElementType;
  HeaderCell: React.ElementType;
}) => {
  const { columns, classNamePrefix } = useContext(context);

  return (
    <Header className={`${classNamePrefix}table-header`}>
      <HeaderRow
        style={{
          width: `${width}px`,
          display: 'flex'
        }}
        className={`${classNamePrefix}table-header-row`}
      >
        <Measurer />
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

function WindowTable<T = any>({
  columns,
  data,
  rowHeight,
  height,
  overscanCount = 1,
  style = {},
  Cell = 'div',
  HeaderCell = 'div',
  Table = 'div',
  Header = 'div',
  HeaderRow = 'div',
  Row = 'div',
  Body = 'div',
  className = '',
  classNamePrefix = '',
  SampleCell = 'div',
  ...rest
}: {
  columns: Array<column<keyof T, T>>;
  data: Array<T>;
  height?: number;
  rowHeight?: number;
  overscanCount?: number;
  style?: object;
  Cell?: React.ElementType;
  HeaderCell?: React.ElementType;
  Table?: React.ElementType;
  Header?: React.ElementType;
  HeaderRow?: React.ElementType;
  Row?: React.ElementType;
  Body?: React.ElementType;
  SampleCell?: React.ElementType;
  className?: string;
  classNamePrefix?: string;
}) {
  const List =
    rowHeight && typeof rowHeight === 'function'
      ? VariableSizeList
      : FixedSizeList;
  const columnWidthsSum = columns.reduce((sum, { width }) => sum + width, 0);
  const [tableHeight, tableWidth, TableMeasurer] = useMeasurer(100, 100);
  const [headerHeight, , HeaderMeasurer] = useMeasurer(10, 100);
  const [sampleCellHeight, , CellMeasurer] = useMeasurer(10, 10);

  const bodyHeight: number = (height || tableHeight) - headerHeight;
  const effectiveWidth = Math.max(columnWidthsSum, tableWidth);

  const TableBody = ({ children, ...props }: React.ComponentProps<any>) => (
    <Table {...props} className={`${classNamePrefix}table`}>
      <Body className={`${classNamePrefix}table-body`}>{children}</Body>
    </Table>
  );

  return (
    <div
      style={{
        height: 'calc(100% - 16px)', // 16px less to avoid possible unnecessary scrollbars
        width: '100%',
        maxHeight: '100vh', // By default, table height will be bounded by 100% of viewport height
        ...style
      }}
      {...rest}
      className={`${classNamePrefix}${className}`}
    >
      {!rowHeight && (
        <Table
          style={{
            height: 0,
            opacity: 0,
            display: 'block',
            margin: 0
          }}
        >
          <Body>
            <Row>
              <CellMeasurer />
              <Cell>
                {SampleCell === 'div' ? (
                  <SampleCell>{data[0][columns[0].key]}</SampleCell>
                ) : (
                  <SampleCell />
                )}
              </Cell>
            </Row>
          </Body>
        </Table>
      )}

      <context.Provider
        value={{
          columns,
          data,
          Cell,
          Row,
          classNamePrefix
        }}
      >
        <div>
          <Table>
            <HeaderRowRenderer
              width={effectiveWidth}
              Measurer={HeaderMeasurer}
              Header={Header}
              HeaderRow={HeaderRow}
              HeaderCell={HeaderCell}
            />
          </Table>
          <List
            itemData={{ data1: data, columns }}
            height={bodyHeight}
            itemCount={data.length}
            itemSize={rowHeight || sampleCellHeight}
            width={effectiveWidth}
            innerElementType={TableBody}
            overscanCount={overscanCount}
          >
            {RowRenderer}
          </List>
        </div>
      </context.Provider>

      <TableMeasurer />
    </div>
  );
}

export default WindowTable;
