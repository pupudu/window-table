import React from 'react';
import { Card, CardBody } from 'stylestrap';
import { Html5Table } from '../../../src';
import faker from 'faker';

const columns = [
  { title: 'ID', key: 'id', width: 100 },
  { title: 'Text', key: 'text', width: 50 },
];

const data = new Array(500).fill(0).map(() => ({
  id: faker.random.number(),
  text: faker.lorem.text(),
}));

export default function ShinobiTable() {
  return (
    <div className="bootstrap-wrapper">
      <Card>
        <CardBody css={{ height: '500px' }}>
          <Html5Table
            data={data}
            variableSizeRows={true}
            // @ts-ignore
            columns={columns}
            className="table-sm table-hover"
            headerClassName="thead-dark"
          />
        </CardBody>
      </Card>
    </div>
  );
}
