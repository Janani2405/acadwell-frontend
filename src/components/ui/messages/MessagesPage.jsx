import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiCall, groupsApi } from '../../../api/api';
import { 
  Search, MessageSquarePlus, Users, Clock, CheckCheck, Pin, MoreVertical, 
  Plus, BookOpen, Globe, Lock, MessageCircle, X 
} from 'lucide-react';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, unread, groups
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  // Study Groups State
  const [myGroups, setMyGroups] = useState([]);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState('');

  // Create Group Form
  const [newGroupForm, setNewGroupForm] = useState({
    name: '',
    description: '',
    isPrivate: false
  });
  const [creatingGroup, setCreatingGroup] = useState(false);

  // Fetch conversations
  useEffect(() => {
    if (!token) return;
    
    apiCall('/api/messages/conversations')
      .then(data => {
        if (data.conversations) setConversations(data.conversations);
      })
      .catch(console.error);
  }, [token]);

  // Fetch all users
  useEffect(() => {
    if (!token) return;
    
    apiCall('/api/auth/users')
      .then(data => {
        if (data.users) {
          const filteredUsers = data.users.filter(u => u.user_id !== currentUserId);
          setUsers(filteredUsers);
        }
      })
      .catch(console.error);
  }, [token, currentUserId]);

  // Fetch groups when groups tab is selected
  useEffect(() => {
    if (activeTab === 'groups') {
      fetchGroups();
    }
  }, [activeTab]);

  // Fetch my groups and suggestions
  const fetchGroups = async () => {
    setGroupsLoading(true);
    setGroupsError('');
    try {
      const [myGroupsData, suggestionsData] = await Promise.all([
        groupsApi.getMyGroups(),
        groupsApi.getSuggestedGroups()
      ]);

      if (myGroupsData.success) {
        setMyGroups(myGroupsData.groups || []);
      }
      if (suggestionsData.success) {
        setSuggestedGroups(suggestionsData.groups || []);
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
      setGroupsError('Failed to load groups');
    } finally {
      setGroupsLoading(false);
    }
  };

  // Create new group
  const createGroup = async () => {
    if (!newGroupForm.name.trim()) {
      alert('Group name is required');
      return;
    }

    setCreatingGroup(true);
    try {
      const result = await groupsApi.createGroup(
        newGroupForm.name,
        newGroupForm.description,
        newGroupForm.isPrivate
      );

      if (result.success) {
        setShowCreateGroupModal(false);
        setNewGroupForm({ name: '', description: '', isPrivate: false });
        await fetchGroups();
        // Navigate to the new group
        navigate(`/study-group/${result.group._id}`);
      } else {
        alert(result.message || 'Failed to create group');
      }
    } catch (err) {
      console.error('Error creating group:', err);
      alert('Failed to create group');
    } finally {
      setCreatingGroup(false);
    }
  };

  // Join group
  const joinGroup = async (groupId) => {
    try {
      const result = await groupsApi.joinGroup(groupId);
      if (result.success) {
        await fetchGroups();
        navigate(`/study-group/${groupId}`);
      } else {
        alert(result.message || 'Failed to join group');
      }
    } catch (err) {
      console.error('Error joining group:', err);
      alert('Failed to join group');
    }
  };

  // Filter conversations based on search and tab
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const matchesSearch = conv.other_preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (conv.last_message && conv.last_message.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (activeTab === 'groups') {
        return false; // Handled separately in groups section
      }
      
      if (activeTab === 'unread') {
        return matchesSearch && conv.unread_count > 0;
      }
      
      return matchesSearch;
    });
  }, [conversations, searchQuery, activeTab]);

  // Start conversation (1:1 or group)
  const startConversation = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      const data = await apiCall('/api/messages/start', {
        method: 'POST',
        body: JSON.stringify({ participants: selectedUsers }),
      });

      if (data.conversation_id) {
        setShowNewChatModal(false);
        setSelectedUsers([]);
        navigate(`/messages/${data.conversation_id}`);
      } else {
        alert(data.error || 'Failed to start conversation');
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
      alert('Failed to start conversation');
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    // Parse ISO string to Date object
    const messageDate = new Date(timestamp);
    
    // Validate the date
    if (isNaN(messageDate.getTime())) {
      return '';
    }
    
    const now = new Date();
    
    // Calculate difference in milliseconds
    const diffMs = now.getTime() - messageDate.getTime();
    
    // Prevent negative times (future dates)
    if (diffMs < 0) {
      return 'Just now';
    }
    
    // Convert to minutes, hours, days
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Return appropriate time format
    if (diffMins < 1) {
      return 'Just now';
    }
    if (diffMins < 60) {
      return `${diffMins}m`;
    }
    if (diffHours < 24) {
      return `${diffHours}h`;
    }
    if (diffDays < 7) {
      return `${diffDays}d`;
    }
    
    // For older messages, show date
    return messageDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error, timestamp);
    return '';
  }
};

const getFullTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error getting full timestamp:', error);
    return '';
  }
};

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                <MessageSquarePlus className="w-6 h-6" />
              </div>
              Messages & Study Groups
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewChatModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <MessageSquarePlus className="w-5 h-5" />
                New Chat
              </button>
              <button
                onClick={() => setShowCreateGroupModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create Group
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations or groups..."
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {['all', 'unread', 'groups'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {tab === 'all' && <MessageSquarePlus className="w-4 h-4" />}
                {tab === 'unread' && <Clock className="w-4 h-4" />}
                {tab === 'groups' && <BookOpen className="w-4 h-4" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* CONVERSATIONS TAB */}
          {activeTab !== 'groups' && (
            <>
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <MessageSquarePlus className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </p>
                  <p className="text-sm mt-2">Start a new chat to get connected!</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredConversations.map(conv => {
                    const isGroup = conv.participants && conv.participants.length > 2;
                    const unreadCount = conv.unread_count || 0;
                    
                    return (
                      <Link
                        key={conv.conversation_id}
                        to={`/messages/${conv.conversation_id}`}
                        className="group bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 rounded-xl p-4 transition-all hover:shadow-lg hover:scale-[1.01]"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                              isGroup 
                                ? 'from-purple-500 to-pink-600' 
                                : 'from-blue-500 to-cyan-600'
                            } flex items-center justify-center text-white font-semibold text-lg shadow-lg`}>
                              {isGroup ? (
                                <Users className="w-6 h-6" />
                              ) : (
                                conv.other_preview.charAt(0).toUpperCase()
                              )}
                            </div>
                            {conv.is_pinned && (
                              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                                <Pin className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-white truncate flex items-center gap-2">
                                {conv.other_preview}
                                {isGroup && (
                                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                                    Group
                                  </span>
                                )}
                              </h3>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {unreadCount > 0 && (
                                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                                    {unreadCount}
                                  </span>
                                )}
                               <span 
                                  className="text-xs text-slate-400"
                                  title={getFullTimestamp(conv.last_updated)}
                                >
                                  {formatTimestamp(conv.last_updated)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {conv.last_message_read && (
                                <CheckCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              )}
                              <p className="text-sm text-slate-400 truncate">
                                {conv.last_message || 'No messages yet'}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-700/50 rounded-lg">
                            <MoreVertical className="w-5 h-5 text-slate-400" />
                          </button>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* GROUPS TAB */}
          {activeTab === 'groups' && (
            <>
              {groupsLoading ? (
                <div className="text-center py-12 text-slate-400">
                  <p>Loading groups...</p>
                </div>
              ) : groupsError ? (
                <div className="text-center py-12 text-red-400">
                  <p>{groupsError}</p>
                  <button
                    onClick={fetchGroups}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {/* My Groups Section */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <BookOpen className="w-6 h-6" />
                      My Groups
                    </h2>
                    {myGroups.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">
                        You haven't joined or created any groups yet.
                      </p>
                    ) : (
                      <div className="grid gap-3">
                        {myGroups.map(group => (
                          <div
                            key={group._id}
                            onClick={() => navigate(`/study-group/${group._id}`)}
                            className="group bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 rounded-xl p-4 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                <BookOpen className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white truncate mb-1">{group.name}</h3>
                                <p className="text-sm text-slate-400 truncate mb-2">
                                  {group.description || 'No description'}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                  <span className="flex items-center gap-1">
                                    {group.isPrivate ? (
                                      <>
                                        <Lock className="w-3 h-3" />
                                        Private
                                      </>
                                    ) : (
                                      <>
                                        <Globe className="w-3 h-3" />
                                        Public
                                      </>
                                    )}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {group.memberCount || group.members?.length || 0} members
                                  </span>
                                </div>
                              </div>
                              <MessageCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Suggested Groups Section */}
                  {suggestedGroups.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Globe className="w-6 h-6" />
                        Suggested Groups
                      </h2>
                      <div className="grid gap-3">
                        {suggestedGroups.map(group => (
                          <div
                            key={group._id}
                            className="bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 rounded-xl p-4 transition-all hover:shadow-lg"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                <Globe className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white truncate mb-1">{group.name}</h3>
                                <p className="text-sm text-slate-400 truncate mb-2">
                                  {group.description || 'No description'}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                  <span className="flex items-center gap-1">
                                    {group.isPrivate ? (
                                      <>
                                        <Lock className="w-3 h-3" />
                                        Private
                                      </>
                                    ) : (
                                      <>
                                        <Globe className="w-3 h-3" />
                                        Public
                                      </>
                                    )}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {group.memberCount || 0} members
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => joinGroup(group._id)}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all flex-shrink-0"
                              >
                                Join
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Start New Conversation</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Select one person for DM or multiple for group chat
                </p>
              </div>
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setSelectedUsers([]);
                }}
                className="p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="space-y-2">
                {users.map(user => {
                  const isSelected = selectedUsers.includes(user.user_id);
                  return (
                    <button
                      key={user.user_id}
                      onClick={() => toggleUserSelection(user.user_id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-blue-500/20 border-2 border-blue-500'
                          : 'bg-slate-700/30 border-2 border-transparent hover:bg-slate-700/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold ${
                        isSelected ? 'ring-2 ring-blue-400' : ''
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-sm text-slate-400">{user.role} • {user.email}</div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setSelectedUsers([]);
                }}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={startConversation}
                disabled={selectedUsers.length === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-medium transition-all disabled:cursor-not-allowed"
              >
                Start Chat ({selectedUsers.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Create Study Group</h2>
              <button
                onClick={() => {
                  setShowCreateGroupModal(false);
                  setNewGroupForm({ name: '', description: '', isPrivate: false });
                }}
                className="p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={newGroupForm.name}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, name: e.target.value })}
                  placeholder="e.g., Data Structures Study"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newGroupForm.description}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, description: e.target.value })}
                  placeholder="What's this group about?"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                />
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-lg">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newGroupForm.isPrivate}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, isPrivate: e.target.checked })}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="isPrivate" className="flex-1 cursor-pointer">
                  <div className="font-medium text-white">Private Group</div>
                  <div className="text-xs text-slate-400">Only you can invite members</div>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => {
                  setShowCreateGroupModal(false);
                  setNewGroupForm({ name: '', description: '', isPrivate: false });
                }}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                disabled={creatingGroup || !newGroupForm.name.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-medium transition-all disabled:cursor-not-allowed"
              >
                {creatingGroup ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;