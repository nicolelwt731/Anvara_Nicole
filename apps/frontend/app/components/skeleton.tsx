'use client';

import type React from 'react';

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-[--color-border] bg-white p-6">
      <div className="mb-4 h-4 w-3/4 rounded bg-gray-200" />
      <div className="mb-2 h-3 w-full rounded bg-gray-200" />
      <div className="mb-2 h-3 w-5/6 rounded bg-gray-200" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 flex-1 rounded bg-gray-200" />
        <div className="h-8 flex-1 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-gray-200"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
