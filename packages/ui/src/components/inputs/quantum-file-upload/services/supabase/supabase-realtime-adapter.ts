import { RealtimeAdapter } from '../../../../../types/quantum-file-upload';

/**
 * Supabase Realtime Adapter for Quantum File Upload
 * 
 * Integrates with Supabase channels to provide real-time upload progress updates.
 * Requires SupabaseChannelManager from your project.
 * 
 * @example
 * ```ts
 * import SupabaseChannelManager from 'src/_lib/services/supabase-channel.service';
 * import { supabase } from 'src/config-global';
 * 
 * const channelManager = SupabaseChannelManager.getInstance(supabase);
 * const realtimeAdapter = new SupabaseRealtimeAdapter(channelManager);
 * ```
 */
export class SupabaseRealtimeAdapter implements RealtimeAdapter {
  private channelManager: any; // SupabaseChannelManager type
  private handlers: {
    onProgress: (fileId: string, progress: number) => void;
    onComplete: (fileId: string) => void;
    onError: (fileId: string, error: string) => void;
  } | null = null;

  constructor(channelManager: any) {
    this.channelManager = channelManager;
  }

  subscribe(handlers: {
    onProgress: (fileId: string, progress: number) => void;
    onComplete: (fileId: string) => void;
    onError: (fileId: string, error: string) => void;
  }): () => void {
    this.handlers = handlers;

    // Initialize channels with handlers
    this.channelManager.initializeChannels(
      // Completed handler
      async (payload: any) => {
        const fileId = payload.new.storage_object_id;
        if (this.handlers) {
          this.handlers.onComplete(fileId);
        }
      },
      // Progress handler
      async (payload: any) => {
        const fileId = payload.new.storage_object_id;
        const progressPercentage = payload.new.progress_percentage;
        // Convert 0-100 backend progress to 50-100 frontend progress
        // (0-50% is upload, 50-100% is processing)
        const progress = progressPercentage / 2 + 50;
        if (this.handlers) {
          this.handlers.onProgress(fileId, progress);
        }
      },
      // Failed handler
      async (payload: any) => {
        const fileId = payload.new.storage_object_id;
        if (this.handlers) {
          this.handlers.onError(fileId, 'Processing failed');
        }
      },
      60000, // Auto-stop delay
      false  // Debug mode
    );

    // Return unsubscribe function
    return () => {
      this.handlers = null;
    };
  }

  start(): void {
    this.channelManager.start();
  }

  stop(): void {
    this.channelManager.stop();
  }
}
