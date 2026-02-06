'use client';

import { useState } from 'react';
import { AdSlotCard } from './ad-slot-card';
import { AdSlotForm } from './ad-slot-form';

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
  width?: number;
  height?: number;
}

interface AdSlotListProps {
  adSlots: AdSlot[];
}

export function AdSlotList({ adSlots }: AdSlotListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-[--color-primary] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[--color-primary-hover] hover:scale-105 hover:shadow-lg"
        >
          + Create New Slot
        </button>
      </div>

      {adSlots.length === 0 ? (
        <div className="animate-fade-in rounded-xl border-2 border-dashed border-[--color-border] bg-[--color-card] p-12 text-center">
          <div className="mb-4 text-6xl">📰</div>
          <h3 className="mb-2 text-xl font-semibold text-white">No ad slots yet</h3>
          <p className="mb-6 text-[--color-muted]">
            Create your first ad slot to start monetizing your audience
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="rounded-lg bg-[--color-primary] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[--color-primary-hover] hover:scale-105"
          >
            Create Your First Ad Slot
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adSlots.map((slot, index) => (
            <div
              key={slot.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <AdSlotCard adSlot={slot} />
            </div>
          ))}
        </div>
      )}

      {showCreateForm && <AdSlotForm onClose={() => setShowCreateForm(false)} />}
    </>
  );
}
