import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

async function getAdSlots(publisherId: string) {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');

    const res = await fetch(`${API_URL}/api/ad-slots?publisherId=${publisherId}`, {
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
      throw new Error('Failed to fetch ad slots');
    }
    return await res.json();
  } catch {
    return [];
  }
}

export default async function PublisherDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'publisher') {
    redirect('/');
  }

  const adSlots = roleData.publisherId ? await getAdSlots(roleData.publisherId) : [];

  const totalRevenue = adSlots.reduce(
    (sum: number, s: { basePrice?: number }) => sum + Number(s.basePrice || 0),
    0
  );
  const availableSlots = adSlots.filter((s: { isAvailable?: boolean }) => s.isAvailable).length;
  const bookedSlots = adSlots.filter((s: { isAvailable?: boolean }) => !s.isAvailable).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Ad Slots</h1>
          <p className="mt-1 text-sm text-[--color-muted]">
            Manage your inventory and track performance.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[--color-muted]">Total Ad Slots</span>
            <svg
              className="h-5 w-5 text-[--color-muted]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"
              />
            </svg>
          </div>
          <div className="mt-2 text-3xl font-bold text-white">{adSlots.length}</div>
        </div>
        <div className="rounded-lg border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[--color-muted]">Available</span>
            <svg
              className="h-5 w-5 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="mt-2 text-3xl font-bold text-green-400">{availableSlots}</div>
        </div>
        <div className="rounded-lg border border-[--color-border] bg-[--color-card] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[--color-muted]">Potential Revenue</span>
            <svg
              className="h-5 w-5 text-[--color-primary]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="mt-2 text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
          <div className="mt-1 text-xs text-[--color-muted]">{bookedSlots} booked</div>
        </div>
      </div>

      <AdSlotList adSlots={adSlots} />
    </div>
  );
}
