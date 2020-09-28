import React from 'react';
import data from '../data';
import { Html5Table as WindowTable } from '../../../dist';

const Avatar = ({ row, column }) => {
  return <img src={row[column.key]} alt="avatar" style={{ height: '40px' }} />;
};

const columns = [
  { key: 'avatar', width: 40, title: 'Avatar', Component: Avatar },
  { key: 'name', width: 100, title: 'Name' },
  { key: 'clan', width: 100, title: 'Clan' },
  { key: 'age', width: 40, title: 'Age' },
];

export default function Testing() {
  return (
    <div
      style={{
        height: '500px',
        maxWidth: '80vw',
        margin: 'auto',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '15px',
        background: '#EEF',
      }}
    >
      <WindowTable
        data={data}
        columns={columns}
        style={{ background: '#FFF' }}
      />
    </div>
  );
}
