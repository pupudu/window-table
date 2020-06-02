import React from 'react';
import * as ReactWindow from 'react-window';
import { Card, CardBody } from 'stylestrap';

import { WindowTable } from '../../../src';
import { getData, columns } from '../../Demo/helpers';

const data = getData(50000);

export default function ShinobiTable(props) {
  const listRef = React.useRef<ReactWindow.FixedSizeList>(null);
  const [currentRow, setCurrentRow] = React.useState(0);

  React.useEffect(() => {
    listRef.current!.scrollToItem(currentRow);
  }, [currentRow]);

  return (
    <div className="bootstrap-wrapper">
      <Card>
        <CardBody>
          <input
            onChange={e => setCurrentRow(Number(e.target.value))}
            type="number"
            value={currentRow}
            placeholder="Filter by Name or Clan"
            style={{
              marginBottom: '5px',
              padding: '2px 5px',
              borderRadius: '3px',
              border: '1px solid #ccc',
              width: '200px',
            }}
          />
          <WindowTable
            ref={listRef}
            data={data}
            columns={columns}
            className="table-sm"
            headerClassName="thead-dark"
            style={{ height: '250px' }}
            Cell="td"
            HeaderCell="th"
            Header="thead"
            HeaderRow="tr"
            Row="tr"
            Body="tbody"
            Table="table"
            headerCellInnerElementType="th"
            tableCellInnerElementType="td"
            {...props}
          />
        </CardBody>
      </Card>
    </div>
  );
}
