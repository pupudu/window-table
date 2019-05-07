import * as React from 'react';
import WindowTable, { WindowTableProps } from './WindowTable';

const getTHead = (headerClassName: string) => {
  const THead: React.FunctionComponent<
    React.HTMLAttributes<HTMLTableSectionElement>
  > = props => {
    return (
      <thead {...props} className={`${headerClassName} ${props.className}`} />
    );
  };
  return THead;
};

interface Html5TableProps<T> extends WindowTableProps<T> {
  headerClassName: string;
}

function Html5Table<T = any>({
  headerClassName,
  ...props
}: Html5TableProps<T>) {
  return (
    <WindowTable
      Cell="td"
      HeaderCell="th"
      Header={getTHead(headerClassName)}
      HeaderRow="tr"
      Row="tr"
      Body="tbody"
      Table="table"
      {...props}
    />
  );
}

export default Html5Table;
