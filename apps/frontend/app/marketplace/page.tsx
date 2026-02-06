'use client';

import { useState } from 'react';
import { AdSlotGrid } from './components/ad-slot-grid';
import { NewsletterSignup } from '../components/newsletter-signup';

export default function MarketplacePage() {
  const [filter, setFilter] = useState<'all' | 'DISPLAY' | 'VIDEO' | 'In-Venue'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Marketplace</h1>
        <p className="text-[--color-muted]">
          Discover and book premium placements from vetted publishers.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[--color-primary] text-white'
                : 'bg-[--color-card] text-[--color-muted] hover:bg-[--color-card-hover] hover:text-white'
            }`}
          >
            All Placements
          </button>
          <button
            onClick={() => setFilter('DISPLAY')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'DISPLAY'
                ? 'bg-[--color-primary] text-white'
                : 'bg-[--color-card] text-[--color-muted] hover:bg-[--color-card-hover] hover:text-white'
            }`}
          >
            Digital Display
          </button>
          <button
            onClick={() => setFilter('In-Venue')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'In-Venue'
                ? 'bg-[--color-primary] text-white'
                : 'bg-[--color-card] text-[--color-muted] hover:bg-[--color-card-hover] hover:text-white'
            }`}
          >
            In-Venue
          </button>
        </div>
        <div className="relative w-full sm:w-80">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--color-muted]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search by publisher or format..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-card] py-2.5 pl-10 pr-4 text-white placeholder-[--color-muted] focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <AdSlotGrid filter={filter} searchQuery={searchQuery} />
        </div>
        <div className="space-y-4">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
}
