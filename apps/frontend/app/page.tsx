'use client';

import Link from 'next/link';
import { trackButtonClick } from '@/lib/analytics';

export default function Home() {
  return (
    <>
      <section className="relative min-h-[70vh] overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[--color-background]" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full border border-[--color-primary]/50 bg-[--color-card] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[--color-primary]">
            The OS for Sponsorships
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            Connect Brands with
            <span className="block text-[--color-primary]"> Premium Publishers</span>
          </h1>
          <p className="mb-10 text-lg text-[--color-muted] md:text-xl">
            The leading marketplace where sponsors discover high-impact ad slots and publishers
            monetize their audience with transparency.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/marketplace"
              onClick={() => {
                trackButtonClick('Browse Marketplace', 'home_page');
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[--color-primary] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[--color-primary-hover] hover:scale-105 hover:shadow-xl"
            >
              Browse Marketplace
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/login"
              onClick={() => {
                trackButtonClick('Manage Ad Slots', 'home_page');
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-[--color-border] bg-[--color-card] px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-[--color-card-hover]"
            >
              Manage Ad Slots
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
