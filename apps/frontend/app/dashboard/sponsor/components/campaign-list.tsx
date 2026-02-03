'use client';

import { useState } from 'react';
import { CampaignCard } from './campaign-card';
import { CampaignForm } from './campaign-form';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  status: string;
  startDate: string;
  endDate: string;
}

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Create Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[--color-border] p-8 text-center text-[--color-muted]">
          No campaigns yet. Create your first campaign to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}

      {showCreateForm && (
        <CampaignForm onClose={() => setShowCreateForm(false)} />
      )}
    </>
  );
}
