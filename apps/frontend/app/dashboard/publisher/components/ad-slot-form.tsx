'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createAdSlot, updateAdSlot } from '../actions';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trackFormSubmit, trackManagementEvent } from '@/lib/analytics';
import { showToast } from '@/app/components/toast';

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  width?: number;
  height?: number;
  isAvailable: boolean;
}

interface AdSlotFormProps {
  adSlot?: AdSlot;
  onClose: () => void;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[--color-primary] px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-[--color-primary-hover] hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {pending ? 'Saving...' : isEditing ? 'Update Ad Slot' : 'Create Ad Slot'}
    </button>
  );
}

export function AdSlotForm({ adSlot, onClose }: AdSlotFormProps) {
  const isEditing = Boolean(adSlot);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const action = isEditing ? updateAdSlot.bind(null, adSlot!.id) : createAdSlot;

  const [state, formAction] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      trackFormSubmit('ad_slot_form', isEditing ? 'update' : 'create', true, {
        ad_slot_id: adSlot?.id,
        ad_slot_type: adSlot?.type,
      });
      trackManagementEvent(isEditing ? 'update' : 'create', 'ad_slot', adSlot?.id);
      showToast(
        isEditing ? 'Ad slot updated successfully!' : 'Ad slot created successfully!',
        'success'
      );
      onClose();
      router.replace('/dashboard/publisher');
    } else if (state.error) {
      trackFormSubmit('ad_slot_form', isEditing ? 'update' : 'create', false, {
        ad_slot_id: adSlot?.id,
        error: state.error,
      });
      showToast(state.error || 'Failed to save ad slot', 'error');
    }
  }, [state.success, state.error, isEditing, adSlot?.id, adSlot?.type, onClose, router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-[--color-card] border border-[--color-border] p-6 shadow-xl animate-slide-up">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Ad Slot' : 'Create New Ad Slot'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[--color-muted] transition-colors hover:bg-[--color-card-hover] hover:text-white"
            type="button"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {state.error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-600">
            {state.error}
          </div>
        )}

        <form ref={formRef} action={formAction} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[--color-muted]">
              Ad Slot Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={adSlot?.name}
              className="mt-1 block w-full rounded-lg border border-[--color-border] bg-[--color-background] px-4 py-2.5 text-white placeholder-[--color-muted] shadow-sm transition-all duration-200 focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20"
              required
            />
            {state.fieldErrors?.name && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[--color-muted]">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={adSlot?.description}
              className="mt-1 block w-full rounded-lg border border-[--color-border] bg-[--color-background] px-4 py-2.5 text-white placeholder-[--color-muted] shadow-sm transition-all duration-200 focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-[--color-muted]">
              Ad Slot Type *
            </label>
            <select
              id="type"
              name="type"
              defaultValue={adSlot?.type}
              className="mt-1 block w-full rounded-lg border border-[--color-border] bg-[--color-background] px-4 py-2.5 text-white placeholder-[--color-muted] shadow-sm transition-all duration-200 focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20"
              required
            >
              <option value="">Select a type</option>
              <option value="DISPLAY">Display</option>
              <option value="VIDEO">Video</option>
              <option value="NATIVE">Native</option>
              <option value="NEWSLETTER">Newsletter</option>
              <option value="PODCAST">Podcast</option>
            </select>
            {state.fieldErrors?.type && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.type}</p>
            )}
          </div>

          <div>
            <label htmlFor="basePrice" className="block text-sm font-medium text-[--color-muted]">
              Base Price ($) *
            </label>
            <input
              type="number"
              id="basePrice"
              name="basePrice"
              min="0"
              step="0.01"
              defaultValue={adSlot?.basePrice}
              className="mt-1 block w-full rounded-lg border border-[--color-border] bg-[--color-background] px-4 py-2.5 text-white placeholder-[--color-muted] shadow-sm transition-all duration-200 focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20"
              required
            />
            {state.fieldErrors?.basePrice && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.basePrice}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-[--color-muted]">
                Width (px)
              </label>
              <input
                type="number"
                id="width"
                name="width"
                min="0"
                defaultValue={adSlot?.width}
                className="mt-1 block w-full rounded-lg border border-[--color-border] bg-[--color-background] px-4 py-2.5 text-white placeholder-[--color-muted] shadow-sm transition-all duration-200 focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20"
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-[--color-muted]">
                Height (px)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                min="0"
                defaultValue={adSlot?.height}
                className="mt-1 block w-full rounded-lg border border-[--color-border] bg-[--color-background] px-4 py-2.5 text-white placeholder-[--color-muted] shadow-sm transition-all duration-200 focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                value="true"
                defaultChecked={adSlot?.isAvailable}
                className="h-5 w-5 rounded border-gray-300 text-[--color-primary] focus:ring-[--color-primary]"
              />
              <label htmlFor="isAvailable" className="ml-2 block text-sm text-[--color-muted]">
                Available for booking
              </label>
            </div>
          )}

          <div className="flex flex-col-reverse justify-end gap-3 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-[--color-muted] transition-all duration-200 hover:bg-gray-50 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <SubmitButton isEditing={isEditing} />
          </div>
        </form>
      </div>
    </div>
  );
}
