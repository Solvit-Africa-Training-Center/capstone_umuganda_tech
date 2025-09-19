import React from 'react';
import type { Task  } from '../../types/LeaderDashboard';

const TaskList: React.FC = () => {
  const tasks: Task[] = [
    { id: 1, title: "Review Q3 Marketing Plan", dueDate: "Tomorrow" },
    { id: 2, title: "Submit 'AI Advisory' client report", dueDate: "Thursday" },
    { id: 3, title: "Project 'Eco-Homes' final presentation", dueDate: "Friday" },
    { id: 4, title: "Team sync for 'Smart Waste Management'", dueDate: "Next Monday" },
    { id: 5, title: "Prepare 'Live Map' feature roadmap", dueDate: "Next Tuesday" },
  ];

  const getDueDateColor = (dueDate: string): string => {
    switch (dueDate) {
      case 'Tomorrow':
        return 'text-orange-500';
      case 'Thursday':
        return 'text-gray-500';
      case 'Friday':
        return 'text-gray-500';
      case 'Next Monday':
        return 'text-gray-400';
      case 'Next Tuesday':
        return 'text-gray-400';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <div className="p-4">
        {tasks.map((task, index) => (
          <div key={task.id} className={`py-3 ${index < tasks.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 leading-5">
                  {task.title}
                </h3>
              </div>
              <div className="ml-4 flex-shrink-0">
                <span className={`text-xs font-medium ${getDueDateColor(task.dueDate)}`}>
                  {task.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;