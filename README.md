# window-table

> Windowing Table for React based on React Window

[![NPM](https://img.shields.io/npm/v/window-table.svg)](https://www.npmjs.com/package/window-table) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This ReactJs table library is a tiny, yet powerful implementation of a windowed/virtualized table, based off the awesome
virtualization library, `react-window` by Brian Vaughn. 

One big caveat of using a custom table is styling. For instance, a normal HTML based table can be easily
styled with a style system such as bootstrap.

Thus, in addition to the basic window table, we export an HTML 5 tags (i.e. `<table>`, `<thead>`, `<tr>`, `<td>`, etc) based table, which is compatible with
popular style systems such as bootstrap. 

In fact, the HTML 5 tag based table is nothing but the basic windowed table with custom tags. You have full 
control over what these tags/components should be. 

## Install

```bash
npm install --save window-table
```

## Basic Usage

```tsx
import * as React from 'react'

import {WindowTable} from 'window-table'

const data = [
  {col1: 12, col2: 20, col3: 10, col4: 50},
  {col1: 11, col2: 99, col3: 30, col4: 12}
  //...
];

const columns = [
  {key: 'col1', width: 100, title: 'Column A'},
  {key: 'col2', width: 120, title: 'Column B'},
  {key: 'col3', width: 150, title: 'Column C'},
  {key: 'col4', width: 100, title: 'Column D'}
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

## Dynamic Row Heights

Sometime, you know what the row height could be, but sometimes you don't. In the latter case,
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
