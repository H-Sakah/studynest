import React from 'react';
import { useName } from '../User/name';
import { formatDate, getGermanDayName } from '../../utils/dateUtils';

export const Greeting = () => {
  const { firstName } = useName();
  const currentDay = getGermanDayName(new Date().getDay());
  const currentDate = formatDate();

  return (
    <div>
      <h1 className="text-lg font-bold">Hallo, {firstName}</h1>
      <p className="text-gray-600 text-sm">
        Heute ist {currentDay}, der {currentDate}
      </p>
    </div>
  );
};
