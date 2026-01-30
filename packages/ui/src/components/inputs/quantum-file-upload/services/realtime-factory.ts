import { RealtimeAdapter } from '../../../../types/quantum-file-upload';
import { SupabaseRealtimeAdapter } from './supabase/supabase-realtime-adapter';

export interface SupabaseRealtimeConfig {
  type: 'supabase';
  channelManager: any; // SupabaseChannelManager
}

export type RealtimeConfig = SupabaseRealtimeConfig;

/**
 * Factory for creating realtime adapters
 */
export class RealtimeFactory {
  static create(config: RealtimeConfig): RealtimeAdapter {
    switch (config.type) {
      case 'supabase':
        if (!config.channelManager) {
          throw new Error('channelManager is required for Supabase realtime adapter');
        }
        return new SupabaseRealtimeAdapter(config.channelManager);

      default:
        throw new Error(`Unknown realtime type: ${(config as any).type}`);
    }
  }
}
