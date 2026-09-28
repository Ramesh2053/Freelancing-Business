/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@insforge/sdk';

const env = (import.meta as any).env || {};
const baseUrl = env.VITE_INSFORGE_URL || 'https://jif755gs.us-east.insforge.app';
const anonKey = env.VITE_INSFORGE_ANON_KEY || 'anon_bb0a61d83b65244d5c68daf58fe916c91257d51098330f1935a6da41c97526ab';

export const insforge = createClient({
  baseUrl,
  anonKey,
});

export const UPLOADS_BUCKET = 'freelancefactory-uploads';

/**
 * Executes a PromiseLike operation safely in the background
 */
export function safeDb(operation: PromiseLike<any>): void {
  operation.then(
    (res: any) => {
      if (res && res.error) {
        console.warn('InsForge database background error:', res.error);
      }
    },
    (err: any) => {
      console.warn('InsForge database background error:', err);
    }
  );
}

/**
 * Upload a file to InsForge storage and return its public URL and storage key
 */
export async function uploadToStorage(file: File, folder: string = 'general'): Promise<{ url: string; key: string } | null> {
  try {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${folder}/${timestamp}_${sanitizedName}`;

    const { data, error } = await insforge.storage
      .from(UPLOADS_BUCKET)
      .upload(path, file);

    if (error || !data) {
      console.warn('Storage upload error, falling back:', error);
      return null;
    }

    return {
      url: data.url,
      key: data.key,
    };
  } catch (err) {
    console.error('Storage upload exception:', err);
    return null;
  }
}
