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
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Create Ad Slot
        </button>
      </div>

      {adSlots.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[--color-border] p-8 text-center text-[--color-muted]">
          No ad slots yet. Create your first ad slot to start earning.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adSlots.map((slot) => (
            <AdSlotCard key={slot.id} adSlot={slot} />
          ))}
        </div>
      )}

      {showCreateForm && (
        <AdSlotForm onClose={() => setShowCreateForm(false)} />
      )}
    </>
  );
}
