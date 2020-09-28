import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from 'stylestrap';
import './bootstrap.scss';

const cacheState = {
  setState: null,
  state: null,
};

export function setState(theme) {
  cacheState.setState(theme);
}

export function getState() {
  return cacheState.state;
}

export default function DoczRoot(props) {
  const [state, setState] = useState(defaultTheme);
  useEffect(() => {
    cacheState.state = state;
    cacheState.setState = setState;
  }, [state]);
  return <ThemeProvider theme={state} {...props} />;
}
