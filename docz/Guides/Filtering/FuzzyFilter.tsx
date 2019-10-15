import React from 'react';
import Fuse from 'fuse.js';
import { Card, CardBody } from 'stylestrap';
import { Html5Table, useDebouncedState, useFilter } from '../../../';
import { getData, columns } from '../../Demo/helpers';

const data = getData(5000);

function filterData(originalData, filterText) {
  const fuse = new Fuse(originalData, {
    threshold: 0.5,
    keys: ['name', 'clan']
  });
  return fuse.search(filterText);
}

export default function ShinobiTable(props) {
  const [text, debouncedText, setText] = useDebouncedState('', 100);
  const filteredData = useFilter(filterData, data, debouncedText);

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
              width: '200px'
            }}
          />
          <Html5Table
            data={filteredData}
            columns={columns}
            className="table-sm"
            headerClassName="thead-dark"
            style={{ height: '250px' }}
            {...props}
          />
        </CardBody>
      </Card>
    </div>
  );
}
