import * as React from 'react';
import WindowTable from './WindowTable';
import { Html5TableProps } from './core/types';

const getTHead = (headerClassName: string = '') => {
  const THead: React.FunctionComponent<
    React.HTMLAttributes<HTMLTableSectionElement>
  > = props => {
    return (
      <thead {...props} className={`${headerClassName} ${props.className}`} />
    );
  };
  return THead;
};

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
