import React from 'react';
import './bootstrap.scss';

export default function Bootstrap(props) {
  return (
    <div className={`${props.className || ''} bootstrap-wrapper`} {...props} />
  );
}
