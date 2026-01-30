/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async signInWithPassword(credentials: { email: string; password: string }) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword(credentials);

      if (error) {
        this.logger.error(`Sign in failed: ${error.message}`);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      this.logger.error('Sign in error:', error);
      throw error;
    }
  }

  // Existing methods
  async verifyToken(token: string): Promise<SupabaseUser | null> {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser(token);

      if (error) {
        this.logger.warn(`Token verification failed: ${error.message}`);
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error('Token verification error:', error);
      return null;
    }
  }

  async getUserById(userId: string): Promise<any | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        this.logger.warn(`Get user failed: ${error.message}`);
        return null;
      }

      return data;
    } catch (error) {
      this.logger.error('Get user error:', error);
      return null;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        this.logger.warn(`Token refresh failed: ${error.message}`);
        return null;
      }

      return data;
    } catch (error) {
      this.logger.error('Token refresh error:', error);
      return null;
    }
  }

  // User Management
  async createUser(userData: {
    email: string;
    password?: string;
    user_metadata?: any;
    email_confirm?: boolean;
  }) {
    try {
      const { data, error } = await this.supabase.auth.admin.createUser(userData);
      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('Create user error:', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: { email?: string; user_metadata?: any }) {
    try {
      const { data, error } = await this.supabase.auth.admin.updateUserById(userId, userData);
      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      const { data, error } = await this.supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('Delete user error:', error);
      throw error;
    }
  }

  async listUsers(page = 1, perPage = 50) {
    try {
      const { data, error } = await this.supabase.auth.admin.listUsers({ page, perPage });
      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('List users error:', error);
      throw error;
    }
  }

  async resetUserPassword(userId: string) {
    try {
      const { data, error } = await this.supabase.auth.admin.updateUserById(userId, {
        password: Math.random().toString(36).slice(-8),
      });
      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('Reset password error:', error);
      throw error;
    }
  }

  async updateUserMetadata(userId: string, metadata: any) {
    try {
      const { data, error } = await this.supabase.auth.admin.updateUserById(userId, {
        user_metadata: metadata,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('Update metadata error:', error);
      throw error;
    }
  }

  // Authentication Management
  async revokeUserSessions(userId: string) {
    try {
      const { data, error } = await this.supabase.auth.admin.updateUserById(userId, {
        ban_duration: '1s',
      });
      if (error) throw error;

      // Immediately unban to just revoke sessions
      await this.supabase.auth.admin.updateUserById(userId, { ban_duration: 'none' });
      return data;
    } catch (error) {
      this.logger.error('Revoke sessions error:', error);
      throw error;
    }
  }

  async generatePasswordResetLink(email: string) {
    try {
      const { data, error } = await this.supabase.auth.admin.generateLink({
        type: 'recovery',
        email,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('Generate reset link error:', error);
      throw error;
    }
  }

  async generateMagicLink(email: string) {
    try {
      const { data, error } = await this.supabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('Generate magic link error:', error);
      throw error;
    }
  }

  // Admin Operations
  async getUserByEmail(email: string) {
    try {
      const { data, error } = await this.supabase.auth.admin.listUsers();
      if (error) throw error;

      const user = data.users.find((u: any) => u.email === email);
      return user || null;
    } catch (error) {
      this.logger.error('Get user by email error:', error);
      throw error;
    }
  }

  async inviteUserByEmail(
    email: string,
    options?: { data?: any; redirectTo?: string; user_metadata?: any },
  ) {
    try {
      const inviteOptions: any = {};
      if (options?.redirectTo) inviteOptions.redirectTo = options.redirectTo;
      if (options?.data) inviteOptions.data = options.data;

      const { data, error } = await this.supabase.auth.admin.inviteUserByEmail(
        email,
        inviteOptions,
      );
      if (error) throw error;

      // Update metadata if provided
      if (options?.user_metadata && data.user) {
        await this.updateUserMetadata(data.user.id, options.user_metadata);
      }

      return data;
    } catch (error) {
      this.logger.error('Invite user error:', error);
      throw error;
    }
  }

  async banUser(userId: string, duration = '24h') {
    try {
      const { data, error } = await this.supabase.auth.admin.updateUserById(userId, {
        ban_duration: duration,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('Ban user error:', error);
      throw error;
    }
  }

  async unbanUser(userId: string) {
    try {
      const { data, error } = await this.supabase.auth.admin.updateUserById(userId, {
        ban_duration: 'none',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('Unban user error:', error);
      throw error;
    }
  }

  // Audit/Compliance
  async getAuditLogs(filters?: { start_date?: string; end_date?: string }) {
    try {
      let query = this.supabase.from('audit_log_entries').select('*');

      if (filters?.start_date) {
        query = query.gte('created_at', filters.start_date);
      }
      if (filters?.end_date) {
        query = query.lte('created_at', filters.end_date);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('Get audit logs error:', error);
      throw error;
    }
  }

  async getUserActivity(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('audit_log_entries')
        .select('*')
        .contains('payload', { user_id: userId })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      this.logger.error('Get user activity error:', error);
      throw error;
    }
  }
}
