import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Info, Users as UsersIcon, X } from 'lucide-react';
import { groupsApi } from '../../../api/api';

const StudyGroupChat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [currentUserAnonId, setCurrentUserAnonId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchGroupData();
    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchGroupData = async () => {
    try {
      const groupData = await groupsApi.getGroupDetails(groupId);
      if (groupData.success) {
        setGroup(groupData.group);
        // Determine current user's anon ID (first message they send will have it)
        fetchMessages();
      }
    } catch (err) {
      console.error('Error fetching group:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await groupsApi.getGroupMessages(groupId);
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const result = await groupsApi.sendGroupMessage(groupId, newMessage);
      if (result.success) {
        // Set current user's anon ID from response
        if (result.message?.anonId) {
          setCurrentUserAnonId(result.message.anonId);
        }
        setNewMessage('');
        await fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  const leaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;

    try {
      const result = await groupsApi.leaveGroup(groupId);
      if (result.success) {
        navigate('/messages');
      }
    } catch (err) {
      console.error('Error leaving group:', err);
      alert('Failed to leave group');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <p>Loading group...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="text-center">
          <p className="text-lg mb-4">Group not found</p>
          <button
            onClick={() => navigate('/messages')}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-lg border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/messages')}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold">{group.name}</h2>
              <p className="text-sm text-slate-400">
                {group.memberCount || group.membersAnonIds?.length || 0} members
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMyMessage = msg.anonId === currentUserAnonId && !msg.system;
              
              if (msg.system) {
                return (
                  <div key={msg._id} className="flex justify-center py-2">
                    <div className="text-center text-slate-500 text-xs italic bg-slate-700/30 px-3 py-1 rounded-full">
                      {msg.message}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      isMyMessage
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                        : 'bg-slate-700 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {!isMyMessage && (
                      <div className="text-xs font-semibold mb-1 text-purple-300">
                        {msg.anonId || 'Anonymous'}
                      </div>
                    )}
                    <p className="break-words text-sm leading-relaxed">
                      {msg.message}
                    </p>
                    <div className={`text-xs mt-1 ${
                      isMyMessage ? 'text-blue-200' : 'text-slate-400'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-slate-800/50 backdrop-blur-lg border-t border-white/10 px-6 py-4">
          <div className="flex gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-600 rounded-full transition-all disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Group Info Panel */}
      {showInfo && (
        <div className="w-80 bg-slate-800/50 backdrop-blur-lg border-l border-white/10 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Group Info</h3>
            <button
              onClick={() => setShowInfo(false)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Group Details */}
          <div className="mb-6">
            <h4 className="text-xl font-bold mb-2">{group.name}</h4>
            <p className="text-sm text-slate-400 mb-4">
              {group.description || 'No description provided'}
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
              <span className="inline-block px-2 py-1 bg-slate-700/50 rounded text-xs">
                {group.isPrivate ? '🔒 Private' : '🌐 Public'}
              </span>
              <span>{group.memberCount || 0} members</span>
            </div>
          </div>

          {/* Members List */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              Members ({group.membersAnonIds?.length || 0})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {group.membersAnonIds?.map((name, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    name === currentUserAnonId
                      ? 'bg-blue-600/30 border border-blue-500/50'
                      : 'bg-slate-700/30 hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-sm">
                    {name}
                    {name === currentUserAnonId && <span className="text-xs text-blue-300 ml-2">(you)</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Leave Button */}
          <button
            onClick={leaveGroup}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-all"
          >
            Leave Group
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyGroupChat;