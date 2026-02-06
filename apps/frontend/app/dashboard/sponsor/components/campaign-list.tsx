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
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-[--color-primary] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[--color-primary-hover] hover:scale-105 hover:shadow-lg"
        >
          + Create Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="animate-fade-in rounded-xl border-2 border-dashed border-[--color-border] bg-[--color-card] p-12 text-center">
          <div className="mb-4 text-6xl">📢</div>
          <h3 className="mb-2 text-xl font-semibold text-white">No campaigns yet</h3>
          <p className="mb-6 text-[--color-muted]">
            Create your first campaign to start reaching your target audience
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="rounded-lg bg-[--color-primary] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[--color-primary-hover] hover:scale-105"
          >
            Create Your First Campaign
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CampaignCard campaign={campaign} />
            </div>
          ))}
        </div>
      )}

      {showCreateForm && <CampaignForm onClose={() => setShowCreateForm(false)} />}
    </>
  );
}
