import React, { useState } from 'react';
import TaskList from './TaskList';
import type { Reminder, Props } from '../../types/Calendar';
import { Edit, Trash2, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';


const ReminderCalendarApp: React.FC<Props> = ({ deadlines = [] }) => {
  const [currentPage, setCurrentPage] = useState<'calendar' | 'reminder'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date) => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() === today.getTime();
  };

  const isFuture = (date: Date) => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() > today.getTime();
  };

  const hasReminder = (date: Date) => {
    return reminders.some(reminder => 
      new Date(reminder.date).toDateString() === date.toDateString()
    );
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDayClassName = (date: Date | null) => {
    if (!date) return 'invisible';
    
    const hasReminderOnDate = hasReminder(date);
    const isDeadline = deadlines.some((d) => d.toDateString() === date.toDateString());
    
    let classes = 'w-12 h-12 flex items-center justify-center text-sm cursor-pointer transition-all duration-200 ';
    
    if (hasReminderOnDate) {
      if (isToday(date)) {
        // Today's activities: bg-primaryColor-900 with full rounded
        classes += 'bg-primaryColor-900 text-white rounded-full ';
      } else if (isFuture(date)) {
        // Upcoming/selected days: full rounded border with border-primaryColor-800
        classes += 'border-2 border-primaryColor-800 rounded-full text-blue-800 ';
      } else {
        // Past days: full rounded border with border-gray-500
        classes += 'border-2 border-gray-500 rounded-full text-gray-600 ';
      }
    } else {
      classes += 'hover:bg-gray-100 rounded-full ';
      if (isToday(date)) {
        classes += 'bg-gray-200 font-semibold ';
      }
    }
    
    if (isDeadline && !hasReminderOnDate) {
      classes += 'bg-green-200 ';
    }
    
    return classes;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentPage('reminder');
  };

  const goBackToCalendar = () => {
    setCurrentPage('calendar');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar Page Component
  const CalendarPage = () => {
    const days = getDaysInMonth(currentDate);

    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="h-8 flex items-center justify-center font-medium text-gray-600 text-xs">
                {day}
              </div>
            ))}
            
            {days.map((date, index) => (
              <div
                key={index}
                className={getDayClassName(date)}
                onClick={() => date && handleDateClick(date)}
              >
                {date?.getDate()}
              </div>
            ))}
          </div>

          {/* Task List Preview */}
          <TaskList/>
          
        </div>
      </div>
    );
  };

  // Reminder Page Component
  const ReminderPage = () => {
    const [newReminder, setNewReminder] = useState({ title: '', description: '' });
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

    const selectedDateReminders = reminders.filter(reminder => 
      selectedDate && new Date(reminder.date).toDateString() === selectedDate.toDateString()
    );

    const handleCreateReminder = () => {
      if (!newReminder.title.trim() || !selectedDate) return;

      const reminder: Reminder = {
        id: Date.now().toString(),
        title: newReminder.title,
        description: newReminder.description,
        date: selectedDate
      };

      setReminders(prev => [...prev, reminder]);
      setNewReminder({ title: '', description: '' });
    };

    const handleEditReminder = (reminder: Reminder) => {
      setEditingReminder(reminder);
      setNewReminder({ title: reminder.title, description: reminder.description || '' });
    };

    const handleUpdateReminder = () => {
      if (!editingReminder || !newReminder.title.trim()) return;

      setReminders(prev => prev.map(r => 
        r.id === editingReminder.id 
          ? { ...r, title: newReminder.title, description: newReminder.description }
          : r
      ));
      
      setEditingReminder(null);
      setNewReminder({ title: '', description: '' });
    };

    const handleDeleteReminder = (id: string) => {
      setReminders(prev => prev.filter(r => r.id !== id));
    };

    const formatSelectedDate = () => {
      if (!selectedDate) return '';
      return selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center p-4 border-b bg-gray-600">
          <button onClick={goBackToCalendar} className="mr-4 text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white text-lg font-medium">Create Reminder</h1>
        </div>

        <div className="p-4">
          <p className="text-gray-600 text-sm mb-6">
            Let's help you create a reminder for the day.
          </p>

          {/* Create Reminder Form */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Create reminder"
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            
            <textarea
              placeholder="Description (optional)"
              value={newReminder.description}
              onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md mb-4 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            
            <button
              onClick={editingReminder ? handleUpdateReminder : handleCreateReminder}
              className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              {editingReminder ? 'Update' : 'Create'}
            </button>

            {editingReminder && (
              <button
                onClick={() => {
                  setEditingReminder(null);
                  setNewReminder({ title: '', description: '' });
                }}
                className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* Recent Reminders */}
          <div>
            <h3 className="font-medium mb-4">Recent Reminders</h3>
            
            <div className="space-y-3">
              {selectedDateReminders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reminders for {formatSelectedDate()}</p>
              ) : (
                selectedDateReminders.map((reminder) => (
                  <div key={reminder.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-800">{reminder.title}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(reminder.date).toLocaleDateString()}
                        </span>
                      </div>
                      {reminder.description && (
                        <p className="text-sm text-gray-600">{reminder.description}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={() => handleEditReminder(reminder)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Show all reminders if there are any */}
              {reminders.length > 0 && selectedDateReminders.length === 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 border-t pt-4">All Reminders</h4>
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-md mb-2">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800">{reminder.title}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(reminder.date).toLocaleDateString()}
                          </span>
                        </div>
                        {reminder.description && (
                          <p className="text-sm text-gray-600">{reminder.description}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-3">
                        <button
                          onClick={() => handleEditReminder(reminder)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main App Render
  return (
    <div className="min-h-screen bg-gray-100">
      {currentPage === 'calendar' ? <CalendarPage /> : <ReminderPage />}
    </div>
  );
};

export default ReminderCalendarApp;