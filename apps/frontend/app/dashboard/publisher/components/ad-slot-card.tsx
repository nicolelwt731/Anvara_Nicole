'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAdSlot } from '../actions';
import { AdSlotForm } from './ad-slot-form';
import { trackManagementEvent, trackButtonClick } from '@/lib/analytics';
import { getImageByCategory } from '@/lib/utils';

interface AdSlotCardProps {
  adSlot: {
    id: string;
    name: string;
    description?: string;
    type: string;
    basePrice: number;
    isAvailable: boolean;
    width?: number;
    height?: number;
  };
}

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
  NATIVE: 'bg-green-100 text-green-700',
};

export function AdSlotCard({ adSlot }: AdSlotCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${adSlot.name}"?`)) {
      return;
    }

    // Track button click
    trackButtonClick('Delete Ad Slot', 'ad_slot_card', {
      ad_slot_id: adSlot.id,
      ad_slot_name: adSlot.name,
      ad_slot_type: adSlot.type,
    });

    startTransition(async () => {
      const result = await deleteAdSlot(adSlot.id);
      if (result.error) {
        setError(result.error);
      } else {
        // Track successful deletion
        trackManagementEvent('delete', 'ad_slot', adSlot.id, {
          ad_slot_name: adSlot.name,
          ad_slot_type: adSlot.type,
        });
        router.replace('/dashboard/publisher');
      }
    });
  };

  return (
    <>
      <div className="group rounded-lg border border-[--color-border] bg-[--color-card] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[--color-primary]/30 hover:shadow-lg">
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md bg-gray-800">
          <img
            src={getImageByCategory(adSlot.type, adSlot.name)}
            alt={adSlot.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute right-2 top-2">
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${typeColors[adSlot.type] || 'bg-gray-100'}`}
            >
              {adSlot.type}
            </span>
          </div>
        </div>

        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold text-white">{adSlot.name}</h3>
        </div>

        {adSlot.description && (
          <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{adSlot.description}</p>
        )}

        {(adSlot.width || adSlot.height) && (
          <div className="mb-2 text-xs text-[--color-muted]">
            Dimensions: {adSlot.width || '?'} × {adSlot.height || '?'} px
          </div>
        )}

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                adSlot.isAvailable ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span
              className={`text-sm ${
                adSlot.isAvailable ? 'text-green-400' : 'text-[--color-muted]'
              }`}
            >
              {adSlot.isAvailable ? 'Available' : 'Booked'}
            </span>
          </div>
          <span className="font-semibold text-[--color-primary]">
            ${Number(adSlot.basePrice).toLocaleString()}/mo
          </span>
        </div>

        {error && (
          <div className="mb-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              trackButtonClick('Edit Ad Slot', 'ad_slot_card', {
                ad_slot_id: adSlot.id,
              });
              setShowEditForm(true);
            }}
            className="flex-1 rounded-lg border border-[--color-border] bg-transparent px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[--color-card-hover] hover:scale-105 active:scale-95"
          >
            Edit Details
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {showEditForm && <AdSlotForm adSlot={adSlot} onClose={() => setShowEditForm(false)} />}
    </>
  );
}
