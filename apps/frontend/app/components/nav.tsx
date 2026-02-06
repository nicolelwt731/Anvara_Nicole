'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { authClient } from '@/auth-client';
import { trackUserEngagement } from '@/lib/analytics';

type UserRole = 'sponsor' | 'publisher' | null;

export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [role, setRole] = useState<UserRole>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (user?.id) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';
      fetch(`${apiUrl}/api/auth/role/${user.id}`)
        .then((res) => res.json())
        .then((data) => setRole(data.role))
        .catch(() => setRole(null));
    } else {
      const timer = setTimeout(() => {
        setRole(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user?.id]);

  const isActive = (path: string) => pathname === path;

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = (
    <>
      <Link
        href="/marketplace"
        onClick={handleLinkClick}
        className={`transition-colors ${
          isActive('/marketplace')
            ? 'text-[--color-primary] font-semibold'
            : 'text-[--color-muted] hover:text-[--color-foreground]'
        }`}
      >
        Marketplace
      </Link>

      {user && role === 'sponsor' && (
        <Link
          href="/dashboard/sponsor"
          onClick={handleLinkClick}
          className={`transition-colors ${
            isActive('/dashboard/sponsor')
              ? 'text-[--color-primary] font-semibold'
              : 'text-[--color-muted] hover:text-[--color-foreground]'
          }`}
        >
          My Campaigns
        </Link>
      )}
      {user && role === 'publisher' && (
        <Link
          href="/dashboard/publisher"
          onClick={handleLinkClick}
          className={`transition-colors ${
            isActive('/dashboard/publisher')
              ? 'text-[--color-primary] font-semibold'
              : 'text-[--color-muted] hover:text-[--color-foreground]'
          }`}
        >
          My Ad Slots
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[--color-border] bg-[--color-background] backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <Image
            src="/anvara-logo.png"
            alt="Anvara"
            width={36}
            height={36}
            className="shrink-0 rounded-lg object-contain"
          />
          <span className="text-xl font-bold text-white">Anvara</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">{navLinks}</div>

        <div className="hidden items-center gap-4 md:flex">
          {isPending ? (
            <span className="text-[--color-muted]">...</span>
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-[--color-muted]">{user.email}</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[--color-primary] text-sm font-semibold text-white">
                {(user.name || user.email || 'U').slice(0, 2).toUpperCase()}
              </div>
              <button
                onClick={async () => {
                  trackUserEngagement('logout', role || undefined, {
                    user_id: user?.id,
                  });

                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = '/';
                      },
                    },
                  });
                }}
                className="rounded-lg border border-[--color-border] p-2 text-[--color-muted] transition-colors hover:bg-[--color-card] hover:text-white"
                aria-label="Logout"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-[--color-primary] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[--color-primary-hover]"
            >
              Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all ${
              mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all ${
              mobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all ${
              mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="animate-slide-up border-t border-[--color-border] bg-[--color-background] md:hidden">
          <div className="flex flex-col gap-4 p-4">
            {navLinks}
            {user ? (
              <div className="flex flex-col gap-3 border-t border-[--color-border] pt-4">
                <div>
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-[--color-muted]">{user.email}</div>
                </div>
                <button
                  onClick={async () => {
                    trackUserEngagement('logout', role || undefined, {
                      user_id: user?.id,
                    });

                    await authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          window.location.href = '/';
                        },
                      },
                    });
                  }}
                  className="w-full rounded-lg border border-[--color-border] px-4 py-2 text-sm text-white transition-colors hover:bg-[--color-card]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full rounded-lg bg-[--color-primary] px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[--color-primary-hover]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
