'use client';

import type React from 'react';
import { useState } from 'react';
import { subscribeNewsletter, unsubscribeNewsletter } from '@/lib/api';

type Status = 'idle' | 'loading' | 'success' | 'error';
type Mode = 'subscribe' | 'unsubscribe';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<Mode>('subscribe');

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const action = mode === 'subscribe' ? subscribeNewsletter : unsubscribeNewsletter;
      const result = await action(email);
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    }
  };

  const disabled = status === 'loading';
  const isSubscribe = mode === 'subscribe';

  return (
    <section className="rounded-lg border border-[--color-border] bg-[--color-card] p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-8">
      <div className="md:w-1/2">
        <h2 className="mb-2 text-xl font-semibold text-white">Stay in the loop</h2>
        <p className="mb-4 text-sm text-[--color-muted] md:mb-0">
          Get marketplace updates, new placement opportunities, and best practices in your inbox.
        </p>
      </div>
      <div className="md:w-1/2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="w-full">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== 'idle') {
                  setStatus('idle');
                  setMessage('');
                }
              }}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-4 py-2.5 text-white placeholder-[--color-muted] shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20"
              disabled={disabled}
              required
            />
            {message && (
              <p
                className={`mt-1 text-xs ${
                  status === 'success' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={disabled}
            className="shrink-0 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-gray-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading'
              ? isSubscribe
                ? '...'
                : '...'
              : isSubscribe
                ? 'Subscribe'
                : 'Unsubscribe'}
          </button>
        </form>
        <div className="mt-2 text-right">
          <button
            type="button"
            className="text-xs text-[--color-muted] underline hover:text-white"
            onClick={() => {
              setMode(isSubscribe ? 'unsubscribe' : 'subscribe');
              setStatus('idle');
              setMessage('');
            }}
          >
            {isSubscribe ? 'Prefer not to receive emails? Unsubscribe' : 'Back to subscribe'}
          </button>
        </div>
      </div>
    </section>
  );
}
