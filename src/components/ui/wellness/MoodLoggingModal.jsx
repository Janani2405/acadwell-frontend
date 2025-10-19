// frontend/src/components/ui/wellness/MoodLoggingModal.jsx
import React, { useState } from 'react';
import { X, Lock, Send, AlertCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { logMood } from '../../../api/wellnessApi';

const MoodLoggingModal = ({ isOpen, onClose, onMoodLogged }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Date selection
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', description: 'Feeling great!' },
    { id: 'okay', emoji: '😐', label: 'Okay', description: 'Doing alright' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', description: 'Under pressure' },
    { id: 'sad', emoji: '😢', label: 'Sad', description: 'Feeling down' },
    { id: 'anxious', emoji: '😨', label: 'Anxious', description: 'Worried/nervous' },
    { id: 'overwhelmed', emoji: '😫', label: 'Overwhelmed', description: 'Too much to handle' }
  ];

  // Get calendar days for current month
  const getCalendarDays = () => {
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
      days.push({
        day,
        date,
        dateString: date.toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  const isDateSelected = (dateString) => {
    return selectedDate.toISOString().split('T')[0] === dateString;
  };

  const isDateInFuture = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
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

  const handleDateSelect = (dayData) => {
    if (!isDateInFuture(dayData.date)) {
      setSelectedDate(dayData.date);
      setShowDatePicker(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMood) {
      setError('Please select a mood');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mood = moods.find(m => m.id === selectedMood);
      const selectedDateString = selectedDate.toISOString().split('T')[0];
      
      const response = await logMood({
        mood: selectedMood,
        emoji: mood.emoji,
        note: note.trim(),
        date: selectedDateString  // Include date in request
      });

      // Success - close modal and refresh dashboard
      if (onMoodLogged) {
        onMoodLogged(response);
      }
      
      // Reset form
      setSelectedMood(null);
      setNote('');
      setSelectedDate(new Date());
      onClose();
      
    } catch (err) {
      console.error('Error logging mood:', err);
      setError('Failed to log mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedMood(null);
      setNote('');
      setError(null);
      setSelectedDate(new Date());
      setShowDatePicker(false);
      onClose();
    }
  };

  const calendarDays = getCalendarDays();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectedDateDisplay = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-pink-500/20 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-gradient-to-br from-gray-900 to-gray-800">
          <h2 className="text-2xl font-bold text-white">How are you feeling? 😊</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Date Picker Button */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Select Date
            </label>
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-400" />
                {selectedDateDisplay}
              </span>
              <ChevronRight className={`w-5 h-5 transition-transform ${showDatePicker ? 'rotate-90' : ''}`} />
            </button>

            {/* Calendar Picker */}
            {showDatePicker && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4">
                
                {/* Month Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={previousMonth}
                    className="p-2 rounded-lg hover:bg-white/10 transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <span className="text-white font-semibold">{monthName}</span>
                  <button
                    type="button"
                    onClick={nextMonth}
                    disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
                    className="p-2 rounded-lg hover:bg-white/10 transition disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2">
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
                      return <div key={`empty-${index}`} />;
                    }

                    const isFuture = isDateInFuture(dayData.date);
                    const isSelected = isDateSelected(dayData.dateString);
                    const isCurrentDay = isToday(dayData.date);

                    return (
                      <button
                        key={dayData.dateString}
                        type="button"
                        onClick={() => handleDateSelect(dayData)}
                        disabled={isFuture}
                        className={`
                          aspect-square rounded-lg flex items-center justify-center text-sm font-semibold
                          transition-all
                          ${isFuture 
                            ? 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50' 
                            : isSelected
                            ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white scale-110'
                            : isCurrentDay
                            ? 'bg-white/10 text-white ring-2 ring-pink-500'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                          }
                        `}
                      >
                        {dayData.day}
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-500 text-center">
                  You can log mood for any past date
                </p>
              </div>
            )}
          </div>

          {/* Mood Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Select your mood:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setSelectedMood(mood.id)}
                  className={`
                    flex flex-col items-center p-4 rounded-xl border-2 transition-all
                    ${selectedMood === mood.id 
                      ? 'border-pink-500 bg-pink-500/20 scale-105' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  <span className="text-4xl mb-2">{mood.emoji}</span>
                  <span className="text-sm font-semibold text-white">{mood.label}</span>
                  <span className="text-xs text-gray-400 text-center mt-1">
                    {mood.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Add a note (optional):
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind? This helps us understand you better..."
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {note.length}/500 characters
              </span>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-300">
                <strong>Your privacy matters:</strong> Only you and campus counselors can see this information.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-300">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white/5 text-gray-300 rounded-lg font-semibold hover:bg-white/10 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedMood}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Logging...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Log Mood
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodLoggingModal;