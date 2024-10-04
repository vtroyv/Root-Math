import React, { useState } from 'react';
import { Table, Button } from 'reactstrap';


const Calendar = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <thead>
        <tr>
          {daysOfWeek.map((day, index) => (
            <th  className='cal-th' key={index}>{day}</th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderCalendarDays = () => {
    const daysArray = [];
    const firstDay = new Date(year, month, 1).getDay();
    const days = daysInMonth(month, year);

    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<td className ='cal-td' key={`empty-${i}`} />);
    }

    for (let i = 1; i <= days; i++) {
      daysArray.push(<td key={`day-${i}`}>{i}</td>);
    }

    return (
      <tbody>
        {Array.from({ length: Math.ceil(daysArray.length / 7) }, (_, rowIndex) => (
          <tr key={`week-${rowIndex}`}>
            {daysArray.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, index) => day)}
          </tr>
        ))}
      </tbody>
    );
  };

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <Button color="link" onClick={handlePreviousMonth}>
          {'<'}
        </Button>
        <span>
          {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
            new Date(year, month),
          )}
        </span>
        <Button color="link" onClick={handleNextMonth}>
          {'>'}
        </Button>
      </div>
      <Table bordered color='info'>
        {renderDaysOfWeek()}
        {renderCalendarDays()}
      </Table>
    </div>
  );
};

export default Calendar;
