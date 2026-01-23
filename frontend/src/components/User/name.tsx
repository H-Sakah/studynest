import React from 'react';
import { useName } from './nameContext';

export const Name = () => {
  const { firstName, lastName } = useName();

  return (
    <p>
      {firstName}
      {lastName && <span>, {lastName}</span>}
    </p>
  );
};
export { useName };
