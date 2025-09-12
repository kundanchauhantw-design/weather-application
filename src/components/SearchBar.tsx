'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading?: boolean;
  placeholder?: string;
}

const SearchBar = ({ onSearch, loading = false, placeholder = "Search for a city..." }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && !loading) {
      onSearch(searchTerm.trim());
      setSearchTerm('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="w-full px-4 py-3 pl-12 pr-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
          🔍
        </div>
        <button
          type="submit"
          disabled={!searchTerm.trim() || loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-md transition-colors"
        >
          {loading ? '⏳' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
