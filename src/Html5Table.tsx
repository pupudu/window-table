import * as React from 'react';
import WindowTable from './WindowTable';

const THead: React.FunctionComponent<
  React.HTMLAttributes<HTMLTableSectionElement>
> = props => {
  return <thead {...props} className="thead-dark" />;
};

const HtmlTable: typeof WindowTable = ({ className, ...props }) => {
  return (
    <WindowTable
      className={`${className} table`}
      Cell="td"
      HeaderCell="th"
      Header={THead}
      HeaderRow="tr"
      Row="tr"
      Body="tbody"
      Table="table"
      {...props}
    />
  );
};

export default HtmlTable;
