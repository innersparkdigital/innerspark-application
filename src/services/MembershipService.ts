/**
 * MembershipService - Handles membership plan validation and group limits
 * Manages user subscription tiers and access control
 */

export type MembershipPlan = 'free' | 'basic' | 'premium' | 'unlimited';

export interface MembershipInfo {
  plan: MembershipPlan;
  groupLimit: number;
  joinedGroupsCount: number;
  canJoinMore: boolean;
  remainingSlots: number;
}

// Global configurable limit allowing manual override across all plans.
export const GLOBAL_MEMBERSHIP_LIMIT = 1;

export interface PlanLimits {
  free: number;
  basic: number;
  premium: number;
  unlimited: number;
}

// Plan limits configuration originally here - Replaced by GLOBAL_MEMBERSHIP_LIMIT

// Plan display names
const PLAN_NAMES: Record<MembershipPlan, string> = {
  free: 'Free',
  basic: 'Basic',
  premium: 'Premium',
  unlimited: 'Unlimited',
};

// Plan benefits for upgrade modal
export const PLAN_BENEFITS: Record<MembershipPlan, string[]> = {
  free: [
    'Access to wellness resources',
    'Mood tracking',
    'Basic exercises',
  ],
  basic: [
    'Join up to 3 support groups',
    'Message your therapist',
    'Schedule therapy sessions',
    'Access to all exercises',
  ],
  premium: [
    'Join up to 4 support groups',
    'Priority support',
    'Advanced analytics',
    'Unlimited messaging',
    'Group video sessions',
  ],
  unlimited: [
    'Unlimited support groups',
    'VIP support',
    'All premium features',
    'Early access to new features',
  ],
};

/**
 * Get the current user's membership plan
 * TODO: Replace with actual Redux selector or API call
 */
export const getMembershipPlan = (): MembershipPlan => {
  // TODO: Get from Redux store
  // const userDetails = useSelector(state => state.userData.userDetails);
  // return userDetails?.membershipPlan || 'free';

  // For now, return mock data
  return 'basic';
};

/**
 * Get the group limit for a specific plan
 */
export const getGroupLimit = (_plan: MembershipPlan): number => {
  // Configured universally via GLOBAL_MEMBERSHIP_LIMIT configuration
  return GLOBAL_MEMBERSHIP_LIMIT;
};

/**
 * Get the display name for a plan
 */
export const getPlanDisplayName = (plan: MembershipPlan): string => {
  return PLAN_NAMES[plan] || 'Unknown';
};

/**
 * Count how many groups the user has joined
 */
export const getJoinedGroupsCount = (groups: any[]): number => {
  return groups.filter(g => g.isJoined).length;
};

/**
 * Check if user can join more groups based on their plan
 */
export const canJoinMoreGroups = (plan: MembershipPlan, joinedCount: number): boolean => {
  const limit = getGroupLimit(plan);

  // Unlimited plan
  if (limit === -1) {
    return true;
  }

  // Check if under limit
  return joinedCount < limit;
};

/**
 * Get remaining group slots for user
 */
export const getRemainingGroupSlots = (plan: MembershipPlan, joinedCount: number): number => {
  const limit = getGroupLimit(plan);

  // Unlimited plan
  if (limit === -1) {
    return -1;
  }

  const remaining = limit - joinedCount;
  return remaining > 0 ? remaining : 0;
};

/**
 * Get comprehensive membership info for user
 * @param joinedDatabaseCount The raw Redux array length calculating exact numbers instantly.
 */
export const getMembershipInfo = (joinedDatabaseCount: number): MembershipInfo => {
  const plan = getMembershipPlan();
  const groupLimit = getGroupLimit(plan);
  const canJoinMore = canJoinMoreGroups(plan, joinedDatabaseCount);
  const remainingSlots = getRemainingGroupSlots(plan, joinedDatabaseCount);

  return {
    plan,
    groupLimit,
    joinedGroupsCount: joinedDatabaseCount,
    canJoinMore,
    remainingSlots,
  };
};

/**
 * Validate if user can join a specific group
 * @param groups The FlatList array objects evaluating active metadata metrics natively.
 * @param groupId 
 * @param joinedCount The instant Redux sync counter value mapping.
 */
export const validateGroupJoin = (
  groups: any[],
  groupId: string,
  joinedCount: number
): { canJoin: boolean; reason?: string } => {
  const membershipInfo = getMembershipInfo(joinedCount);

  // Check if already joined
  const group = groups.find(g => g.id === groupId);
  if (group?.isJoined) {
    return {
      canJoin: false,
      reason: 'already_joined',
    };
  }

  // Check if group is full
  if (group && group.memberCount >= group.maxMembers && !group.isPrivate) {
    return {
      canJoin: false,
      reason: 'group_full',
    };
  }

  // Check membership limit
  if (!membershipInfo.canJoinMore) {
    return {
      canJoin: false,
      reason: 'membership_limit',
    };
  }

  return { canJoin: true };
};

/**
 * Get next upgrade plan
 */
export const getNextUpgradePlan = (currentPlan: MembershipPlan): MembershipPlan | null => {
  const upgradePath: Record<MembershipPlan, MembershipPlan | null> = {
    free: 'basic',
    basic: 'premium',
    premium: 'unlimited',
    unlimited: null,
  };

  return upgradePath[currentPlan];
};

/**
 * Get upgrade benefits (what user gains by upgrading)
 */
export const getUpgradeBenefits = (currentPlan: MembershipPlan): string[] => {
  const nextPlan = getNextUpgradePlan(currentPlan);
  if (!nextPlan) return [];

  return PLAN_BENEFITS[nextPlan];
};

export default {
  getMembershipPlan,
  getGroupLimit,
  getPlanDisplayName,
  getJoinedGroupsCount,
  canJoinMoreGroups,
  getRemainingGroupSlots,
  getMembershipInfo,
  validateGroupJoin,
  getNextUpgradePlan,
  getUpgradeBenefits,
  PLAN_BENEFITS,
};
