// frontend/src/components/dashboards/admin/pages/UsersManagement.jsx
/**
 * Users Management Page
 * View, search, filter, and manage all users
 */

import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, UserX, UserCheck } from 'lucide-react';
import { useAdmin } from '../../../../hooks/useAdmin';
import UserTable from '../components/UserTable';

const UsersManagement = () => {
  const { fetchUsers, deleteUser, toggleUserStatus, loading, error } = useAdmin();
  
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  
  const [filters, setFilters] = useState({
    role: '',
    search: ''
  });
  
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    loadUsers();
  }, [pagination.page, filters.role]);

  const loadUsers = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (filters.role) params.role = filters.role;
      if (filters.search) params.search = filters.search;
      
      const data = await fetchUsers(params);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRoleFilter = (role) => {
    setFilters(prev => ({ ...prev, role }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user: ${userName}?`)) {
      return;
    }
    
    try {
      await deleteUser(userId);
      alert('User deleted successfully!');
      loadUsers();
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  const handleToggleStatus = async (userId, currentStatus, userName) => {
    const action = currentStatus ? 'suspend' : 'activate';
    if (!confirm(`Are you sure you want to ${action} user: ${userName}?`)) {
      return;
    }
    
    try {
      await toggleUserStatus(userId, !currentStatus);
      alert(`User ${action}d successfully!`);
      loadUsers();
    } catch (err) {
      alert(`Failed to ${action} user: ` + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-gray-400 text-sm mt-1">
            Total: {pagination.total} users
          </p>
        </div>
        
        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Users
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Name, email, or reg number..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ role: '', search: '' });
                setSearchInput('');
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
        {loading && !users.length ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading users...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          <UserTable
            users={users}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} users
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1 || loading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(Math.min(pagination.pages, 5))].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      pagination.page === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages || loading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;