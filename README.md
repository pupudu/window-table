# window-table

> Windowing Table for React based on React Window

[![NPM](https://img.shields.io/npm/v/window-table.svg)](https://www.npmjs.com/package/window-table) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This ReactJs table library is a tiny, yet powerful implementation of a windowed/virtualized table, based off the awesome
virtualization library, `react-window` by Brian Vaughn. 

* Blazing Fast - thanks to `react-window`
* Tiny footprint - <2kB
* Super easy to customize - Custom tags, class names and what not
* Supports HTML5 table tags
* Production Ready - Being used all over the Admin application at hipages, Australia

One big caveat of using a custom table is styling. For instance, a normal HTML based table can be easily
styled with a style system such as bootstrap, but a `div` based table requires a bit more effort.

Thus, in addition to the basic window table, we export an HTML 5 tags (i.e. `<table>`, `<thead>`, `<tr>`, `<td>`, etc) based table, which is compatible with
popular style systems such as bootstrap. 

In fact, the HTML 5 tag based table is nothing but the basic windowed table with custom tags. You have full 
control over what these tags/components should be. 

## Install

```bash
npm install --save window-table
```

*See live example at:* https://codesandbox.io/s/6w5ov594vn

## Basic Usage

```tsx
import * as React from 'react'

import {WindowTable} from 'window-table'

const data = [
  {name: 'Naruto', age: 24, clan: 'Uzomaki'},
  {name: 'Hinata', age: 22, clan: 'Huga'},
  {name: 'Itachi', age: 28, clan: 'Uchiha'},
  //...and thousands or millions of data
];

const columns = [
  {key: 'name', width: 100, title: 'Name'},
  {key: 'age', width: 80, title: 'Age'},
  {key: 'clan', width: 150, title: 'Clan'}
];

function ShinobiTable (props) {
  return (
    <div style={{height: '500px'}}>
      <WindowTable
        data={data}
        columns={columns}
      />
    </div>
  )
}
```
Note that we are wrapping the `WindowTable` with a `div` which has a height of `500px`.
Instead, we could have set that height in the `WindowTable` itself, 
or even in a parent container of `NinjaTable`.

We can also pass an explicit height. But this is discouraged unless
you know what you are doing.

## HTML 5 tags based table

```tsx
import * as React from 'react'

import {Html5Table} from 'window-table'

function Table (props) {
  return (
    <Html5Table
      data={data}
      columns={columns}
      rowHeight={50}
    />
  )
}
```

## Using custom tags

```tsx
import * as React from 'react'

import {WindowTable} from 'window-table'

const CustomThead: React.ElementType = props => {
  return <thead {...props} className="thead-dark" />;
};

function Table (props) {
  return (
    <WindowTable
      data={data}
      columns={columns}
      rowHeight={50}
      
      className="table"
      Cell="td"
      HeaderCell="th"
      Header={CustomThead}
      HeaderRow="tr"
      Row="tr"
      Body="tbody"
      Table="table"
    />
  )
}
```

## Custom Cells by Column
Some cells in a table most likely needs to render something other than plain text.
In such cases, you can define the custom Component in the column options object.

```tsx
const CustomCell = props => {
  const {row, column} = props; // row comes from table data, column comes from column metadata
  
  function toggle() {
    // Do something based on data row, or column
  }
  
  // Render any react component
  return <Button onClick={toggle}>Click Me</Button>
}

const columns = [
  {key: 'col1', width: 100, title: 'Column A'},
  {key: 'col2', width: 120, title: 'Column B'},
  {key: 'col3', width: 150, title: 'Column C', Component: CustomCell},
];

function Table (props) {
  return (
    <WindowTable
      data={data}
      columns={columns}
      rowHeight={50}
    />
  )
}
```

Similarly you can pass a custom react component as `HeaderCell` to the column options
to render a custom header cell.

## Row Heights
The height of a row in the table is determined internally by rendering 
the first data row covertly.

However, we cannot always rely on the first data row to
represent all rows. Thus you can pass different options
to suit your requirement. Let's have a look:

#### 1. sampleRow
For changing data, you can pass a sample data row, which
will be used internally to measure the resulting height.

#### 2. sampleRowIndex
You can pass the index of the best data row to determine the
height for table rows.

Please create an issue in the github repo if you
are using this option. This might get deprecated soon
if otherwise.

#### 3. rowHeight
You can pass a static explicit height, which will disable
the row measurer mechanism. 

#### 4. rowHeight as a function
You can also pass a function which accepts the index
of the row being rendered as a parameter. The value
returned from this function will be used as the row height
for that row. This option can be useful for a table
with variable row heights.

## Static table dimensions
The window table tries to measure both row dimensions and
table dimensions for you. 
However, you can opt-out of this behavior by supplying
explicit dimensions. 

The following example shows how table height, table width,
and rowHeight can be customized. The ones which are
not supplied will be measured. 

```tsx
function Table (props) {
  return (
    <WindowTable
      height={600}
      width={400}
      rowHeight={50}
    />
  )
}
```

This behaviour is not optimal if you want the table
dimensions to change based on CSS or window resize events.

## License

MIT © [pupudu](https://github.com/pupudu)
