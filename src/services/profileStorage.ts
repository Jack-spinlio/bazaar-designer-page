import { Profile, BusinessProfile } from '../types/Profile';

/**
 * Service for managing profile storage
 */
export class ProfileStorageService {
  private static API_URL = 'https://api.bazaar.it';

  /**
   * Create or update a user profile
   */
  static async createProfile(profileData: Profile, token: string): Promise<Profile> {
    try {
      const response = await fetch(`${this.API_URL}/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile creation error:', error);
      throw error;
    }
  }

  /**
   * Create or update a business profile
   */
  static async createBusinessProfile(profileData: BusinessProfile, token: string): Promise<BusinessProfile> {
    try {
      const response = await fetch(`${this.API_URL}/business-profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create business profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Business profile creation error:', error);
      throw error;
    }
  }

  /**
   * Get a user profile by ID
   */
  static async getProfileById(id: string, token: string): Promise<Profile> {
    try {
      const response = await fetch(`${this.API_URL}/profiles/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  /**
   * Get a business profile by user ID
   */
  static async getBusinessProfileById(id: string, token: string): Promise<BusinessProfile> {
    try {
      const response = await fetch(`${this.API_URL}/business-profiles/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch business profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Business profile fetch error:', error);
      throw error;
    }
  }
} 