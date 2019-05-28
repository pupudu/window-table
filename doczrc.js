import { css } from 'docz-plugin-css';

export default {
  title: 'Window-Table',
  description: 'Render millions of rows in a table',
  files: 'docz/**/*.mdx',
  dest: '/website',
  plugins: [
    css({
      preprocessor: 'sass'
    })
  ],
  menu: [
    { name: 'Getting Started', menu: ['Introduction', 'Basic Usage'] },
    { name: 'Components API', menu: ['WindowTable', 'HTML5Table'] },
    { name: 'Guides', menu: ['Striped Table'] },
    { name: 'Github', href: 'https://github.com/pupudu/window-table' }
  ],
  wrapper: 'docz/DoczRoot'
};
