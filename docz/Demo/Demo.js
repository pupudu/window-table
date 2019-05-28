import React from 'react';
import { Html5Table as Table } from '../../';
import { data, columns } from './helpers';
import './demo.scss';

function ShinobiTable(props) {
  return (
    <div className="bootstrap-wrapper" style={{ height: '250px' }}>
      <Table
        data={data}
        columns={columns}
        className="table-sm"
        headerClassName="thead-dark"
        {...props}
      />
    </div>
  );
}

export default ShinobiTable;
