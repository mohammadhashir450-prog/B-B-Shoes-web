'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Search, X, ChevronDown, CheckCircle } from 'lucide-react';
import { PAKISTAN_CITIES, MAJOR_CITIES } from '@/data/pakistanCities';

interface CitySearchDropdownProps {
  value: string;
  onChange: (city: string) => void;
  /** Extra class names for the wrapper div */
  className?: string;
  /** Whether to show a light (white bg) or dark (default) style */
  variant?: 'light' | 'dark';
}

export default function CitySearchDropdown({
  value,
  onChange,
  className = '',
  variant = 'light',
}: CitySearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // ── Filtered list ──────────────────────────────────────────────────────
  const trimmedQuery = query.trim().toLowerCase();

  const filteredCities = trimmedQuery
    ? PAKISTAN_CITIES.filter((c) => c.toLowerCase().includes(trimmedQuery))
    : PAKISTAN_CITIES; // show all (major cities come first by list order)

  // Cities to display: when no query, show only major cities (top 10); when querying show all matches
  const displayCities = trimmedQuery ? filteredCities : MAJOR_CITIES;

  // ── Close on outside click ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Auto-focus search when dropdown opens ──────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // ── Scroll highlighted item into view ─────────────────────────────────
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const handleSelect = useCallback(
    (city: string) => {
      onChange(city);
      setIsOpen(false);
      setQuery('');
      setHighlightedIndex(-1);
    },
    [onChange],
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < displayCities.length - 1 ? prev + 1 : 0,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : displayCities.length - 1,
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && displayCities[highlightedIndex]) {
          handleSelect(displayCities[highlightedIndex]);
        } else if (displayCities.length === 1) {
          handleSelect(displayCities[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        setHighlightedIndex(-1);
        break;
    }
  };

  // ── Styles ─────────────────────────────────────────────────────────────
  const isLight = variant === 'light';

  const triggerBase = isLight
    ? 'w-full bg-white border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#111827] focus:border-[#D4AF37] focus:outline-none transition-colors'
    : 'w-full bg-[#0F1825] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors';

  const dropdownBg = isLight ? 'bg-white border-[#E5E7EB]' : 'bg-[#1A2435] border-white/10';
  const searchBg = isLight
    ? 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] placeholder-gray-400'
    : 'bg-[#0F1825] border-white/10 text-white placeholder-gray-500';
  const hoverBg = isLight ? 'hover:bg-[#FFF8E7]' : 'hover:bg-white/5';
  const textColor = isLight ? 'text-[#111827]' : 'text-white';
  const mutedText = isLight ? 'text-[#6B7280]' : 'text-gray-400';

  return (
    <div ref={wrapperRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      {/* ── Trigger button ── */}
      <button
        type="button"
        id="city-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${triggerBase} flex items-center justify-between gap-2 cursor-pointer`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <MapPin className={`w-4 h-4 flex-shrink-0 ${value ? 'text-[#D4AF37]' : mutedText}`} />
          <span className={`truncate ${value ? textColor + ' font-medium' : mutedText}`}>
            {value || 'Select your city...'}
          </span>
        </span>
        <span className="flex items-center gap-1 flex-shrink-0">
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === 'Enter' && handleClear(e as any)}
              className={`p-1 rounded-full ${mutedText} hover:text-red-500 transition-colors`}
              aria-label="Clear city selection"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${mutedText} ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div
          className={`absolute z-[9999] left-0 right-0 mt-1.5 rounded-xl border shadow-2xl overflow-hidden ${dropdownBg}`}
          style={{ maxHeight: '320px', display: 'flex', flexDirection: 'column' }}
          role="dialog"
          aria-label="City search dropdown"
        >
          {/* Search bar */}
          <div className={`flex items-center gap-2 px-3 py-2.5 border-b ${isLight ? 'border-[#E5E7EB]' : 'border-white/10'}`}>
            <Search className={`w-4 h-4 flex-shrink-0 ${mutedText}`} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(-1);
              }}
              placeholder="Search city..."
              className={`flex-1 bg-transparent text-sm focus:outline-none ${isLight ? 'text-[#111827] placeholder-gray-400' : 'text-white placeholder-gray-500'}`}
              aria-label="Search cities"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setHighlightedIndex(-1); inputRef.current?.focus(); }}
                className={`${mutedText} hover:text-red-400 transition-colors`}
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Header label */}
          <div className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${mutedText} ${isLight ? 'bg-[#F9FAFB]' : 'bg-[#0F1825]/50'}`}>
            {trimmedQuery
              ? `${filteredCities.length} result${filteredCities.length !== 1 ? 's' : ''} found`
              : 'Major Cities — type to search all of Pakistan'}
          </div>

          {/* City list */}
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Pakistani cities"
            className="overflow-y-auto flex-1"
            style={{ maxHeight: '240px' }}
          >
            {displayCities.length === 0 ? (
              <li className={`px-4 py-5 text-sm text-center ${mutedText}`}>
                No cities found for &ldquo;{query}&rdquo;
              </li>
            ) : (
              displayCities.map((city, idx) => {
                const isSelected = city === value;
                const isHighlighted = idx === highlightedIndex;
                return (
                  <li
                    key={city}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(city)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`
                      flex items-center justify-between gap-2 px-4 py-2.5 text-sm cursor-pointer transition-colors
                      ${isSelected
                        ? isLight ? 'bg-[#FFF8E7] text-[#D4AF37] font-semibold' : 'bg-[#D4AF37]/10 text-[#D4AF37] font-semibold'
                        : isHighlighted
                          ? isLight ? 'bg-[#FFF8E7] text-[#111827]' : 'bg-white/5 text-white'
                          : `${textColor} ${hoverBg}`}
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-[#D4AF37]' : mutedText}`} />
                      {/* Highlight matching text */}
                      {trimmedQuery
                        ? highlightMatch(city, trimmedQuery)
                        : city}
                    </span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />}
                  </li>
                );
              })
            )}
          </ul>

          {/* Footer hint */}
          {!trimmedQuery && (
            <div className={`px-3 py-2 text-[11px] border-t ${isLight ? 'border-[#E5E7EB] text-[#9CA3AF] bg-[#F9FAFB]' : 'border-white/10 text-gray-500 bg-[#0F1825]/50'}`}>
              Showing top 10 cities • Type to search 150+ cities across Pakistan
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Bold-highlights the matching substring inside city name */
function highlightMatch(city: string, query: string): React.ReactNode {
  const lowerCity = city.toLowerCase();
  const idx = lowerCity.indexOf(query);
  if (idx === -1) return city;
  return (
    <>
      {city.slice(0, idx)}
      <strong className="text-[#D4AF37]">{city.slice(idx, idx + query.length)}</strong>
      {city.slice(idx + query.length)}
    </>
  );
}
