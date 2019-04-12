import React from 'react';
import ReactDOM from 'react-dom';
import {WindowTable} from 'window-table';

import './index.css';
import App from './App';

const App2 = props => {
  return <div>
    <WindowTable></WindowTable>
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'));
