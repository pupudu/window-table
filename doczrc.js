export default {
  title: 'Window-Table',
  description: 'Render millions of rows in a table',
  files: 'docz/**/*.mdx',
  dest: '/website',
  onCreateWebpackChain: config => {
    // Allow SCSS imports
    config.module
      .rule('scss')
      .test(/\.css|scss|sass$/)
      .use('style')
      .loader('style-loader')
      .end()
      .use('css')
      .loader('css-loader')
      .end()
      .use('sass')
      .loader('sass-loader')
      .end();
  },
  menu: [
    { name: 'Getting Started', menu: ['Introduction', 'Basic Usage'] },
    { name: 'Components API', menu: ['WindowTable', 'HTML5Table'] },
    { name: 'Guides', menu: ['Striped Table'] },
    { name: 'Github', href: 'https://github.com/pupudu/window-table' }
  ],
  typescript: true,
  wrapper: 'docz/DoczRoot'
};
