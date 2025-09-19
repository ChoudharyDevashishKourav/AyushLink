// src/components/SearchBox.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useSearch } from '../hooks/api/useSearch';
import type { SearchBoxProps, ValueSetContains } from '../types/fhir';

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSelect,
  placeholder = "Search medical terms...",
  debounceMs = 300,
  maxResults = 10,
  autoFocus = false
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const debouncedQuery = useDebounce(query, debounceMs);
  
  const { data, isLoading, error } = useSearch(debouncedQuery, {
    count: maxResults,
    enabled: debouncedQuery.length >= 2
  });

  const results = data?.expansion?.contains || [];

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (item: ValueSetContains) => {
    onSelect(item);
    setQuery(item.display);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const getSystemBadge = (system: string) => {
    if (system.includes('namaste')) {
      return (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
          NAMASTE
        </span>
      );
    }
    if (system.includes('who.int/icd')) {
      return (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
          ICD-11
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full font-medium">
        Other
      </span>
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(query.length >= 2)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {error && (
            <div className="p-4 text-red-600 text-sm border-b border-red-100 bg-red-50">
              <p className="font-medium">Search failed</p>
              <p className="mt-1">Please check your connection and try again</p>
            </div>
          )}

          {!isLoading && results.length === 0 && debouncedQuery.length >= 2 && !error && (
            <div className="p-6 text-center text-gray-500">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="font-medium">No results found</p>
              <p className="text-sm mt-1">Try different search terms or check spelling</p>
            </div>
          )}

          {results.length > 0 && (
            <ul ref={listRef} role="listbox" aria-label="Search results" className="py-1">
              {results.map((item, index) => (
                <li
                  key={`${item.system}-${item.code}`}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    index === selectedIndex 
                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                  onMouseDown ={() => handleSelect(item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {item.display}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.code} • {item.system.split('/').pop()}
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      {getSystemBadge(item.system)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};