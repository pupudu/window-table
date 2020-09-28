import React from 'react';
import {
  Html5Table as Table,
  useDebouncedState,
  createFilter,
  useFilter,
} from '../../src';
import { data, columns } from './helpers';
import './demo.css';
import { Card, CardBody } from 'stylestrap';

const filterFn = createFilter(['name', 'clan']);

function ShinobiTable(props) {
  const [text, debouncedText, setText] = useDebouncedState('');
  const filteredData = useFilter(filterFn, data, debouncedText);

  return (
    <div className="bootstrap-wrapper">
      <Card>
        <CardBody>
          <input
            onChange={e => setText(e.target.value)}
            value={text}
            placeholder="Filter by Name or Clan"
            style={{
              marginBottom: '5px',
              padding: '2px 5px',
              borderRadius: '3px',
              border: '1px solid #ccc',
              width: '200px',
            }}
          />
          <Table
            style={{ height: '250px' }}
            data={filteredData}
            columns={columns}
            className="table-sm"
            headerClassName="thead-dark"
            {...props}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default ShinobiTable;
