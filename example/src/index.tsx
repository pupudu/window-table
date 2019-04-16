import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WindowTable } from 'window-table';

import './index.css';

const Comp = ({ row, column }: any) => {
  return (
    <div>
      {row}
      {column}
    </div>
  );
};

const App2 = () => {
  return (
    <div>
      <WindowTable
        data={[{ a: 1, c: 2 }]}
        columns={[
          {
            key: 'a',
            width: 10,
            Component: Comp
          },
          { key: 'c', width: 10 }
        ]}
        rowHeight={10}
      />
    </div>
  );
};

ReactDOM.render(<App2 />, document.getElementById('root'));
