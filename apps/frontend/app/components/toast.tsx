'use client';

import { useEffect, useState } from 'react';
import type React from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

export function showToast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).slice(2, 9);
  toasts = [...toasts, { id, message, type }];
  notifyListeners();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 5000);
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setTimeout(() => setCurrentToasts(newToasts), 0);
    };
    toastListeners.push(listener);
    const id = setTimeout(() => setCurrentToasts([...toasts]), 0);

    return () => {
      clearTimeout(id);
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-in-right rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm"
          style={{
            backgroundColor:
              toast.type === 'success'
                ? 'rgb(220 252 231)'
                : toast.type === 'error'
                  ? 'rgb(254 226 226)'
                  : toast.type === 'warning'
                    ? 'rgb(254 243 199)'
                    : 'rgb(219 234 254)',
            borderColor:
              toast.type === 'success'
                ? 'rgb(187 247 208)'
                : toast.type === 'error'
                  ? 'rgb(254 202 202)'
                  : toast.type === 'warning'
                    ? 'rgb(253 230 138)'
                    : 'rgb(191 219 254)',
            color:
              toast.type === 'success'
                ? 'rgb(22 101 52)'
                : toast.type === 'error'
                  ? 'rgb(153 27 27)'
                  : toast.type === 'warning'
                    ? 'rgb(146 64 14)'
                    : 'rgb(30 64 175)',
          }}
        >
          <div className="flex items-center gap-2">
            <span>
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'warning' && '⚠'}
              {toast.type === 'info' && 'ℹ'}
            </span>
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
