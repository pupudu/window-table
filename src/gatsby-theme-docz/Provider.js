import React from 'react';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from 'stylestrap';

const defaultCssUrl =
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css';

export default function DoczRoot(props) {
  return (
    <div style={{ fontSize: '1rem' }}>
      <link
        href="https://fonts.googleapis.com/css?family=Barriecito&display=swap"
        rel="stylesheet"
      />
      <link href={defaultCssUrl} rel="stylesheet" />
      <ThemeProvider theme={defaultTheme} {...props} />;
    </div>
  );
}
