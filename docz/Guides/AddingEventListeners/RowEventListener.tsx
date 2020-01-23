import React, { Ref, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  FormInput,
  Grid,
  Heading,
  Tr,
} from 'stylestrap';
import { Html5Table } from '../../../src';
import { getData, columns } from '../../Demo/helpers';

const data = getData(50000);

const handlers = {
  setState: null,
} as any;

const Row = ({ index, ...rest }) => {
  return (
    <Tr
      {...rest}
      onClick={() => {
        handlers.setState(index);
      }}
      css={{ cursor: 'pointer' }}
    />
  );
};

const ref = React.createRef();

export default function ShinobiTable() {
  const [state, setState] = useState({} as any);
  handlers.setState = rowIndex => {
    setState(data[rowIndex]);
  };

  return (
    <div className="bootstrap-wrapper">
      <Card>
        <CardBody>
          <Html5Table
            Body={props => {
              console.log('_ref', props._ref);
              return <tbody {...props} ref={props._ref || ref} />;
            }}
            // Row={Row}
            data={data}
            columns={columns}
            className="table-sm table-hover"
            headerClassName="thead-dark"
            height={250}
          />
          <Button
            onClick={() => {
              console.log(ref);
            }}
          >
            Click Me
          </Button>
        </CardBody>
        <CardFooter css={{ borderWidth: '5px', borderColor: state.color }}>
          <Heading size="h4">Selected Shinobi:</Heading>
          <Grid columns="3fr 3fr 2fr 5fr" gap="sm">
            <FormInput readOnly label="Name:" value={state.name} />
            <FormInput readOnly label="Clan:" value={state.clan} />
            <FormInput readOnly label="Age:" value={state.age} />
            <FormInput readOnly label="Specialty:" value={state.specialty} />
          </Grid>
        </CardFooter>
      </Card>
    </div>
  );
}
