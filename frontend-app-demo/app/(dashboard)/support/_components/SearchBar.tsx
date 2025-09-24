'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // TODO: 实现实际的搜索功能
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
      </div>
      <Input
        type="text"
        placeholder="搜索帮助文章..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full pl-11 pr-4 py-3"
      />
    </div>
  );
};

export default SearchBar;