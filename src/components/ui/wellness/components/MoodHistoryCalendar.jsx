// frontend/src/components/ui/wellness/components/MoodHistoryCalendar.jsx
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MoodHistoryCalendar = ({ moodCalendar, recentEntries }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getLevelColor = (level) => {
    const colors = {
      'green': 'bg-green-500',
      'yellow': 'bg-yellow-500',
      'orange': 'bg-orange-500',
      'red': 'bg-red-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  const getMoodDataForDate = (dateStr) => {
    return moodCalendar.find(entry => entry.date === dateStr);
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        day,
        date: dateStr,
        moodData: getMoodDataForDate(dateStr)
      });
    }
    
    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    const today = new Date();
    if (currentMonth.getMonth() < today.getMonth() || currentMonth.getFullYear() < today.getFullYear()) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    }
  };

  const handleDateClick = (dayData) => {
    if (dayData?.moodData) {
      setSelectedDate(dayData);
    }
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-pink-400" />
          <h3 className="text-xl font-bold text-white">Mood Calendar</h3>
        </div>
        
        {/* Month Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <span className="text-white font-semibold min-w-[150px] text-center">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition disabled:opacity-30"
            disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayData, index) => {
            if (!dayData) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const hasMood = dayData.moodData;
            const isToday = dayData.date === new Date().toISOString().split('T')[0];

            return (
              <button
                key={dayData.date}
                onClick={() => handleDateClick(dayData)}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm font-semibold
                  transition-all relative
                  ${hasMood 
                    ? 'hover:scale-110 cursor-pointer' 
                    : 'bg-white/5 text-gray-500 cursor-default'
                  }
                  ${isToday ? 'ring-2 ring-pink-500' : ''}
                `}
              >
                {hasMood && (
                  <div className={`absolute inset-0 ${getLevelColor(hasMood.dominant_level)} rounded-lg opacity-80`} />
                )}
                <span className={`relative z-10 ${hasMood ? 'text-white' : 'text-gray-500'}`}>
                  {dayData.day}
                </span>
                {hasMood && hasMood.moods.length > 0 && (
                  <span className="absolute top-1 right-1 text-xs">
                    {hasMood.emoji}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-400">Great</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-xs text-gray-400">Okay</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-xs text-gray-400">Struggling</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-xs text-gray-400">Difficult</span>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && selectedDate.moodData && (
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">
              {new Date(selectedDate.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-white text-sm"
            >
              Close
            </button>
          </div>
          <div className="space-y-2">
            {selectedDate.moodData.moods.map((mood, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-2xl">{mood.emoji}</span>
                <div>
                  <div className="text-sm font-semibold text-white capitalize">{mood.mood}</div>
                  <div className={`text-xs ${getLevelColor(mood.level).replace('bg-', 'text-')}`}>
                    {mood.level.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Entries List (Mobile Friendly) */}
      {recentEntries.length > 0 && (
        <div className="mt-6 lg:hidden">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Recent Entries</h4>
          <div className="space-y-2">
            {recentEntries.slice(0, 5).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{entry.emoji}</span>
                  <div>
                    <div className="text-sm font-semibold text-white capitalize">{entry.mood}</div>
                    <div className="text-xs text-gray-400">{entry.date}</div>
                  </div>
                </div>
                <div className={`text-xs font-semibold ${getLevelColor(entry.level).replace('bg-', 'text-')}`}>
                  {entry.level.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodHistoryCalendar;