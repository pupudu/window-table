import React from 'react';
import { Html5Table as Table } from '../../';
import data from './data';
import Bootstrap from '../bootstrap';

const Avatar = ({ row, column }) => {
  return (
    <img
      src={row[column.key]}
      alt="avatar"
      style={{
        height: '40px'
      }}
    />
  );
};

const IndexCount = ({ index }) => {
  return <div>{index}</div>;
};

const columns = [
  { key: 'index', width: 25, title: 'Index', Component: IndexCount },
  { key: 'avatar', width: 40, title: 'Avatar', Component: Avatar },
  { key: 'name', width: 100, title: 'Name' },
  { key: 'clan', width: 100, title: 'Clan' },
  { key: 'age', width: 40, title: 'Age' }
];

function ShinobiTable() {
  return (
    <Bootstrap
      style={{
        height: '250px'
      }}
    >
      <Table data={data} columns={columns} className="table-sm" />
    </Bootstrap>
  );
}

export default ShinobiTable;
