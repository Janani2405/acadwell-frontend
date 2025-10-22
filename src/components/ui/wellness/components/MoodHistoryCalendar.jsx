// frontend/src/components/ui/wellness/components/MoodHistoryCalendar.jsx
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MoodHistoryCalendar = ({ moodCalendar, recentEntries }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // ✅ FIXED: Format date correctly without timezone issues
  const formatDateForComparison = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getLevelColor = (level) => {
    const colors = {
      'green': 'bg-green-500',
      'yellow': 'bg-yellow-500',
      'orange': 'bg-orange-500',
      'red': 'bg-red-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  const getLevelTextColor = (level) => {
    const colors = {
      'green': 'text-green-400',
      'yellow': 'text-yellow-400',
      'orange': 'text-orange-400',
      'red': 'text-red-400'
    };
    return colors[level] || 'text-gray-400';
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
      const dateStr = formatDateForComparison(date); // ✅ Use local date formatting
      days.push({
        day,
        date: dateStr,
        dateObject: date,
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
  const todayString = formatDateForComparison(new Date()); // ✅ Use local date for today

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
            aria-label="Previous month"
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
            aria-label="Next month"
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
            const isToday = dayData.date === todayString; // ✅ Compare with local date
            const isFuture = dayData.dateObject > new Date();

            return (
              <button
                key={dayData.date}
                onClick={() => handleDateClick(dayData)}
                disabled={!hasMood}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm font-semibold
                  transition-all relative
                  ${hasMood 
                    ? 'hover:scale-110 hover:shadow-lg cursor-pointer' 
                    : 'bg-white/5 text-gray-600 cursor-default'
                  }
                  ${isToday ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-gray-900' : ''}
                  ${isFuture ? 'opacity-40' : ''}
                `}
                title={hasMood ? `${hasMood.emoji} - Click for details` : 'No mood logged'}
              >
                {/* Mood background color */}
                {hasMood && (
                  <div className={`absolute inset-0 ${getLevelColor(hasMood.dominant_level || hasMood.level)} rounded-lg opacity-90`} />
                )}
                
                {/* Day number */}
                <span className={`relative z-10 ${hasMood ? 'text-white drop-shadow-md' : 'text-gray-600'}`}>
                  {dayData.day}
                </span>
                
                {/* Emoji indicator */}
                {hasMood && hasMood.emoji && (
                  <span className="absolute top-0.5 right-0.5 text-base leading-none">
                    {hasMood.emoji}
                  </span>
                )}
                
                {/* Multiple moods indicator */}
                {hasMood && hasMood.moods && hasMood.moods.length > 1 && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] bg-white/30 px-1 rounded-full text-white font-bold">
                    {hasMood.moods.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 border-t border-white/10">
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

      {/* Selected Date Details Modal */}
      {selectedDate && selectedDate.moodData && (
        <div className="mt-6 p-5 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-400" />
              {selectedDate.dateObject.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </h4>
            <button
              onClick={() => setSelectedDate(null)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Mood entries for selected date */}
          <div className="space-y-3">
            {selectedDate.moodData.moods && selectedDate.moodData.moods.length > 0 ? (
              selectedDate.moodData.moods.map((mood, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-3xl">{mood.emoji || '😊'}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-semibold text-white capitalize">{mood.mood}</div>
                      <div className={`text-xs font-bold px-2 py-0.5 rounded ${getLevelTextColor(mood.level)} bg-white/10`}>
                        {mood.level.toUpperCase()}
                      </div>
                    </div>
                    {mood.note && (
                      <p className="text-xs text-gray-400 mt-2 italic">"{mood.note}"</p>
                    )}
                    {mood.score !== undefined && (
                      <div className="text-xs text-gray-500 mt-1">Score: {mood.score}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">{selectedDate.moodData.emoji || '😊'}</div>
                <div className="text-sm text-gray-400">Mood logged</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Entries List (Mobile Friendly) */}
      {recentEntries && recentEntries.length > 0 && (
        <div className="mt-6 lg:hidden">
          <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Recent Entries
          </h4>
          <div className="space-y-2">
            {recentEntries.slice(0, 5).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{entry.emoji || '😊'}</span>
                  <div>
                    <div className="text-sm font-semibold text-white capitalize">{entry.mood}</div>
                    <div className="text-xs text-gray-400">
                      {entry.date ? new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      }) : 'Unknown date'}
                    </div>
                  </div>
                </div>
                <div className={`text-xs font-semibold ${getLevelTextColor(entry.level)}`}>
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