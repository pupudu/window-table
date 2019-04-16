import * as React from 'react';
import WindowTable from './WindowTable';

const THead: React.ElementType = props => {
  return <thead {...props} className="thead-dark" />;
};

const HtmlTable: React.ElementType = props => {
  return (
    <WindowTable
      className="table"
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
