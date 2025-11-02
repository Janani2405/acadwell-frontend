// frontend/src/components/ui/messages/AnonymousDiscovery.jsx
import React, { useEffect, useState } from 'react';
import { anonymousApi } from '../../../api/api';
import { 
  Users, MessageCircle, Star, Filter, Search, UserPlus, 
  Shield, AlertCircle, CheckCircle, Clock, HelpCircle 
} from 'lucide-react';

const AnonymousDiscovery = ({ onStartChat }) => {
  const [peers, setPeers] = useState([]);
  const [filteredPeers, setFilteredPeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    subject: '',
    status: 'available'
  });
  const [myProfile, setMyProfile] = useState(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Profile setup form
  const [profileForm, setProfileForm] = useState({
    tags: [],
    role: 'both',
    bio: '',
    status: 'available'
  });

  const [tagInput, setTagInput] = useState('');

  // Available subjects/tags
  const availableTags = [
    'Physics', 'Chemistry', 'Biology', 'Mathematics',
    'Computer Science', 'English', 'History', 'Economics',
    'Mental Health', 'Exam Prep', 'Study Tips', 'Career Advice'
  ];

  useEffect(() => {
    fetchMyProfile();
    fetchPeers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [peers, searchQuery, filters]);

  const fetchMyProfile = async () => {
    try {
      const result = await anonymousApi.getMyProfile();
      if (result.success) {
        setMyProfile(result.profile);
        setProfileForm({
          tags: result.profile.tags || [],
          role: result.profile.role || 'both',
          bio: result.profile.bio || '',
          status: result.profile.status || 'available'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPeers = async () => {
    setLoading(true);
    try {
      const result = await anonymousApi.discoverPeers(filters);
      if (result.success) {
        setPeers(result.users || []);
      }
    } catch (error) {
      console.error('Error fetching peers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...peers];

    if (searchQuery) {
      filtered = filtered.filter(peer =>
        peer.anonId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        peer.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        peer.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.role !== 'all') {
      filtered = filtered.filter(peer => 
        peer.role === filters.role || peer.role === 'both'
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(peer => peer.status === filters.status);
    }

    if (filters.subject) {
      filtered = filtered.filter(peer =>
        peer.tags.some(tag => tag.toLowerCase().includes(filters.subject.toLowerCase()))
      );
    }

    setFilteredPeers(filtered);
  };

  const startChat = async (anonId) => {
    try {
      const result = await anonymousApi.startAnonymousChat(anonId);
      if (result.success && result.conversation_id) {
        if (onStartChat) {
          onStartChat(result.conversation_id);
        }
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  const updateProfile = async () => {
    try {
      const result = await anonymousApi.initProfile(profileForm);
      if (result.success) {
        setMyProfile(result.profile);
        setShowProfileSetup(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !profileForm.tags.includes(tagInput.trim())) {
      setProfileForm({
        ...profileForm,
        tags: [...profileForm.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setProfileForm({
      ...profileForm,
      tags: profileForm.tags.filter(t => t !== tag)
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'helper': return <HelpCircle className="w-4 h-4" />;
      case 'seeker': return <UserPlus className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  if (showProfileSetup) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Setup Anonymous Profile
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">I'm here to:</label>
            <div className="grid grid-cols-3 gap-3">
              {['helper', 'seeker', 'both'].map(role => (
                <button
                  key={role}
                  onClick={() => setProfileForm({ ...profileForm, role })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    profileForm.role === role
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600/50 bg-slate-700/30 hover:border-slate-500'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {getRoleIcon(role)}
                    <span className="text-sm font-medium text-white capitalize">
                      {role === 'both' ? 'Help & Learn' : role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Interests/Subjects (Add up to 5)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Type a tag..."
                className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={profileForm.tags.length >= 5}
              />
              <button
                onClick={addTag}
                disabled={profileForm.tags.length >= 5}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {profileForm.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-2">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-white">×</button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.filter(t => !profileForm.tags.includes(t)).map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    if (profileForm.tags.length < 5) {
                      setProfileForm({ ...profileForm, tags: [...profileForm.tags, tag] });
                    }
                  }}
                  disabled={profileForm.tags.length >= 5}
                  className="px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 rounded-full text-xs text-slate-300 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Short Bio (Optional)
            </label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="Tell others what you're looking for..."
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
              maxLength={200}
            />
            <p className="text-xs text-slate-400 mt-1">{profileForm.bio.length}/200</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">Availability Status</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'available', label: 'Available', color: 'green' },
                { value: 'busy', label: 'Busy', color: 'yellow' },
                { value: 'invisible', label: 'Invisible', color: 'gray' }
              ].map(status => (
                <button
                  key={status.value}
                  onClick={() => setProfileForm({ ...profileForm, status: status.value })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    profileForm.status === status.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600/50 bg-slate-700/30 hover:border-slate-500'
                  }`}
                >
                  <span className="text-sm font-medium text-white">{status.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowProfileSetup(false)}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={updateProfile}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Anonymous Peer Discovery
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Connect anonymously with peers for help or support
            </p>
          </div>
          <button
            onClick={() => setShowProfileSetup(true)}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white flex items-center gap-2 transition-colors"
          >
            <Shield className="w-4 h-4" />
            My Profile
          </button>
        </div>

        {myProfile && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {myProfile.anonId?.slice(0, 2) || 'AN'}
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    {myProfile.anonId}
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(myProfile.status)}`}></span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    {getRoleIcon(myProfile.role)}
                    <span className="capitalize">{myProfile.role}</span>
                    {myProfile.rating > 0 && (
                      <>
                        <span>•</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{myProfile.rating.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowProfileSetup(true)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Edit
              </button>
            </div>
            {myProfile.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {myProfile.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tags or interests..."
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="helper">Helpers</option>
            <option value="seeker">Seekers</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
          </select>

          <button
            onClick={fetchPeers}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center gap-2 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">
          <Clock className="w-12 h-12 mx-auto mb-4 animate-spin" />
          <p>Finding peers...</p>
        </div>
      ) : filteredPeers.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No peers found</p>
          <p className="text-sm mt-2">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredPeers.map(peer => (
            <div
              key={peer.anonId}
              className="bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 rounded-xl p-4 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {peer.anonId?.slice(0, 2) || 'AN'}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(peer.status)} border-2 border-slate-900 rounded-full`}></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {peer.anonId}
                      {peer.rating > 0 && (
                        <span className="flex items-center gap-1 text-sm text-yellow-400">
                          <Star className="w-4 h-4 fill-yellow-400" />
                          {peer.rating.toFixed(1)}
                          <span className="text-xs text-slate-400">({peer.reviewCount})</span>
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mb-2 text-sm text-slate-400">
                    {getRoleIcon(peer.role)}
                    <span className="capitalize">{peer.role}</span>
                    <span>•</span>
                    <span className="capitalize">{peer.status}</span>
                  </div>

                  {peer.bio && (
                    <p className="text-sm text-slate-300 mb-3 line-clamp-2">{peer.bio}</p>
                  )}

                  {peer.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {peer.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => startChat(peer.anonId)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Start Anonymous Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnonymousDiscovery;