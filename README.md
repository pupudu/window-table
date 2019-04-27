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

## Basic Usage

*See it live at* https://codesandbox.io/s/6w5ov594vn

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
Instead, we could have set that height in the `WindowTable` itself, or even in a parent of `NinjaTable`.
Or we can pass the pixel height as a prop, `height`.

It is important to set the height somewhere. 
Unless we do this, some random height will be used by the table, which is not ideal.

In fact, this requirement is intuitive, because we obviously don't want to render all the cells.

The code examples below this, will assume that a parent container will have set the height for the table.

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

## Dynamic Row Heights

Sometimes you know what the row height could be, but some other times you just don't. In the latter case,
you can pass in a sample cell, which will be used internally to derive a row height. As of now,
sadly, all rows will have the same height.
 
```tsx
import * as React from 'react'

import {Html5Table} from 'window-table'

const SampleCell = props => {
  // As an example, custom styles based on rem values which are not directly convertable to pixels
  // But this can be pretty much anything
  return <div style={{height: '3rem', padding: '0.5rem'}}>
    Some Data
  <div>;
}

function Table (props) {
  return (
    <Html5Table
      data={data}
      columns={columns}
      SampleCell={SampleCell}
    />
  )
}
```

## License

MIT © [pupudu](https://github.com/pupudu)
