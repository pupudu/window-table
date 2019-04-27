import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WindowTable } from 'window-table';

import './index.css';

const data = [
  { name: 'Naruto', age: 24, clan: 'Uzomaki' },
  { name: 'Hinata', age: 22, clan: 'Huga' },
  { name: 'Itachi', age: 28, clan: 'Uchiha' }
  //...and thousands or millions of data
];

const columns = [
  { key: 'name', width: 100, title: 'Name' },
  { key: 'clan', width: 150, title: 'Clan' },
  { key: 'age', width: 80, title: 'Age' }
];

function App() {
  return <WindowTable data={data} columns={columns} />;
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
