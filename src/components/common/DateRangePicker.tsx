import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onClose: () => void;
}

export function DateRangePicker({ value, onChange, onClose }: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, onClose);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handleDayClick = (day: Date) => {
    if (!value.from || (value.from && value.to)) {
      onChange({ from: day, to: null });
    } else {
      if (day < value.from) {
        onChange({ from: day, to: value.from });
      } else {
        onChange({ from: value.from, to: day });
      }
    }
  };

  const isDaySelected = (day: Date) => {
    if (!day) return false;
    if (!value.from && !value.to) return false;
    if (value.from && !value.to) return day.getTime() === value.from.getTime();
    if (!value.from || !value.to) return false;
    
    return day >= value.from && day <= value.to;
  };

  const isDayInRange = (day: Date) => {
    if (!day || !value.from || !value.to) return false;
    return day > value.from && day < value.to;
  };

  const isStartDate = (day: Date) => {
    if (!day || !value.from) return false;
    return day.getTime() === value.from.getTime();
  };

  const isEndDate = (day: Date) => {
    if (!day || !value.to) return false;
    return day.getTime() === value.to.getTime();
  };

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-[300px]"
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <span className="font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth(currentMonth).map((day, index) => (
            <div key={index} className="aspect-square">
              {day ? (
                <button
                  onClick={() => handleDayClick(day)}
                  className={`w-full h-full flex items-center justify-center text-sm rounded-full transition-colors duration-200
                    ${isDaySelected(day)
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-gray-100'
                    }
                    ${isDayInRange(day)
                      ? 'bg-indigo-50'
                      : ''
                    }
                    ${isStartDate(day)
                      ? 'rounded-r-none'
                      : ''
                    }
                    ${isEndDate(day)
                      ? 'rounded-l-none'
                      : ''
                    }
                  `}
                >
                  {format(day, 'd')}
                </button>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600">
        {value.from && (
          <div>
            From: {format(value.from, 'MMM d, yyyy')}
          </div>
        )}
        {value.to && (
          <div>
            To: {format(value.to, 'MMM d, yyyy')}
          </div>
        )}
      </div>
    </div>
  );
}