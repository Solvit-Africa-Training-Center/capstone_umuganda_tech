// Notification templates for different events

export const notificationTemplates = {
  // Leader notifications
  leader: {
    volunteerRegistered: (volunteerName: string, projectTitle: string) => ({
      title: '🎉 New Volunteer Registered',
      message: `${volunteerName} has registered for your project "${projectTitle}". Review their profile and prepare for their participation.`,
      notification_type: 'project_registration'
    }),

    volunteerCheckedIn: (volunteerName: string, projectTitle: string) => ({
      title: '✅ Volunteer Check-in',
      message: `${volunteerName} has checked in to "${projectTitle}". The activity is now in progress.`,
      notification_type: 'project_checkin'
    }),

    volunteerCheckedOut: (volunteerName: string, projectTitle: string, duration: string) => ({
      title: '👋 Volunteer Check-out',
      message: `${volunteerName} has completed their participation in "${projectTitle}" (Duration: ${duration}). Consider generating their certificate.`,
      notification_type: 'project_checkout'
    }),

    projectDeadlineApproaching: (projectTitle: string, daysLeft: number) => ({
      title: '⏰ Project Deadline Approaching',
      message: `Your project "${projectTitle}" is scheduled to start in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Ensure all preparations are complete.`,
      notification_type: 'project_deadline'
    }),

    projectCapacityReached: (projectTitle: string, volunteerCount: number) => ({
      title: '🎯 Project Capacity Reached',
      message: `Great news! Your project "${projectTitle}" has reached its target of ${volunteerCount} volunteers. You can now close registration or increase capacity.`,
      notification_type: 'project_capacity'
    }),

    lowVolunteerTurnout: (projectTitle: string, registeredCount: number, requiredCount: number) => ({
      title: '📢 Low Volunteer Registration',
      message: `Your project "${projectTitle}" has only ${registeredCount} out of ${requiredCount} required volunteers. Consider promoting it more or extending the deadline.`,
      notification_type: 'project_low_turnout'
    }),

    certificateGenerated: (volunteerName: string, projectTitle: string) => ({
      title: '🏆 Certificate Generated',
      message: `Certificate has been generated for ${volunteerName} who completed "${projectTitle}". They can now download it from their profile.`,
      notification_type: 'certificate_generated'
    }),

    followerJoined: (followerName: string) => ({
      title: '👥 New Follower',
      message: `${followerName} is now following your leadership profile. They'll receive updates about your projects.`,
      notification_type: 'follower_joined'
    })
  },

  // Volunteer notifications
  volunteer: {
    registrationConfirmed: (projectTitle: string, projectDate: string, location: string) => ({
      title: '✅ Registration Confirmed',
      message: `You're registered for "${projectTitle}" on ${projectDate} at ${location}. Don't forget to check in when you arrive!`,
      notification_type: 'registration_confirmed'
    }),

    projectReminder: (projectTitle: string, hoursUntil: number, location: string) => ({
      title: '⏰ Project Reminder',
      message: `"${projectTitle}" starts in ${hoursUntil} hours at ${location}. Make sure to arrive on time and bring any required materials.`,
      notification_type: 'project_reminder'
    }),

    qrCodeGenerated: (projectTitle: string, leaderName: string) => ({
      title: '📱 QR Code Available',
      message: `${leaderName} has generated the check-in QR code for "${projectTitle}". You can now scan it to mark your attendance.`,
      notification_type: 'qr_code_ready'
    }),

    certificateReady: (projectTitle: string) => ({
      title: '🏆 Certificate Ready',
      message: `Congratulations! Your certificate for completing "${projectTitle}" is ready for download. Check your profile to get it.`,
      notification_type: 'certificate_ready'
    }),

    badgeEarned: (badgeName: string, description: string) => ({
      title: '🎖️ New Badge Earned',
      message: `You've earned the "${badgeName}" badge! ${description}. Keep up the great community work!`,
      notification_type: 'badge_earned'
    }),

    projectCancelled: (projectTitle: string, reason?: string) => ({
      title: '❌ Project Cancelled',
      message: `Unfortunately, "${projectTitle}" has been cancelled${reason ? `: ${reason}` : ''}. You'll be notified of any rescheduled dates.`,
      notification_type: 'project_cancelled'
    }),

    projectUpdated: (projectTitle: string, changes: string) => ({
      title: '📝 Project Updated',
      message: `"${projectTitle}" has been updated: ${changes}. Please review the changes in your registered projects.`,
      notification_type: 'project_updated'
    }),

    leaderMessage: (leaderName: string, projectTitle: string, message: string) => ({
      title: `💬 Message from ${leaderName}`,
      message: `Regarding "${projectTitle}": ${message}`,
      notification_type: 'leader_message'
    }),

    milestoneReached: (milestone: string, count: number) => ({
      title: '🎉 Milestone Achieved',
      message: `Congratulations! You've reached ${count} ${milestone}. Your contribution to the community is making a real difference!`,
      notification_type: 'milestone_reached'
    })
  },

  // System notifications (for both)
  system: {
    welcomeMessage: (userName: string, userType: 'volunteer' | 'leader') => ({
      title: '🎉 Welcome to UmugandaTech',
      message: `Welcome ${userName}! As a ${userType}, you're now part of Rwanda's community development platform. Start exploring projects and making an impact!`,
      notification_type: 'system_welcome'
    }),

    profileIncomplete: (missingFields: string[]) => ({
      title: '📝 Complete Your Profile',
      message: `Your profile is missing: ${missingFields.join(', ')}. Complete it to get better project recommendations and increase your credibility.`,
      notification_type: 'profile_incomplete'
    }),

    systemMaintenance: (maintenanceDate: string, duration: string) => ({
      title: '🔧 Scheduled Maintenance',
      message: `System maintenance is scheduled for ${maintenanceDate} (Duration: ${duration}). Some features may be temporarily unavailable.`,
      notification_type: 'system_maintenance'
    }),

    newFeatureAnnouncement: (featureName: string, description: string) => ({
      title: '🚀 New Feature Available',
      message: `Introducing ${featureName}: ${description}. Check it out and let us know what you think!`,
      notification_type: 'feature_announcement'
    }),

    securityAlert: (action: string, location?: string) => ({
      title: '🔒 Security Alert',
      message: `${action} detected${location ? ` from ${location}` : ''}. If this wasn't you, please secure your account immediately.`,
      notification_type: 'security_alert'
    }),

    dataExportReady: (exportType: string) => ({
      title: '📊 Data Export Ready',
      message: `Your ${exportType} export is ready for download. The download link will expire in 24 hours.`,
      notification_type: 'data_export'
    }),

    communityUpdate: (updateTitle: string, summary: string) => ({
      title: `📢 Community Update: ${updateTitle}`,
      message: summary,
      notification_type: 'community_update'
    })
  }
};

// Helper function to create notifications
export const createNotificationFromTemplate = (
  template: any,
  additionalData?: {
    project?: number;
    user?: number;
    priority?: 'high' | 'medium' | 'normal';
  }
) => {
  return {
    ...template,
    ...additionalData,
    created_at: new Date().toISOString(),
    is_read: false
  };
};

// Helper function to get notification priority based on type
export const getNotificationPriority = (notificationType: string): 'high' | 'medium' | 'normal' => {
  const highPriorityTypes = [
    'project_deadline',
    'project_cancelled',
    'security_alert',
    'system_maintenance'
  ];
  
  const mediumPriorityTypes = [
    'project_registration',
    'project_checkin',
    'project_checkout',
    'qr_code_ready',
    'certificate_ready',
    'badge_earned'
  ];
  
  if (highPriorityTypes.includes(notificationType)) return 'high';
  if (mediumPriorityTypes.includes(notificationType)) return 'medium';
  return 'normal';
};