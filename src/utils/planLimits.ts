import { Plan } from '@/hooks/usePermissions';

// Define comprehensive plan limits and features
export interface PlanLimits {
  // Storage limits
  maxStorageGB: number;
  maxFileUploadMB: number;
  
  // Team limits
  maxTeamMembers: number;
  maxInvitationsPerMonth: number;
  
  // Content limits
  maxTemplates: number;
  maxInspectionsPerMonth: number;
  maxReportsPerMonth: number;
  
  // Feature availability
  hasVoiceAssistant: boolean;
  hasAdvancedAnalytics: boolean;
  hasCustomBranding: boolean;
  hasPrioritySupport: boolean;
  hasAPIAccess: boolean;
  hasCustomIntegrations: boolean;
  hasWhiteLabel: boolean;
  hasSSO: boolean;
  
  // Voice assistant limits
  maxVoiceCommandsPerMonth: number;
  voiceTranscriptionAccuracy: 'basic' | 'standard' | 'premium';
  
  // Analytics limits
  analyticsRetentionDays: number;
  hasRealTimeAnalytics: boolean;
  hasCustomReports: boolean;
  
  // Support limits
  supportChannels: ('email' | 'chat' | 'phone')[];
  supportResponseTime: string;
  
  // Export limits
  maxExportsPerMonth: number;
  exportFormats: string[];
  
  // Backup and security
  backupRetentionDays: number;
  hasAdvancedSecurity: boolean;
  hasTwoFactorAuth: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  iniciante: {
    // Storage
    maxStorageGB: 5,
    maxFileUploadMB: 10,
    
    // Team
    maxTeamMembers: 3,
    maxInvitationsPerMonth: 5,
    
    // Content
    maxTemplates: 5,
    maxInspectionsPerMonth: 50,
    maxReportsPerMonth: 20,
    
    // Features
    hasVoiceAssistant: false,
    hasAdvancedAnalytics: false,
    hasCustomBranding: false,
    hasPrioritySupport: false,
    hasAPIAccess: false,
    hasCustomIntegrations: false,
    hasWhiteLabel: false,
    hasSSO: false,
    
    // Voice
    maxVoiceCommandsPerMonth: 0,
    voiceTranscriptionAccuracy: 'basic',
    
    // Analytics
    analyticsRetentionDays: 30,
    hasRealTimeAnalytics: false,
    hasCustomReports: false,
    
    // Support
    supportChannels: ['email'],
    supportResponseTime: '48 horas',
    
    // Export
    maxExportsPerMonth: 5,
    exportFormats: ['PDF'],
    
    // Security
    backupRetentionDays: 7,
    hasAdvancedSecurity: false,
    hasTwoFactorAuth: false
  },
  
  profissional: {
    // Storage
    maxStorageGB: 50,
    maxFileUploadMB: 50,
    
    // Team
    maxTeamMembers: 15,
    maxInvitationsPerMonth: 25,
    
    // Content
    maxTemplates: 50,
    maxInspectionsPerMonth: 500,
    maxReportsPerMonth: 200,
    
    // Features
    hasVoiceAssistant: true,
    hasAdvancedAnalytics: true,
    hasCustomBranding: false,
    hasPrioritySupport: true,
    hasAPIAccess: true,
    hasCustomIntegrations: false,
    hasWhiteLabel: false,
    hasSSO: false,
    
    // Voice
    maxVoiceCommandsPerMonth: 1000,
    voiceTranscriptionAccuracy: 'standard',
    
    // Analytics
    analyticsRetentionDays: 90,
    hasRealTimeAnalytics: true,
    hasCustomReports: true,
    
    // Support
    supportChannels: ['email', 'chat'],
    supportResponseTime: '24 horas',
    
    // Export
    maxExportsPerMonth: 50,
    exportFormats: ['PDF', 'Excel', 'CSV'],
    
    // Security
    backupRetentionDays: 30,
    hasAdvancedSecurity: true,
    hasTwoFactorAuth: true
  },
  
  enterprise: {
    // Storage
    maxStorageGB: -1, // unlimited
    maxFileUploadMB: 500,
    
    // Team
    maxTeamMembers: -1, // unlimited
    maxInvitationsPerMonth: -1, // unlimited
    
    // Content
    maxTemplates: -1, // unlimited
    maxInspectionsPerMonth: -1, // unlimited
    maxReportsPerMonth: -1, // unlimited
    
    // Features
    hasVoiceAssistant: true,
    hasAdvancedAnalytics: true,
    hasCustomBranding: true,
    hasPrioritySupport: true,
    hasAPIAccess: true,
    hasCustomIntegrations: true,
    hasWhiteLabel: true,
    hasSSO: true,
    
    // Voice
    maxVoiceCommandsPerMonth: -1, // unlimited
    voiceTranscriptionAccuracy: 'premium',
    
    // Analytics
    analyticsRetentionDays: 365,
    hasRealTimeAnalytics: true,
    hasCustomReports: true,
    
    // Support
    supportChannels: ['email', 'chat', 'phone'],
    supportResponseTime: '4 horas',
    
    // Export
    maxExportsPerMonth: -1, // unlimited
    exportFormats: ['PDF', 'Excel', 'CSV', 'JSON', 'XML'],
    
    // Security
    backupRetentionDays: 90,
    hasAdvancedSecurity: true,
    hasTwoFactorAuth: true
  }
};

// Helper functions for plan limit checking
export const getPlanLimits = (plan: Plan): PlanLimits => {
  return PLAN_LIMITS[plan];
};

export const isWithinLimit = (plan: Plan, limitType: keyof PlanLimits, currentValue: number): boolean => {
  const limits = getPlanLimits(plan);
  const limit = limits[limitType] as number;
  
  // -1 means unlimited
  if (limit === -1) return true;
  
  return currentValue < limit;
};

export const getRemainingQuota = (plan: Plan, limitType: keyof PlanLimits, currentValue: number): number | null => {
  const limits = getPlanLimits(plan);
  const limit = limits[limitType] as number;
  
  // -1 means unlimited
  if (limit === -1) return null;
  
  return Math.max(0, limit - currentValue);
};

export const getUsagePercentage = (plan: Plan, limitType: keyof PlanLimits, currentValue: number): number => {
  const limits = getPlanLimits(plan);
  const limit = limits[limitType] as number;
  
  // -1 means unlimited
  if (limit === -1) return 0;
  
  return Math.min(100, (currentValue / limit) * 100);
};

export const hasFeature = (plan: Plan, feature: keyof PlanLimits): boolean => {
  const limits = getPlanLimits(plan);
  return Boolean(limits[feature]);
};

export const canUpgrade = (currentPlan: Plan, targetPlan: Plan): boolean => {
  const planOrder: Plan[] = ['iniciante', 'profissional', 'enterprise'];
  const currentIndex = planOrder.indexOf(currentPlan);
  const targetIndex = planOrder.indexOf(targetPlan);
  
  return targetIndex > currentIndex;
};

export const getUpgradeRecommendation = (plan: Plan, usage: Partial<Record<keyof PlanLimits, number>>): {
  shouldUpgrade: boolean;
  reason: string;
  recommendedPlan?: Plan;
} => {
  const limits = getPlanLimits(plan);
  
  // Check if any usage is approaching limits (>80%)
  for (const [key, value] of Object.entries(usage)) {
    const limitKey = key as keyof PlanLimits;
    const limit = limits[limitKey] as number;
    
    if (limit !== -1 && value !== undefined) {
      const percentage = (value / limit) * 100;
      
      if (percentage > 80) {
        const nextPlan = plan === 'iniciante' ? 'profissional' : 'enterprise';
        return {
          shouldUpgrade: true,
          reason: `Você está usando ${percentage.toFixed(0)}% do limite de ${key}`,
          recommendedPlan: nextPlan
        };
      }
    }
  }
  
  return {
    shouldUpgrade: false,
    reason: 'Seu uso atual está dentro dos limites do plano'
  };
};

// Plan comparison utilities
export const comparePlans = (plan1: Plan, plan2: Plan): {
  differences: Array<{
    feature: keyof PlanLimits;
    plan1Value: any;
    plan2Value: any;
    better: Plan | 'equal';
  }>;
} => {
  const limits1 = getPlanLimits(plan1);
  const limits2 = getPlanLimits(plan2);
  
  const differences: Array<{
    feature: keyof PlanLimits;
    plan1Value: any;
    plan2Value: any;
    better: Plan | 'equal';
  }> = [];
  
  for (const key of Object.keys(limits1) as Array<keyof PlanLimits>) {
    const value1 = limits1[key];
    const value2 = limits2[key];
    
    if (value1 !== value2) {
      let better: Plan | 'equal' = 'equal';
      
      if (typeof value1 === 'number' && typeof value2 === 'number') {
        if (value1 === -1 && value2 !== -1) better = plan1;
        else if (value2 === -1 && value1 !== -1) better = plan2;
        else if (value1 > value2) better = plan1;
        else if (value2 > value1) better = plan2;
      } else if (typeof value1 === 'boolean' && typeof value2 === 'boolean') {
        if (value1 && !value2) better = plan1;
        else if (value2 && !value1) better = plan2;
      }
      
      differences.push({
        feature: key,
        plan1Value: value1,
        plan2Value: value2,
        better
      });
    }
  }
  
  return { differences };
};

// Usage tracking utilities
export interface UsageMetrics {
  storageGB: number;
  teamMembers: number;
  templates: number;
  inspectionsThisMonth: number;
  reportsThisMonth: number;
  voiceCommandsThisMonth: number;
  exportsThisMonth: number;
  invitationsThisMonth: number;
}

export const getUsageStatus = (plan: Plan, usage: UsageMetrics) => {
  const limits = getPlanLimits(plan);
  const status: Record<keyof UsageMetrics, {
    current: number;
    limit: number | null;
    percentage: number;
    status: 'safe' | 'warning' | 'critical' | 'unlimited';
  }> = {} as any;
  
  for (const [key, value] of Object.entries(usage)) {
    const limitKey = `max${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof PlanLimits;
    const limit = limits[limitKey] as number;
    
    let percentage = 0;
    let statusLevel: 'safe' | 'warning' | 'critical' | 'unlimited' = 'safe';
    
    if (limit === -1) {
      statusLevel = 'unlimited';
    } else {
      percentage = (value / limit) * 100;
      if (percentage >= 90) statusLevel = 'critical';
      else if (percentage >= 75) statusLevel = 'warning';
      else statusLevel = 'safe';
    }
    
    status[key as keyof UsageMetrics] = {
      current: value,
      limit: limit === -1 ? null : limit,
      percentage,
      status: statusLevel
    };
  }
  
  return status;
};