import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WindowTable } from 'window-table';
import data from './data';
import './index.css';

const Avatar = ({ row, column }) => {
  return (
    <div>
      <img
        src={row[column.key]}
        alt="avatar"
        style={{
          height: '50px'
        }}
      />
    </div>
  );
};

const columns = [
  { key: 'avatar', width: 80, title: 'Avatar', Component: Avatar },
  { key: 'name', width: 100, title: 'Name' },
  { key: 'clan', width: 150, title: 'Clan' },
  { key: 'age', width: 80, title: 'Age' }
];

function App() {
  return (
    <div
      style={{
        height: '500px',
        maxWidth: '80vw',
        margin: 'auto',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '15px',
        background: '#EEE'
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

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
