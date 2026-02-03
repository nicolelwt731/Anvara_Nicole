'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

interface FormState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('better-auth.session_token');
  
  return {
    'Content-Type': 'application/json',
    ...(sessionToken && { Cookie: `better-auth.session_token=${sessionToken.value}` }),
  };
}

export async function createAdSlot(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const basePrice = formData.get('basePrice') as string;
    const width = formData.get('width') as string;
    const height = formData.get('height') as string;

    const fieldErrors: Record<string, string> = {};

    if (!name || name.trim().length === 0) {
      fieldErrors.name = 'Ad slot name is required';
    }
    if (!type) {
      fieldErrors.type = 'Ad slot type is required';
    }
    if (!basePrice || Number(basePrice) <= 0) {
      fieldErrors.basePrice = 'Base price must be greater than 0';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors };
    }

    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/api/ad-slots`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || undefined,
        type,
        basePrice: Number(basePrice),
        width: width ? Number(width) : undefined,
        height: height ? Number(height) : undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to create ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateAdSlot(
  adSlotId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const basePrice = formData.get('basePrice') as string;
    const width = formData.get('width') as string;
    const height = formData.get('height') as string;
    const isAvailable = formData.get('isAvailable') === 'true';

    const fieldErrors: Record<string, string> = {};

    if (!name || name.trim().length === 0) {
      fieldErrors.name = 'Ad slot name is required';
    }
    if (!type) {
      fieldErrors.type = 'Ad slot type is required';
    }
    if (!basePrice || Number(basePrice) <= 0) {
      fieldErrors.basePrice = 'Base price must be greater than 0';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors };
    }

    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/api/ad-slots/${adSlotId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || undefined,
        type,
        basePrice: Number(basePrice),
        width: width ? Number(width) : undefined,
        height: height ? Number(height) : undefined,
        isAvailable,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to update ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred' };
  }
}

export async function deleteAdSlot(adSlotId: string): Promise<FormState> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/api/ad-slots/${adSlotId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to delete ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred' };
  }
}
