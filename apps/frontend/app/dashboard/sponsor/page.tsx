import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

async function getCampaigns(sponsorId: string) {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');

    const res = await fetch(`${API_URL}/api/campaigns?sponsorId=${sponsorId}`, {
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch campaigns');
    }
    return await res.json();
  } catch {
    return [];
  }
}

export default async function SponsorDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'sponsor') {
    redirect('/');
  }

  const campaigns = roleData.sponsorId ? await getCampaigns(roleData.sponsorId) : [];

  const totalBudget = campaigns.reduce(
    (sum: number, c: { budget?: number }) => sum + Number(c.budget || 0),
    0
  );
  const totalSpent = campaigns.reduce(
    (sum: number, c: { spent?: number }) => sum + Number(c.spent || 0),
    0
  );
  const activeCampaigns = campaigns.filter(
    (c: { status?: string }) => c.status === 'ACTIVE'
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Campaigns</h1>
          <p className="mt-1 text-sm text-[--color-muted]">
            Manage your advertising campaigns and track performance
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
          <div className="text-sm text-[--color-muted]">Total Campaigns</div>
          <div className="mt-2 text-3xl font-bold text-white">{campaigns.length}</div>
        </div>
        <div className="rounded-lg border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
          <div className="text-sm text-[--color-muted]">Active Campaigns</div>
          <div className="mt-2 text-3xl font-bold text-green-400">{activeCampaigns}</div>
        </div>
        <div className="rounded-lg border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
          <div className="text-sm text-[--color-muted]">Total Budget</div>
          <div className="mt-2 text-3xl font-bold text-white">${totalBudget.toLocaleString()}</div>
          <div className="mt-1 text-xs text-[--color-muted]">
            Spent: ${totalSpent.toLocaleString()}
          </div>
        </div>
      </div>

      <CampaignList campaigns={campaigns} />
    </div>
  );
}
