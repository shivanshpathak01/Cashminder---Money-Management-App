'use client';

import { User } from './types';

export interface UserSettings {
  name: string;
  email: string;
  profilePicture?: string;
  currency: string;
  language: string;
  dateFormat: string;
  enableAnimations: boolean;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    types: {
      transactionAlerts: boolean;
      budgetAlerts: boolean;
      goalReminders: boolean;
      billReminders: boolean;
      securityAlerts: boolean;
      weeklyReports: boolean;
    };
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
  };
}

export const defaultUserSettings: UserSettings = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  currency: 'USD',
  language: 'English',
  dateFormat: 'MM/DD/YYYY',
  enableAnimations: true,
  notificationPreferences: {
    email: true,
    push: true,
    sms: false,
    frequency: 'immediate',
    types: {
      transactionAlerts: true,
      budgetAlerts: true,
      goalReminders: true,
      billReminders: true,
      securityAlerts: true,
      weeklyReports: false
    }
  },
  securitySettings: {
    twoFactorEnabled: false,
    lastPasswordChange: new Date().toISOString()
  }
};

export function getUserSettings(userId: string): UserSettings {
  try {
    const storedSettings = localStorage.getItem(`cashminder_settings_${userId}`);
    if (storedSettings) {
      // Parse stored settings
      const parsedSettings = JSON.parse(storedSettings);

      // Migrate settings if needed
      const migratedSettings = migrateUserSettings(parsedSettings);

      // Always save the migrated settings to ensure consistency
      saveUserSettings(userId, migratedSettings);

      return migratedSettings;
    }
    return defaultUserSettings;
  } catch (error) {
    console.error('Error getting user settings:', error);
    return defaultUserSettings;
  }
}

// Helper function to migrate user settings to the latest structure
function migrateUserSettings(settings: any): UserSettings {
  const migratedSettings = { ...settings };

  // Ensure notificationPreferences exists
  if (!migratedSettings.notificationPreferences) {
    migratedSettings.notificationPreferences = defaultUserSettings.notificationPreferences;
  }

  // Ensure frequency exists
  if (!migratedSettings.notificationPreferences.frequency) {
    migratedSettings.notificationPreferences.frequency = defaultUserSettings.notificationPreferences.frequency;
  }

  // Ensure types exists
  if (!migratedSettings.notificationPreferences.types) {
    migratedSettings.notificationPreferences.types = defaultUserSettings.notificationPreferences.types;
  } else {
    // Ensure all notification types exist
    const defaultTypes = defaultUserSettings.notificationPreferences.types;
    migratedSettings.notificationPreferences.types = {
      ...defaultTypes,
      ...migratedSettings.notificationPreferences.types
    };
  }

  return migratedSettings as UserSettings;
}

export function saveUserSettings(userId: string, settings: UserSettings): void {
  try {
    localStorage.setItem(`cashminder_settings_${userId}`, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving user settings:', error);
  }
}

export function updateUserSettings(userId: string, partialSettings: Partial<UserSettings>): UserSettings {
  const currentSettings = getUserSettings(userId);

  // Create a deep copy of the current settings
  const updatedSettings = JSON.parse(JSON.stringify(currentSettings));

  // Handle special case for notification preferences to ensure deep merging
  if (partialSettings.notificationPreferences) {
    updatedSettings.notificationPreferences = {
      ...updatedSettings.notificationPreferences,
      ...partialSettings.notificationPreferences
    };

    // Handle types separately for deep merging
    if (partialSettings.notificationPreferences.types) {
      updatedSettings.notificationPreferences.types = {
        ...updatedSettings.notificationPreferences.types,
        ...partialSettings.notificationPreferences.types
      };
    }

    // Remove notificationPreferences from partialSettings to prevent overwriting
    const { notificationPreferences, ...restSettings } = partialSettings;

    // Merge the rest of the settings
    Object.assign(updatedSettings, restSettings);
  } else {
    // Simple merge for other settings
    Object.assign(updatedSettings, partialSettings);
  }

  saveUserSettings(userId, updatedSettings);
  return updatedSettings;
}

export function getInitials(name: string): string {
  if (!name) return '';

  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function getCurrentUser(): { id: string; name: string; email: string } | null {
  try {
    const userJson = localStorage.getItem('cashminder_user');
    if (!userJson) return null;

    const userData = JSON.parse(userJson);
    return {
      id: userData.id || 'default',
      name: userData.name || 'User',
      email: userData.email || ''
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
