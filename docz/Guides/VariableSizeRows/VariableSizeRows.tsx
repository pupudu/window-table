import React from 'react';
import { Card, CardBody } from 'stylestrap';
import { Html5Table } from '../../../src';
import faker from 'faker';

const columns = [
  { title: 'ID', key: 'id', width: 50 },
  { title: 'Name', key: 'name', width: 50 },
  { title: 'Company', key: 'company', width: 50 },
  { title: 'Text', key: 'text', width: 50 },
];

const data = new Array(500).fill(0).map(() => ({
  id: faker.random.number(),
  name: faker.name.firstName(),
  company: faker.company.companyName(),
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
            columns={columns}
            className="table-sm table-hover"
            headerClassName="thead-dark"
          />
        </CardBody>
      </Card>
    </div>
  );
}
