import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TaskList from './TaskList';

interface Props { deadlines?: Date[]; }
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];


const UpcomingCalendar: React.FC<Props> = ({ deadlines = [] }) => {
  const [value, setValue] = useState<Value>(new Date()); 

  const tileClassName = ({ date, view }: { date: Date; view: string }) =>
    view === 'month' && deadlines.some((d) => d.toDateString() === date.toDateString())
      ? 'bg-green-200 rounded'
      : '';

  return (
    <div className="bg-white shadow p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Upcoming Deadlines</h3>
      <Calendar locale="en-US" onChange={setValue} value={value} tileClassName={tileClassName} />
      <TaskList/>
    </div>
  );
};

export default UpcomingCalendar;
