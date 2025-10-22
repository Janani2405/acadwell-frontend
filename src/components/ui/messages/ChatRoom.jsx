// frontend/src/components/ui/messages/ChatRoom.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API_BASE_URL, SOCKET_URL, apiCall } from '../../../api/api';
import { 
  Search, Paperclip, Send, MoreVertical, Pin, Edit2, Trash2, 
  Check, X, Users, Phone, Video, Info, ChevronDown, CheckCheck, 
  Image as ImageIcon, ArrowLeft, AlertCircle 
} from 'lucide-react';



const ChatRoom = () => {
  // CRITICAL FIX: Add this utility function at the top of ChatRoom.jsx
// This ensures timestamps are ALWAYS compared correctly regardless of timezone




  const { convId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [showPinned, setShowPinned] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [conversationInfo, setConversationInfo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');

  // Fetch conversation info
  useEffect(() => {
    if (!token || !convId) return;

    apiCall(`/api/messages/${convId}/info`)
      .then(data => {
        if (data?.conversation) {
          setConversationInfo(data.conversation);
        }
      })
      .catch(err => console.error('Error fetching conversation info:', err));
  }, [convId, token]);

  // Fetch existing messages
  useEffect(() => {
    if (!token || !convId) return;

    apiCall(`/api/messages/${convId}/messages`)
      .then(data => {
        if (data?.messages && Array.isArray(data.messages)) {
          const processedMessages = data.messages.map(msg => ({
            ...msg,
            content: typeof msg.content === 'string' ? msg.content : String(msg.content || ''),
            read_by: Array.isArray(msg.read_by) ? msg.read_by : []
          }));
          setMessages(processedMessages);
        }
      })
      .catch(err => console.error('Error fetching messages:', err));
  }, [convId, token]);

  // Fetch pinned messages - WITH ERROR HANDLING
  useEffect(() => {
    if (!token || !convId) return;

    // Only fetch if endpoint exists
    apiCall(`/api/messages/${convId}/pinned`)
      .then(data => {
        if (data?.pinned_messages && Array.isArray(data.pinned_messages)) {
          setPinnedMessages(data.pinned_messages);
        }
      })
      .catch(err => {
        // Silently handle error - pinned messages are optional feature
        console.log('Pinned messages not available:', err.message);
        setPinnedMessages([]);
      });
  }, [convId, token]);

  // Socket.IO connection
  useEffect(() => {
    if (!token || !convId) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      socketRef.current.emit('join_conversation', { conversation_id: convId });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('new_message', msg => {
      if (msg?.conversation_id === convId) {
        const processedMessage = {
          ...msg,
          content: typeof msg.content === 'string' ? msg.content : String(msg.content || ''),
          read_by: Array.isArray(msg.read_by) ? msg.read_by : [],
          timestamp: msg.timestamp || new Date().toISOString()
        };
        setMessages(prev => [...prev, processedMessage]);
      }
    });

    socketRef.current.on('message_edited', data => {
      if (data?.message_id && data?.content) {
        setMessages(prev => prev.map(m => 
          m.message_id === data.message_id 
            ? { ...m, content: data.content, edited: true }
            : m
        ));
      }
    });

    socketRef.current.on('message_deleted', data => {
      if (data?.message_id) {
        setMessages(prev => prev.filter(m => m.message_id !== data.message_id));
      }
    });

    socketRef.current.on('messages_read', data => {
      if (data?.user_id) {
        setMessages(prev => prev.map(m => ({
          ...m,
          read_by: Array.isArray(m.read_by) && !m.read_by.includes(data.user_id) 
            ? [...m.read_by, data.user_id] 
            : m.read_by
        })));
      }
    });

    socketRef.current.on('user_typing', data => {
      if (data?.user_id && data.user_id !== userId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    socketRef.current.on('error', err => {
      console.error('Socket error:', err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_conversation', { conversation_id: convId });
        socketRef.current.disconnect();
      }
    };
  }, [convId, token, userId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (!token || !convId || !isConnected || messages.length === 0) return;

    const timer = setTimeout(() => {
      apiCall(`/api/messages/${convId}/mark-read`, {
        method: 'POST'
      }).catch(err => console.error('Error marking as read:', err));
    }, 1000);

    return () => clearTimeout(timer);
  }, [convId, token, isConnected, messages.length]);

  // Send message
  const sendMessage = () => {
    const messageText = text.trim();
    if (!messageText || !socketRef.current || !isConnected) return;
    
    socketRef.current.emit('send_message', {
      conversation_id: convId,
      content: messageText,
      token,
    });
    
    setText('');
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!socketRef.current || !isConnected) return;

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    socketRef.current.emit('typing', { conversation_id: convId, token });

    const timeout = setTimeout(() => {
      socketRef.current.emit('stop_typing', { conversation_id: convId, token });
    }, 3000);

    setTypingTimeout(timeout);
  };

  // Edit message
  const handleEdit = async (messageId, newContent) => {
    try {
      await apiCall(`/api/messages/${convId}/edit/${messageId}`, {
        method: 'PUT',
        body: JSON.stringify({ content: newContent })
      });
      setEditingMessageId(null);
      setEditText('');
    } catch (err) {
      console.error('Error editing message:', err);
      alert('Failed to edit message');
    }
  };

  // Delete message
  const handleDelete = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await apiCall(`/api/messages/${convId}/delete/${messageId}`, {
        method: 'DELETE'
      });
      setSelectedMessage(null);
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message');
    }
  };

  // Toggle pin
  const togglePin = async (messageId) => {
    try {
      const response = await apiCall(`/api/messages/${convId}/pin/${messageId}`, {
        method: 'POST'
      });
      
      if (response?.is_pinned !== undefined) {
        if (response.is_pinned) {
          const msg = messages.find(m => m.message_id === messageId);
          if (msg) {
            setPinnedMessages(prev => [...prev, { ...msg, is_pinned: true }]);
          }
        } else {
          setPinnedMessages(prev => prev.filter(m => m.message_id !== messageId));
        }
        
        setMessages(prev => prev.map(m => 
          m.message_id === messageId 
            ? { ...m, is_pinned: response.is_pinned }
            : m
        ));
      }
      
      setSelectedMessage(null);
    } catch (err) {
      console.error('Error toggling pin:', err);
      alert('Pin feature not available');
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else {
      handleTyping();
    }
  };

// ✅ CORRECTED timestamp functions for ChatRoom.jsx
// Replace your existing timestamp functions with these

// Remove the getTimeDifferenceInSeconds function entirely - it's not needed

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    // Parse the UTC timestamp from backend
    const messageDate = new Date(timestamp);
    
    if (isNaN(messageDate.getTime())) {
      return '';
    }
    
    // Get current time in UTC milliseconds
    const nowMs = Date.now();
    const messageDateMs = messageDate.getTime();
    
    // Calculate difference in milliseconds
    const diffMs = nowMs - messageDateMs;
    
    // Handle future timestamps (shouldn't happen but be safe)
    if (diffMs < 0) {
      return 'Just now';
    }
    
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    // Less than 1 minute
    if (diffSecs < 60) {
      return 'Just now';
    }
    
    // Less than 1 hour
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    
    // Less than 24 hours
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    
    // Less than 7 days
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    
    // Older than 7 days - show date
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
};

const getReadableTime = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Display in user's local timezone (IST)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting readable time:', error);
    return '';
  }
};

// ❌ REMOVE the testTimestamp function and its useEffect call - it's just for debugging
  const filteredMessages = searchQuery
    ? messages.filter(m => m?.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const isGroup = conversationInfo?.participants?.length > 2;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/messages')}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-300 lg:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                  isGroup ? 'from-purple-500 to-pink-600' : 'from-blue-500 to-cyan-600'
                } flex items-center justify-center text-white font-semibold text-lg shadow-lg`}>
                  {isGroup ? <Users className="w-6 h-6" /> : conversationInfo?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full"></div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  {conversationInfo?.name || 'Chat'}
                  {isGroup && (
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                      {conversationInfo?.participants?.length} members
                    </span>
                  )}
                </h2>
                <p className="text-sm text-slate-400">
                  {isTyping ? (
                    <span className="text-blue-400">typing...</span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                      {isConnected ? 'Active now' : 'Offline'}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-300"
                title="Search messages"
              >
                <Search className="w-5 h-5" />
              </button>
              {pinnedMessages.length > 0 && (
                <button
                  onClick={() => setShowPinned(!showPinned)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-yellow-400 relative"
                  title="Pinned messages"
                >
                  <Pin className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {pinnedMessages.length}
                  </span>
                </button>
              )}
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-300"
                title="Conversation info"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in conversation..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Pinned Messages Bar */}
          {showPinned && pinnedMessages.length > 0 && (
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-400 text-sm font-semibold flex items-center gap-2">
                  <Pin className="w-4 h-4" />
                  Pinned Messages
                </span>
                <button onClick={() => setShowPinned(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {pinnedMessages.map(msg => (
                  <div key={msg.message_id} className="text-sm text-slate-300 bg-slate-800/50 p-2 rounded">
                    <span className="font-semibold text-slate-200">{msg.sender_name}:</span> {msg.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Search className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">
                {searchQuery ? 'No messages found' : 'No messages yet'}
              </p>
              <p className="text-sm mt-2">Start the conversation!</p>
            </div>
          ) : (
            filteredMessages.map((msg, index) => {
              if (!msg || !msg.message_id) return null;

              const isMyMessage = String(msg.sender_id) === String(userId);
              const showAvatar = !isMyMessage && (index === 0 || filteredMessages[index - 1]?.sender_id !== msg.sender_id);
              const isRead = Array.isArray(msg.read_by) && msg.read_by.length > 1;

              return (
                <div
                  key={msg.message_id}
                  className={`flex gap-3 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} group`}
                >
                  {/* Avatar */}
                  {!isMyMessage && (
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                          {msg.sender_name?.charAt(0) || '?'}
                        </div>
                      ) : (
                        <div className="w-8"></div>
                      )}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className={`flex flex-col max-w-[70%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
                    {showAvatar && !isMyMessage && (
                      <span className="text-xs text-slate-400 mb-1 ml-1">{msg.sender_name}</span>
                    )}
                    
                    <div className="relative">
                      {editingMessageId === msg.message_id ? (
                        <div className={`p-3 rounded-2xl ${
                          isMyMessage ? 'bg-blue-600' : 'bg-slate-700'
                        }`}>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="bg-transparent text-white outline-none w-full resize-none"
                            autoFocus
                            rows={2}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleEdit(msg.message_id, editText)}
                              className="p-1.5 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingMessageId(null);
                                setEditText('');
                              }}
                              className="p-1.5 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`p-3 rounded-2xl shadow-lg ${
                              isMyMessage
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
                                : 'bg-slate-700/80 text-white rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {msg.content || ''}
                            </p>
                            {msg.is_pinned && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-yellow-400">
                                <Pin className="w-3 h-3" />
                                Pinned
                              </div>
                            )}
                          </div>
                          
                          {/* Message Actions */}
                          <button
                            onClick={() => setSelectedMessage(msg.message_id === selectedMessage ? null : msg.message_id)}
                            className={`absolute ${isMyMessage ? '-left-8' : '-right-8'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded transition-all`}
                          >
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </button>

                          {/* Actions Menu */}
                          {selectedMessage === msg.message_id && (
                            <div className={`absolute ${isMyMessage ? 'left-0' : 'right-0'} top-full mt-1 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-10 min-w-[150px]`}>
                              {isMyMessage && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingMessageId(msg.message_id);
                                      setEditText(msg.content);
                                      setSelectedMessage(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(msg.message_id)}
                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => togglePin(msg.message_id)}
                                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                              >
                                <Pin className="w-4 h-4" />
                                {msg.is_pinned ? 'Unpin' : 'Pin'}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Timestamp and Status */}
                    <div className={`flex items-center gap-1 mt-1 text-xs text-slate-500 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span 
                        className="text-xs text-slate-500 cursor-help"
                        title={getReadableTime(msg.timestamp)}
                      >
                        {formatTimestamp(msg.timestamp)}
                      </span>
                      {msg.edited && <span>• edited</span>}
                      {isMyMessage && isRead && (
                        <CheckCheck className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-slate-800/50 backdrop-blur-lg border-t border-slate-700/50 px-6 py-4">
          {!isConnected && (
            <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2 text-yellow-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Reconnecting...
            </div>
          )}
          
          <div className="flex items-end gap-3">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 hover:bg-slate-700/50 rounded-xl transition-colors text-slate-400 hover:text-white"
              title="Attach file"
              disabled={!isConnected}
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 bg-slate-700/50 rounded-2xl border border-slate-600/50 focus-within:border-blue-500 transition-all">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  handleTyping();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-400 resize-none focus:outline-none max-h-32"
                rows={1}
                disabled={!isConnected}
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={!text.trim() || !isConnected}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 rounded-xl transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              title="Send message"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Side Panel - Conversation Info */}
      {showInfo && conversationInfo && (
        <div className="w-80 bg-slate-800/50 backdrop-blur-lg border-l border-slate-700/50 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Conversation Info</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${
                isGroup ? 'from-purple-500 to-pink-600' : 'from-blue-500 to-cyan-600'
              } flex items-center justify-center text-3xl shadow-xl mb-4`}>
                {isGroup ? <Users className="w-10 h-10 text-white" /> : conversationInfo.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{conversationInfo.name || 'Chat'}</h3>
              <p className="text-sm text-slate-400">
                {isGroup ? `${conversationInfo.participants?.length || 0} members` : 'Direct Message'}
              </p>
            </div>

            {conversationInfo.participants && conversationInfo.participants.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-400 mb-3">
                  {isGroup ? 'Members' : 'Participant'}
                </h4>
                <div className="space-y-2">
                  {conversationInfo.participants.map(participant => (
                    <div key={participant.user_id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {participant.name?.charAt(0) || '?'}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-slate-800 rounded-full ${
                          participant.status === 'online' ? 'bg-green-500' : 'bg-slate-500'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm truncate">{participant.name}</div>
                        <div className="text-xs text-slate-400">{participant.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-all text-left">
                <span className="text-sm text-slate-300">Notifications</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;