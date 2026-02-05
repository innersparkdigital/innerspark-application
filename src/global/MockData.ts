/**
 * Mock Data
 * Contains mock/dummy data for testing and fallback purposes
 */

/**
 * Mock Events Data
 * Used as fallback when API is unavailable or for testing
 */
export const mockEvents = [
  {
    id: 1,
    title: 'Mindfulness & Meditation Workshop',
    shortDescription: 'Learn mindfulness techniques to reduce stress and improve mental clarity.',
    date: '2024-01-15',
    time: '10:00 AM',
    coverImage: require('../assets/images/dummy-people/d-person1.png'),
    location: 'Wellness Center, Kampala',
    isOnline: false,
    totalSeats: 50,
    availableSeats: 12,
    price: 25000,
    currency: 'UGX',
    category: 'Workshop',
    organizer: 'Dr. Sarah Nakato',
    organizerImage: require('../assets/images/dummy-people/d-person1.png'),
    isRegistered: false,
  },
  {
    id: 2,
    title: 'Mental Health First Aid Training',
    shortDescription: 'Essential training for recognizing and responding to mental health crises.',
    date: '2024-01-20',
    time: '9:00 AM',
    coverImage: require('../assets/images/dummy-people/d-person2.png'),
    location: 'Online Event',
    isOnline: true,
    totalSeats: 100,
    availableSeats: 45,
    price: 0,
    currency: 'UGX',
    category: 'Training',
    organizer: 'Mental Health Uganda',
    organizerImage: require('../assets/images/dummy-people/d-person2.png'),
    isRegistered: true,
  },
  {
    id: 3,
    title: 'Anxiety Management Seminar',
    shortDescription: 'Learn practical strategies to manage anxiety and panic attacks.',
    date: '2024-01-25',
    time: '2:00 PM',
    coverImage: require('../assets/images/dummy-people/d-person3.png'),
    location: 'Makerere University, Kampala',
    isOnline: false,
    totalSeats: 75,
    availableSeats: 0,
    price: 15000,
    currency: 'UGX',
    category: 'Seminar',
    organizer: 'Prof. Mary Kiconco',
    organizerImage: require('../assets/images/dummy-people/d-person3.png'),
    isRegistered: false,
  },
];

/**
 * Mock Meditation Articles Data
 * Previously used in MeditationsScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockMeditationArticles = [
  {
    id: '1',
    title: 'The Power of Mindful Breathing',
    excerpt: 'Discover how simple breathing exercises can transform your mental state and reduce anxiety in just minutes.',
    readTime: '5 min read',
    category: 'Mindfulness',
    image: require('../assets/images/dummy-people/d-person1.png'),
    content: 'Full article content here...',
  },
  {
    id: '2',
    title: 'Starting Your Meditation Journey',
    excerpt: 'A beginner-friendly guide to establishing a daily meditation practice that fits your lifestyle.',
    readTime: '7 min read',
    category: 'Getting Started',
    image: require('../assets/images/dummy-people/d-person2.png'),
    content: 'Full article content here...',
  },
  {
    id: '3',
    title: 'Overcoming Meditation Challenges',
    excerpt: 'Common obstacles in meditation and practical strategies to overcome them for a deeper practice.',
    readTime: '6 min read',
    category: 'Tips & Tricks',
    image: require('../assets/images/dummy-people/d-person3.png'),
    content: 'Full article content here...',
  },
  {
    id: '4',
    title: 'Body Scan Meditation Explained',
    excerpt: 'Learn the technique of body scan meditation to release tension and connect with your physical self.',
    readTime: '8 min read',
    category: 'Techniques',
    image: require('../assets/images/dummy-people/d-person4.png'),
    content: 'Full article content here...',
  },
];

/**
 * Mock Meditation Sounds Data
 * Previously used in MeditationsScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockMeditationSounds = [
  {
    id: '1',
    title: 'Ocean Waves',
    duration: '30 min',
    category: 'Nature',
    icon: 'waves',
    color: '#2196F3',
    description: 'Gentle ocean waves for deep relaxation',
  },
  {
    id: '2',
    title: 'Rain & Thunder',
    duration: '45 min',
    category: 'Nature',
    icon: 'thunderstorm',
    color: '#607D8B',
    description: 'Soothing rain sounds with distant thunder',
  },
  {
    id: '3',
    title: 'Forest Sounds',
    duration: '60 min',
    category: 'Nature',
    icon: 'park',
    color: '#4CAF50',
    description: 'Birds chirping in a peaceful forest',
  },
  {
    id: '4',
    title: 'Singing Bowls',
    duration: '20 min',
    category: 'Instrumental',
    icon: 'music-note',
    color: '#9C27B0',
    description: 'Tibetan singing bowls for meditation',
  },
  {
    id: '5',
    title: 'Gentle Piano',
    duration: '40 min',
    category: 'Instrumental',
    icon: 'piano',
    color: '#FF9800',
    description: 'Soft piano melodies for relaxation',
  },
  {
    id: '6',
    title: 'White Noise',
    duration: '90 min',
    category: 'Ambient',
    icon: 'graphic-eq',
    color: '#795548',
    description: 'Pure white noise for focus and sleep',
  },
  {
    id: '7',
    title: 'Tibetan Chants',
    duration: '25 min',
    category: 'Spiritual',
    icon: 'self-improvement',
    color: '#E91E63',
    description: 'Traditional Tibetan meditation chants',
  },
  {
    id: '8',
    title: 'Binaural Beats',
    duration: '30 min',
    category: 'Focus',
    icon: 'headphones',
    color: '#00BCD4',
    description: 'Binaural beats for deep concentration',
  },
];

/**
 * Mock Meditation Quotes Data
 * Previously used in MeditationsScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockMeditationQuotes = [
  {
    id: '1',
    text: 'The present moment is the only time over which we have dominion.',
    author: 'Thích Nhất Hạnh',
  },
  {
    id: '2',
    text: 'Meditation is not evasion; it is a serene encounter with reality.',
    author: 'Thích Nhất Hạnh',
  },
  {
    id: '3',
    text: 'You should sit in meditation for 20 minutes a day, unless you\'re too busy; then you should sit for an hour.',
    author: 'Old Zen Saying',
  },
  {
    id: '4',
    text: 'The thing about meditation is: You become more and more you.',
    author: 'David Lynch',
  },
  {
    id: '5',
    text: 'Meditation is the tongue of the soul and the language of our spirit.',
    author: 'Jeremy Taylor',
  },
  {
    id: '6',
    text: 'In the midst of movement and chaos, keep stillness inside of you.',
    author: 'Deepak Chopra',
  },
  {
    id: '7',
    text: 'Meditation brings wisdom; lack of meditation leaves ignorance.',
    author: 'Buddha',
  },
  {
    id: '8',
    text: 'The quieter you become, the more you can hear.',
    author: 'Ram Dass',
  },
];

/**
 * Mock Chat Conversations Data
 * Previously used in ConversationsListScreen.tsx
 * Used as fallback when API is unavailable or for testing
 * Note: Clients can only message therapists
 */
export const mockChatConversations = [
  {
    id: '1',
    partnerId: 'therapist_1',
    partnerName: 'Dr. Sarah Johnson',
    partnerEmail: 'sarah.johnson@innerspark.com',
    partnerAvatar: require('../assets/images/dummy-people/d-person1.png'),
    lastMessage: 'Thank you for the session today. Remember to practice the breathing exercises we discussed.',
    lastMessageTime: '2 min ago',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    partnerId: 'therapist_2',
    partnerName: 'Dr. Clara Odding',
    partnerEmail: 'clara.odding@innerspark.com',
    partnerAvatar: require('../assets/images/dummy-people/d-person2.png'),
    lastMessage: 'How are you feeling after our last session? Any questions about the homework?',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    isOnline: false,
    lastSeen: '30 min ago',
  },
  {
    id: '3',
    partnerId: 'therapist_3',
    partnerName: 'Dr. Martin Pilier',
    partnerEmail: 'martin.pilier@innerspark.com',
    partnerAvatar: require('../assets/images/dummy-people/d-person1.png'),
    lastMessage: 'Your progress has been excellent. Keep up the good work!',
    lastMessageTime: '1 day ago',
    unreadCount: 0,
    isOnline: false,
    lastSeen: '2 hours ago',
  },
];

/**
 * Mock Group Chats Data
 * Previously used in MyGroupChatsListScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockGroupChats = [
  {
    id: '1',
    name: 'Anxiety Support Circle',
    description: 'A safe space for individuals dealing with anxiety',
    icon: 'favorite',
    memberCount: 24,
    lastMessage: 'Thanks everyone for the support today!',
    lastMessageTime: '5 min ago',
    unreadCount: 3,
    userRole: 'member',
  },
  {
    id: '2',
    name: 'Mindfulness & Meditation',
    description: 'Daily meditation practices',
    icon: 'self-improvement',
    memberCount: 18,
    lastMessage: 'Today\'s meditation session was amazing',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    userRole: 'member',
  },
  {
    id: '3',
    name: 'Depression Recovery',
    description: 'Supporting each other through recovery',
    icon: 'psychology',
    memberCount: 31,
    lastMessage: 'Remember, small steps count too',
    lastMessageTime: '3 hours ago',
    unreadCount: 7,
    userRole: 'moderator',
  },
];

/**
 * Mock Support Groups Directory Data
 * Previously used in GroupsListScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockSupportGroupsDirectory = [
  {
    id: '1',
    name: 'Anxiety Support Circle',
    description: 'A safe space for individuals dealing with anxiety disorders to share experiences and coping strategies.',
    therapistName: 'Dr. Sarah Johnson',
    therapistEmail: 'sarah.johnson@innerspark.com',
    therapistAvatar: require('../assets/images/dummy-people/d-person1.png'),
    memberCount: 24,
    maxMembers: 30,
    icon: 'psychology',
    category: 'anxiety',
    isJoined: true,
    isPrivate: false,
    meetingSchedule: 'Tuesdays & Thursdays, 7:00 PM',
    tags: ['anxiety', 'coping', 'mindfulness'],
  },
  {
    id: '2',
    name: 'Depression Recovery Group',
    description: 'Supporting each other through the journey of depression recovery with professional guidance.',
    therapistName: 'Dr. Michael Chen',
    therapistEmail: 'michael.chen@innerspark.com',
    therapistAvatar: require('../assets/images/dummy-people/d-person2.png'),
    memberCount: 18,
    maxMembers: 25,
    icon: 'favorite',
    category: 'depression',
    isJoined: false,
    isPrivate: false,
    meetingSchedule: 'Mondays & Wednesdays, 6:30 PM',
    tags: ['depression', 'recovery', 'support'],
  },
  {
    id: '3',
    name: 'Trauma Healing Circle',
    description: 'A specialized group for trauma survivors focusing on healing and post-traumatic growth.',
    therapistName: 'Dr. Lisa Rodriguez',
    therapistEmail: 'lisa.rodriguez@innerspark.com',
    therapistAvatar: require('../assets/images/dummy-people/d-person3.png'),
    memberCount: 12,
    maxMembers: 15,
    icon: 'healing',
    category: 'trauma',
    isJoined: false,
    isPrivate: true,
    meetingSchedule: 'Saturdays, 10:00 AM',
    tags: ['trauma', 'healing', 'ptsd'],
  },
  {
    id: '4',
    name: 'Addiction Recovery Support',
    description: 'Peer support group for individuals in recovery from various forms of addiction.',
    therapistName: 'Dr. James Wilson',
    therapistEmail: 'james.wilson@innerspark.com',
    memberCount: 31,
    maxMembers: 35,
    icon: 'self_improvement',
    category: 'addiction',
    isJoined: true,
    isPrivate: false,
    meetingSchedule: 'Daily, 8:00 PM',
    tags: ['addiction', 'recovery', 'sobriety'],
  },
  {
    id: '5',
    name: 'General Wellness Circle',
    description: 'Open discussion group for general mental health and wellness topics.',
    therapistName: 'Dr. Clara Odding',
    therapistEmail: 'clara.odding@innerspark.com',
    therapistAvatar: require('../assets/images/dummy-people/d-person2.png'),
    memberCount: 45,
    maxMembers: 50,
    icon: 'spa',
    category: 'general',
    isJoined: false,
    isPrivate: false,
    meetingSchedule: 'Fridays, 5:00 PM',
    tags: ['wellness', 'general', 'community'],
  },
  {
    id: '6',
    name: 'Mindfulness & Meditation',
    description: 'Practice mindfulness and meditation techniques together in a supportive environment.',
    therapistName: 'Dr. Sarah Johnson',
    therapistEmail: 'sarah.johnson@innerspark.com',
    therapistAvatar: require('../assets/images/dummy-people/d-person1.png'),
    memberCount: 28,
    maxMembers: 30,
    icon: 'self_improvement',
    category: 'general',
    isJoined: false,
    isPrivate: false,
    meetingSchedule: 'Sundays, 9:00 AM',
    tags: ['mindfulness', 'meditation', 'peace'],
  },
];

/**
 * Mock My Support Groups Data
 * Previously used in MyGroupsScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockMySupportGroups = [
  {
    id: '1',
    name: 'Anxiety Support Circle',
    description: 'A safe space for individuals dealing with anxiety disorders to share experiences and coping strategies.',
    therapistName: 'Dr. Sarah Johnson',
    therapistAvatar: require('../assets/images/dummy-people/d-person1.png'),
    memberCount: 24,
    icon: 'psychology',
    category: 'anxiety',
    lastActivity: '2 hours ago',
    unreadMessages: 5,
    nextMeeting: 'Today, 7:00 PM',
    isActive: true,
    role: 'member',
  },
  {
    id: '4',
    name: 'Addiction Recovery Support',
    description: 'Peer support group for individuals in recovery from various forms of addiction.',
    therapistName: 'Dr. James Wilson',
    therapistAvatar: require('../assets/images/dummy-people/d-person3.png'),
    memberCount: 31,
    icon: 'self_improvement',
    category: 'addiction',
    lastActivity: '1 day ago',
    unreadMessages: 0,
    nextMeeting: 'Tomorrow, 8:00 PM',
    isActive: true,
    role: 'moderator',
  },
  {
    id: '7',
    name: 'PTSD Support Network',
    description: 'Specialized support for post-traumatic stress disorder recovery.',
    therapistName: 'Dr. Lisa Rodriguez',
    therapistAvatar: require('../assets/images/dummy-people/d-person2.png'),
    memberCount: 15,
    icon: 'healing',
    category: 'trauma',
    lastActivity: '3 days ago',
    unreadMessages: 2,
    nextMeeting: 'Saturday, 10:00 AM',
    isActive: false,
    role: 'member',
  },
];

/**
 * Mock Group Detail Members Data
 * Previously used in GroupDetailScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockGroupDetailMembers = [
  {
    id: 'therapist_1',
    name: 'Dr. Sarah Johnson',
    avatar: require('../assets/images/dummy-people/d-person1.png'),
    role: 'therapist' as const,
    joinedDate: '2024-01-15',
    isOnline: true,
  },
  {
    id: 'mod_1',
    name: 'Michael Chen',
    avatar: require('../assets/images/dummy-people/d-person2.png'),
    role: 'moderator' as const,
    joinedDate: '2024-02-01',
    isOnline: true,
  },
  {
    id: 'member_1',
    name: 'Lisa Rodriguez',
    avatar: require('../assets/images/dummy-people/d-person3.png'),
    role: 'member' as const,
    joinedDate: '2024-02-15',
    isOnline: false,
    lastSeen: '2 hours ago',
  },
  {
    id: 'member_2',
    name: 'James Wilson',
    role: 'member' as const,
    joinedDate: '2024-03-01',
    isOnline: true,
  },
  {
    id: 'member_3',
    name: 'Emma Thompson',
    avatar: require('../assets/images/dummy-people/d-person1.png'),
    role: 'member' as const,
    joinedDate: '2024-03-10',
    isOnline: false,
    lastSeen: '1 day ago',
  },
];

/**
 * Mock Group Chat Messages Data
 * Previously used in GroupChatScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockGroupChatMessages = [
  {
    id: '1',
    senderId: 'therapist_1',
    senderName: 'Dr. Sarah Johnson',
    senderRole: 'therapist' as const,
    content: 'Welcome everyone to today\'s group session. Let\'s start by sharing how everyone is feeling today.',
    createdAt: '2025-01-27T19:00:00Z',
    isDelivered: true,
    isSeen: true,
    isOwn: false,
    type: 'announcement' as const,
  },
  {
    id: '2',
    senderId: 'member_1',
    senderName: 'Michael Thompson',
    senderRole: 'member' as const,
    anonymousId: 1,
    content: 'Hi everyone! I\'ve been practicing the breathing exercises we learned last week and they\'ve really helped with my anxiety.',
    createdAt: '2025-01-27T19:02:00Z',
    isDelivered: true,
    isSeen: true,
    isOwn: false,
    type: 'text' as const,
  },
  {
    id: '3',
    senderId: 'current_user',
    senderName: 'You',
    senderRole: 'member' as const,
    anonymousId: 2,
    content: 'That\'s great to hear! I\'ve been struggling a bit this week but I\'m trying to stay positive.',
    createdAt: '2025-01-27T19:03:00Z',
    isDelivered: true,
    isSeen: false,
    isOwn: true,
    type: 'text' as const,
  },
  {
    id: '4',
    senderId: 'moderator_1',
    senderName: 'Lisa Anderson',
    senderRole: 'moderator' as const,
    anonymousId: 3,
    content: 'Remember, it\'s okay to have difficult days. What matters is that you\'re here and you\'re trying. That takes courage.',
    createdAt: '2025-01-27T19:05:00Z',
    isDelivered: true,
    isSeen: true,
    isOwn: false,
    type: 'text' as const,
  },
  {
    id: '5',
    senderId: 'member_2',
    senderName: 'Emma Wilson',
    senderRole: 'member' as const,
    anonymousId: 4,
    content: 'I agree. We\'re all here to support each other. You\'re doing great by being here and sharing.',
    createdAt: '2025-01-27T19:06:00Z',
    isDelivered: true,
    isSeen: true,
    isOwn: false,
    type: 'text' as const,
  },
  {
    id: '6',
    senderId: 'therapist_1',
    senderName: 'Dr. Sarah Johnson',
    senderRole: 'therapist' as const,
    content: 'Let\'s try a quick mindfulness exercise together. Take a deep breath in for 4 counts, hold for 4, and exhale for 6.',
    createdAt: '2025-01-27T19:08:00Z',
    isDelivered: true,
    isSeen: false,
    isOwn: false,
    type: 'text' as const,
  },
];

/**
 * ========================================
 * SUBSCRIPTION & BILLING MOCK DATA
 * ========================================
 */

/**
 * Mock Subscription Plans Data
 * Previously used in ServicesCatalogScreen.tsx
 * Focus: Support Groups Access + Direct Therapist Chat
 * Used as fallback when API is unavailable or for testing
 */
export const mockSubscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic features',
    weeklyPrice: 0,
    monthlyPrice: 0,
    currency: 'UGX',
    isPopular: false,
    isCurrent: true,
    supportGroupsLimit: 0,
    directChatAccess: false,
    features: [
      'Browse support groups',
      'Book appointments (pay-per-use)',
      'Attend events (pay-per-use)',
      'Access wellness resources',
      'Community forum access',
    ],
    badge: 'FREE',
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Join support groups and connect with peers',
    weeklyPrice: 10000,
    monthlyPrice: 35000,
    currency: 'UGX',
    isPopular: false,
    isCurrent: false,
    supportGroupsLimit: 3,
    directChatAccess: false,
    features: [
      'Join up to 3 support groups',
      'Group chat participation',
      'Priority booking for appointments',
      'All Free plan features',
      'Weekly wellness tips',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Full access to groups plus direct therapist chat',
    weeklyPrice: 25000,
    monthlyPrice: 90000,
    currency: 'UGX',
    isPopular: true,
    isCurrent: false,
    supportGroupsLimit: 4,
    directChatAccess: true,
    features: [
      'Join up to 4 support groups',
      'Direct chat with therapist',
      'Priority support 24/7',
      'Crisis intervention access',
      'All Basic plan features',
    ],
    badge: 'MOST POPULAR',
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    description: 'Unlimited groups and premium support',
    weeklyPrice: 40000,
    monthlyPrice: 150000,
    currency: 'UGX',
    isPopular: false,
    isCurrent: false,
    supportGroupsLimit: 'unlimited' as const,
    directChatAccess: true,
    features: [
      'Unlimited support groups',
      'Direct chat with therapist',
      'Dedicated wellness coordinator',
      'Priority crisis support',
      'All Premium plan features',
    ],
  },
];

/**
 * Mock Current Plan Data
 * Previously used in PlansSubscriptionsScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockCurrentPlan = {
  id: 'premium',
  name: 'Premium Plan',
  price: 120000,
  currency: 'UGX',
  billingCycle: 'monthly' as const,
  supportGroupsLimit: 4,
  directChatAccess: true,
};

/**
 * Mock Current Subscription Data
 * Previously used in PlansSubscriptionsScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockCurrentSubscription = {
  id: 'sub_001',
  planId: 'premium',
  planName: 'Premium Plan',
  status: 'active' as const,
  startDate: '2025-01-01',
  endDate: '2026-01-01',
  nextBillingDate: '2025-02-01',
  autoRenew: true,
  groupsJoined: 3,
  groupsLimit: 4,
  directChatActive: true,
};

/**
 * Mock Billing History / Invoices Data
 * Previously used in BillingHistoryScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockInvoices = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    date: '2025-01-27',
    dueDate: '2025-02-01',
    amount: 120000,
    currency: 'UGX',
    status: 'paid' as const,
    paymentMethod: 'WellnessVault',
    description: 'Premium Plan - Monthly Subscription',
    planName: 'Premium Plan',
    billingPeriod: 'Jan 2025',
    downloadUrl: 'https://example.com/invoice-001.pdf',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-012',
    date: '2024-12-27',
    dueDate: '2025-01-01',
    amount: 120000,
    currency: 'UGX',
    status: 'paid' as const,
    paymentMethod: 'WellnessVault',
    description: 'Premium Plan - Monthly Subscription',
    planName: 'Premium Plan',
    billingPeriod: 'Dec 2024',
    downloadUrl: 'https://example.com/invoice-012.pdf',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-011',
    date: '2024-11-27',
    dueDate: '2024-12-01',
    amount: 55000,
    currency: 'UGX',
    status: 'paid' as const,
    paymentMethod: 'Mobile Money',
    description: 'Individual Therapy Session',
    planName: 'Pay Per Session',
    billingPeriod: 'Nov 2024',
    downloadUrl: 'https://example.com/invoice-011.pdf',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-010',
    date: '2024-10-27',
    dueDate: '2024-11-01',
    amount: 120000,
    currency: 'UGX',
    status: 'paid' as const,
    paymentMethod: 'WellnessVault',
    description: 'Premium Plan - Monthly Subscription',
    planName: 'Premium Plan',
    billingPeriod: 'Oct 2024',
    downloadUrl: 'https://example.com/invoice-010.pdf',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-009',
    date: '2024-09-27',
    dueDate: '2024-10-01',
    amount: 85000,
    currency: 'UGX',
    status: 'paid' as const,
    paymentMethod: 'WellnessVault',
    description: 'Family Counseling Session',
    planName: 'Pay Per Session',
    billingPeriod: 'Sep 2024',
    downloadUrl: 'https://example.com/invoice-009.pdf',
  },
  {
    id: '6',
    invoiceNumber: 'INV-2024-008',
    date: '2024-08-27',
    dueDate: '2024-09-01',
    amount: 120000,
    currency: 'UGX',
    status: 'failed' as const,
    paymentMethod: 'Mobile Money',
    description: 'Premium Plan - Monthly Subscription',
    planName: 'Premium Plan',
    billingPeriod: 'Aug 2024',
  },
  {
    id: '7',
    invoiceNumber: 'INV-2025-002',
    date: '2025-01-28',
    dueDate: '2025-02-02',
    amount: 75000,
    currency: 'UGX',
    status: 'pending' as const,
    paymentMethod: 'WellnessVault',
    description: 'Crisis Support Package',
    planName: 'Crisis Support',
    billingPeriod: 'Jan 2025',
  },
];

/**
 * Mock Payment Methods Data
 * Previously used in BillingHistoryScreen.tsx
 * Used as fallback when API is unavailable or for testing
 * NOTE: Backend endpoint for this is MISSING - getPaymentMethods()
 */
export const mockPaymentMethods = [
  {
    id: '1',
    type: 'wellnessvault' as const,
    name: 'WellnessVault',
    details: 'UGX 350,000 available',
    isDefault: true,
  },
  {
    id: '2',
    type: 'mobile_money' as const,
    name: 'Mobile Money',
    details: '**** **** 1234',
    isDefault: false,
  },
];

// ============================================================================
// CHAT & MESSAGING MOCK DATA
// ============================================================================

/**
 * Mock Contacts for New Message Screen
 * Used in: NewMessageScreen.tsx
 * API Endpoint: getTherapists() from therapists.js
 * Note: Clients can only message therapists (not other users)
 */
export const mockNewMessageContacts = [
  {
    id: 'therapist_1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@innerspark.com',
    avatar: require('../assets/images/dummy-people/d-person1.png'),
    type: 'therapist' as const,
    specialty: 'Anxiety & Depression',
    isOnline: true,
  },
  {
    id: 'therapist_2',
    name: 'Dr. Clara Odding',
    email: 'clara.odding@innerspark.com',
    avatar: require('../assets/images/dummy-people/d-person2.png'),
    type: 'therapist' as const,
    specialty: 'Couples Therapy',
    isOnline: false,
    lastSeen: '30 min ago',
  },
  {
    id: 'therapist_3',
    name: 'Dr. Martin Pilier',
    email: 'martin.pilier@innerspark.com',
    avatar: require('../assets/images/dummy-people/d-person1.png'),
    type: 'therapist' as const,
    specialty: 'Group Therapy',
    isOnline: false,
    lastSeen: '2 hours ago',
  },
  {
    id: 'therapist_4',
    name: 'Dr. Emily Carter',
    email: 'emily.carter@innerspark.com',
    avatar: require('../assets/images/dummy-people/d-person2.png'),
    type: 'therapist' as const,
    specialty: 'Trauma & PTSD',
    isOnline: true,
  },
  {
    id: 'therapist_5',
    name: 'Dr. James Mitchell',
    email: 'james.mitchell@innerspark.com',
    avatar: require('../assets/images/dummy-people/d-person1.png'),
    type: 'therapist' as const,
    specialty: 'Mindfulness & Meditation',
    isOnline: false,
    lastSeen: '1 hour ago',
  },
];

// ============================================================================
// DATA DELETION MOCK DATA
// ============================================================================

/**
 * Mock Data Categories for Data Deletion Screen
 * Used in: DataDeletionScreen.tsx (FOR UI REFERENCE ONLY)
 * API Endpoint: deleteUserData(userId, categories) from account.js
 * Note: These are UI templates. Actual counts should come from API.
 * The API does NOT return counts - this is just for UI preservation.
 */
export const mockDataDeletionCategories = [
  {
    id: 'mood_history',
    title: 'Mood Tracking History',
    description: 'All mood entries and emotional patterns',
    icon: 'mood',
    iconColor: '#FF5722',
    itemCount: '', // No mock counts - API doesn't provide this
    selected: false,
    canDelete: true,
    warning: 'This will permanently delete all your mood tracking data',
  },
  {
    id: 'journal_entries',
    title: 'Journal Entries',
    description: 'Personal reflections and notes',
    icon: 'book',
    iconColor: '#9C27B0',
    itemCount: '',
    selected: false,
    canDelete: true,
    warning: 'Your journal entries will be permanently deleted',
  },
  {
    id: 'therapy_notes',
    title: 'Therapy Session Notes',
    description: 'Session records and progress notes',
    icon: 'psychology',
    iconColor: '#4CAF50',
    itemCount: '',
    selected: false,
    canDelete: true,
    warning: 'Therapy session data will be permanently removed',
  },
  {
    id: 'messages',
    title: 'Messages & Conversations',
    description: 'Chat history with therapists',
    icon: 'chat',
    iconColor: '#2196F3',
    itemCount: '',
    selected: false,
    canDelete: true,
    warning: 'All conversation history will be deleted',
  },
  {
    id: 'goals',
    title: 'Wellness Goals',
    description: 'Goals and achievements',
    icon: 'flag',
    iconColor: '#FFC107',
    itemCount: '',
    selected: false,
    canDelete: true,
  },
  {
    id: 'activity_logs',
    title: 'Activity Logs',
    description: 'App usage and activity history',
    icon: 'history',
    iconColor: '#607D8B',
    itemCount: '',
    selected: false,
    canDelete: true,
  },
];

// ============================================================================
// EMERGENCY & SAFETY MOCK DATA
// ============================================================================
// Mock data for emergency contacts and safety plans
// Used as fallback when API endpoints are unavailable or return empty data

/**
 * Mock Emergency Contacts
 * Used in: EmergencyContactsScreen.tsx
 * API Endpoint: getEmergencyContacts(userId)
 */
export const mockEmergencyContacts = [
  {
    id: '1',
    name: 'John Doe',
    relationship: 'Family',
    phone: '+250 788 123 456',
    email: 'john.doe@example.com',
    isPrimary: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    relationship: 'Friend',
    phone: '+250 788 234 567',
    email: 'jane.smith@example.com',
    isPrimary: false,
  },
  {
    id: '3',
    name: 'Dr. Sarah Wilson',
    relationship: 'Therapist',
    phone: '+250 788 345 678',
    email: 'dr.wilson@clinic.com',
    isPrimary: false,
  },
];

/**
 * Mock Crisis Lines
 * Used in: EmergencyContactsScreen.tsx
 * API Endpoint: getCrisisLines(userId)
 */
export const mockCrisisLines = [
  {
    id: '1',
    name: 'National Crisis Line',
    phone: '114',
    description: '24/7 emergency crisis support',
    available24h: true,
    icon: 'phone-in-talk',
    color: '#F44336',
  },
  {
    id: '2',
    name: 'Mental Health Support',
    phone: '+250 788 000 000',
    description: 'Professional mental health counseling',
    available24h: true,
    icon: 'local-hospital',
    color: '#2196F3',
  },
];

/**
 * Mock Safety Plan
 * Used in: SafetyPlanScreen.tsx
 * API Endpoint: getSafetyPlan(userId)
 */
export const mockSafetyPlan = {
  warningSignsPersonal: [
    'Feeling overwhelmed or anxious',
    'Difficulty sleeping',
    'Loss of appetite',
    'Withdrawing from friends and family',
  ],
  warningSignsCrisis: [
    'Thoughts of self-harm',
    'Feeling hopeless',
    'Unable to cope with daily activities',
    'Substance use as coping mechanism',
  ],
  copingStrategies: [
    'Deep Breathing - 4-7-8 technique',
    '5-4-3-2-1 Grounding - Focus on senses',
    'Safe Space Visualization',
    'Progressive Muscle Relaxation',
    'Listen to calming music',
    'Take a warm shower',
    'Write in journal',
    'Go for a walk',
    'Practice mindfulness meditation',
    'Engage in physical exercise',
  ],
  socialContacts: [],
  professionalContacts: [],
  environmentSafety: [
    'Remove harmful objects from immediate environment',
    'Go to a safe, public place',
    'Avoid alcohol and substances',
    'Stay in well-lit, populated areas',
    'Keep emergency numbers accessible',
  ],
  reasonsToLive: [],
  emergencyContacts: [
    { name: 'Emergency Services', phone: '911', available24h: true },
    { name: 'Crisis Lifeline', phone: '988', available24h: true },
    { name: 'Crisis Text Line', phone: '741741', available24h: true },
    { name: 'Mental Health Support', phone: '+256-800-567-890', available24h: true },
  ],
  lastUpdated: new Date().toISOString(),
};

/**
 * Mock Mood Data
 * Used as fallback when API is unavailable or for empty states in mood tracking
 */
export const mockMoodHistory = [
  {
    id: '1',
    date: 'Today',
    mood: 'Happy',
    emoji: '😊',
    color: '#8BC34A',
    moodValue: 4,
    note: 'Had a productive day!',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    date: 'Yesterday',
    mood: 'Neutral',
    emoji: '😐',
    color: '#FFC107',
    moodValue: 3,
    note: '',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    date: '2 days ago',
    mood: 'Amazing',
    emoji: '🤩',
    color: '#4CAF50',
    moodValue: 5,
    note: 'Celebrated a big win!',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    date: '3 days ago',
    mood: 'Happy',
    emoji: '😊',
    color: '#8BC34A',
    moodValue: 4,
    note: '',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
  },
];

export const mockMoodInsights = [
  {
    id: 1,
    title: 'Weekly Progress',
    description: 'Your mood has improved 20% this week',
    icon: 'trending-up',
    color: '#4CAF50',
    type: 'positive'
  },
  {
    id: 2,
    title: 'Best Time',
    description: 'You feel best in the mornings',
    icon: 'wb-sunny',
    color: '#FF9800',
    type: 'info'
  },
  {
    id: 3,
    title: 'Streak',
    description: '5 days of mood tracking!',
    icon: 'local-fire-department',
    color: '#F44336',
    type: 'achievement'
  }
];

export const mockWeekSummary = {
  week: 'This Week',
  moods: [
    { emoji: '😊', count: 3, label: '3 days' },
    { emoji: '🙂', count: 2, label: '2 days' },
    { emoji: '😐', count: 2, label: '2 days' },
  ]
};

/**
 * Mock Wellness Tips Data
 * Used as fallback when API returns null wellness tip
 */
export const mockWellnessTips = [
  {
    id: 'tip_001',
    tip: 'Take 5 deep breaths when you feel anxious',
    category: 'Mindfulness'
  },
  {
    id: 'tip_002',
    tip: 'Practice gratitude by writing down 3 things you\'re thankful for today',
    category: 'Gratitude'
  },
  {
    id: 'tip_003',
    tip: 'Take a 10-minute walk outside to boost your mood',
    category: 'Physical Health'
  },
  {
    id: 'tip_004',
    tip: 'Connect with a friend or loved one today',
    category: 'Social Connection'
  },
  {
    id: 'tip_005',
    tip: 'Limit screen time before bed for better sleep',
    category: 'Sleep Hygiene'
  },
  {
    id: 'tip_006',
    tip: 'Practice self-compassion - treat yourself with kindness',
    category: 'Self-Care'
  },
  {
    id: 'tip_007',
    tip: 'Set small, achievable goals for today',
    category: 'Goal Setting'
  },
  {
    id: 'tip_008',
    tip: 'Take breaks throughout the day to stretch and relax',
    category: 'Stress Management'
  },
];

/**
 * Get random wellness tip
 */
export const getRandomWellnessTip = () => {
  const randomIndex = Math.floor(Math.random() * mockWellnessTips.length);
  return mockWellnessTips[randomIndex];
};

/**
 * Mock Notifications Data
 * Used as fallback when API is unavailable or returns 404
 */
export const mockNotifications = [
  {
    id: 'notif_001',
    title: 'Appointment Reminder',
    message: 'Your session with Dr. Nakato Aisha is scheduled for tomorrow at 2:00 PM',
    type: 'appointment',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    isRead: false,
    avatar: require('../assets/images/dummy-people/d-person1.png'),
    actionData: { therapistId: 1, appointmentId: 'apt_001' }
  },
  {
    id: 'notif_002',
    title: 'Goal Achievement',
    message: 'Congratulations! You completed your daily mindfulness goal',
    type: 'goal',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    isRead: false,
    actionData: { goalId: 3 }
  },
  {
    id: 'notif_003',
    title: 'New Event Available',
    message: 'Mental Health First Aid Training is now open for registration',
    type: 'event',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isRead: true,
    actionData: { eventId: 2 }
  },
  {
    id: 'notif_004',
    title: 'Mood Check-in',
    message: 'How are you feeling today? Take a moment to log your mood',
    type: 'reminder',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    isRead: true,
  },
  {
    id: 'notif_005',
    title: 'System Update',
    message: 'New features added: Enhanced goal tracking and event calendar',
    type: 'system',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    isRead: true,
  },
  {
    id: 'notif_006',
    title: 'Weekly Progress',
    message: 'Your wellness journey this week: 5 goals completed, 2 sessions attended',
    type: 'system',
    timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    isRead: true,
  }
];

/**
 * Mock Therapists Data
 * Used for testing and development
 */
export const mockTherapists = [
  {
    id: 1,
    name: 'Dr. Nakato Aisha',
    specialty: 'Therapist - Specialist',
    rating: 5,
    location: 'Kampala Down Town - 2 km',
    image: require('../assets/images/dummy-people/d-person1.png'),
    reviews: 342,
    experience: '12 years',
    price: 'UGX 60,000',
    priceUnit: '/session',
    available: true,
    bio: 'Specialized in cognitive behavioral therapy and mindfulness techniques.',
    nextAvailable: 'Today 2:00 PM',
  },
  {
    id: 2,
    name: 'Dr. Okello Samuel',
    specialty: 'Therapist',
    rating: 4,
    location: 'Nakawa - 3 km',
    image: require('../assets/images/dummy-people/d-person2.png'),
    reviews: 187,
    experience: '8 years',
    price: 'UGX 50,000',
    priceUnit: '/session',
    available: true,
    bio: 'Expert in anxiety and depression treatment with holistic approach.',
    nextAvailable: 'Tomorrow 10:00 AM',
  },
  {
    id: 3,
    name: 'Dr. Namukasa Grace',
    specialty: 'Counselor',
    rating: 5,
    location: 'Mukono - 10 km',
    image: require('../assets/images/dummy-people/d-person3.png'),
    reviews: 456,
    experience: '15 years',
    price: 'UGX 65,000',
    priceUnit: '/session',
    available: false,
    bio: 'Specializes in trauma therapy and PTSD treatment.',
    nextAvailable: 'Next week',
  },
  {
    id: 4,
    name: 'Dr. Wasswa David',
    specialty: 'Specialist',
    rating: 4,
    location: 'Kampala Central - 5 km',
    image: require('../assets/images/dummy-people/d-person4.png'),
    reviews: 289,
    experience: '10 years',
    price: 'UGX 55,000',
    priceUnit: '/session',
    available: true,
    bio: 'Focused on adolescent mental health and behavioral issues.',
    nextAvailable: 'Today 4:30 PM',
  },
  {
    id: 5,
    name: 'Dr. Nabirye Faith',
    specialty: 'Therapist',
    rating: 5,
    location: 'Ntinda - 4 km',
    image: require('../assets/images/dummy-people/d-person1.png'),
    reviews: 412,
    experience: '11 years',
    price: 'UGX 58,000',
    priceUnit: '/session',
    available: true,
    bio: 'Specializes in family therapy and relationship counseling.',
    nextAvailable: 'Today 3:00 PM',
  },
  {
    id: 6,
    name: 'Dr. Mugisha Patrick',
    specialty: 'Counselor',
    rating: 4,
    location: 'Entebbe - 12 km',
    image: require('../assets/images/dummy-people/d-person2.png'),
    reviews: 156,
    experience: '7 years',
    price: 'UGX 48,000',
    priceUnit: '/session',
    available: true,
    bio: 'Expert in stress management and workplace mental health.',
    nextAvailable: 'Tomorrow 9:00 AM',
  },
  {
    id: 7,
    name: 'Dr. Nansubuga Rebecca',
    specialty: 'Therapist - Specialist',
    rating: 5,
    location: 'Kololo - 3 km',
    image: require('../assets/images/dummy-people/d-person3.png'),
    reviews: 523,
    experience: '14 years',
    price: 'UGX 70,000',
    priceUnit: '/session',
    available: true,
    bio: 'Renowned for treating complex anxiety disorders and phobias.',
    nextAvailable: 'Today 5:00 PM',
  },
  {
    id: 8,
    name: 'Dr. Kato Moses',
    specialty: 'Therapist',
    rating: 4,
    location: 'Bugolobi - 6 km',
    image: require('../assets/images/dummy-people/d-person4.png'),
    reviews: 234,
    experience: '9 years',
    price: 'UGX 52,000',
    priceUnit: '/session',
    available: false,
    bio: 'Specializes in addiction recovery and substance abuse counseling.',
    nextAvailable: 'Monday 2:00 PM',
  },
  {
    id: 9,
    name: 'Dr. Namutebi Sarah',
    specialty: 'Counselor',
    rating: 5,
    location: 'Muyenga - 7 km',
    image: require('../assets/images/dummy-people/d-person1.png'),
    reviews: 378,
    experience: '13 years',
    price: 'UGX 62,000',
    priceUnit: '/session',
    available: true,
    bio: 'Expert in grief counseling and bereavement support.',
    nextAvailable: 'Tomorrow 11:00 AM',
  },
  {
    id: 10,
    name: 'Dr. Ssemakula John',
    specialty: 'Specialist',
    rating: 4,
    location: 'Wandegeya - 4 km',
    image: require('../assets/images/dummy-people/d-person2.png'),
    reviews: 198,
    experience: '8 years',
    price: 'UGX 50,000',
    priceUnit: '/session',
    available: true,
    bio: 'Focuses on youth mental health and academic stress management.',
    nextAvailable: 'Tomorrow 1:00 PM',
  },
];

/**
 * Mock Appointments Data
 * Used for appointments screen
 */
export const mockAppointments = [
  {
    id: '1',
    date: '09/04/2025',
    time: '2:00 PM',
    therapistName: 'Clara Odding',
    therapistType: 'Therapist',
    status: 'upcoming',
    image: require('../assets/images/dummy-people/d-person2.png'),
    location: 'Nakawa - Kampala Uganda',
    sessionType: 'Individual Therapy',
    meetingLink: 'https://meet.innerspark.com/room/clara-123',
    paymentStatus: 'paid',
    amount: 'UGX 45,000',
    timezone: 'EAT (UTC+3)',
  },
  {
    id: '2',
    date: '21/04/2025',
    time: '10:00 AM',
    therapistName: 'Steven Pauliner',
    therapistType: 'Cardiologist',
    status: 'upcoming',
    image: require('../assets/images/dummy-people/d-person1.png'),
    location: 'Kampala Medical Center',
    sessionType: 'Consultation',
    paymentStatus: 'pending',
    amount: 'UGX 60,000',
    timezone: 'EAT (UTC+3)',
  },
  {
    id: '3',
    date: '18/06/2025',
    time: '3:30 PM',
    therapistName: 'Noemi Shinte',
    therapistType: 'Dermatologist',
    status: 'upcoming',
    image: require('../assets/images/dummy-people/d-person3.png'),
    location: 'Skin Care Clinic',
    sessionType: 'Follow-up',
    meetingLink: 'https://meet.innerspark.com/room/noemi-456',
    paymentStatus: 'paid',
    amount: 'UGX 35,000',
    timezone: 'EAT (UTC+3)',
  },
  {
    id: '4',
    date: '15/03/2025',
    time: '11:00 AM',
    therapistName: 'Sarah Johnson',
    therapistType: 'Therapist',
    status: 'completed',
    image: require('../assets/images/dummy-people/d-person1.png'),
    location: 'Mental Health Center',
    sessionType: 'Individual Therapy',
    meetingLink: 'https://meet.innerspark.com/room/sarah-789',
    paymentStatus: 'paid',
    amount: 'UGX 50,000',
    timezone: 'EAT (UTC+3)',
  },
  {
    id: '5',
    date: '08/03/2025',
    time: '4:00 PM',
    therapistName: 'Michael Chen',
    therapistType: 'Therapist',
    status: 'completed',
    image: require('../assets/images/dummy-people/d-person2.png'),
    location: 'Wellness Center',
    sessionType: 'Couples Therapy',
    paymentStatus: 'paid',
    amount: 'UGX 75,000',
    timezone: 'EAT (UTC+3)',
  },
  {
    id: '6',
    date: '28/02/2025',
    time: '1:00 PM',
    therapistName: 'Dr. Martin Pilier',
    therapistType: 'Therapist',
    status: 'cancelled',
    image: require('../assets/images/dummy-people/d-person1.png'),
    location: 'Downtown Clinic',
    sessionType: 'Group Therapy',
    paymentStatus: 'failed',
    amount: 'UGX 30,000',
    timezone: 'EAT (UTC+3)',
  },
];

/**
 * Mock Goals Data
 * Used for goals screen
 */
export const mockGoals = [
  {
    id: 1,
    title: 'Daily Meditation Practice',
    description: 'Meditate for 10 minutes every morning to improve mindfulness and reduce stress',
    status: 'active',
    dueDate: '2024-01-20',
    createdAt: '2024-01-10',
    progress: 75,
    category: 'Mindfulness',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Weekly Therapy Sessions',
    description: 'Attend scheduled therapy sessions to work on anxiety management techniques',
    status: 'active',
    dueDate: '2024-01-15',
    createdAt: '2024-01-01',
    progress: 100,
    category: 'Professional Help',
    priority: 'high',
  },
  {
    id: 3,
    title: 'Mood Tracking Consistency',
    description: 'Log mood daily for 30 days to identify patterns and triggers',
    status: 'completed',
    dueDate: '2024-01-14',
    createdAt: '2023-12-15',
    progress: 100,
    category: 'Self-Awareness',
    priority: 'medium',
  },
  {
    id: 4,
    title: 'Exercise Routine',
    description: 'Complete 30 minutes of physical activity 4 times per week',
    status: 'active',
    dueDate: '2024-01-25',
    createdAt: '2024-01-08',
    progress: 60,
    category: 'Physical Health',
    priority: 'medium',
  },
  {
    id: 5,
    title: 'Social Connection',
    description: 'Reach out to friends or family members at least twice a week',
    status: 'paused',
    dueDate: '2024-01-30',
    createdAt: '2024-01-05',
    progress: 40,
    category: 'Relationships',
    priority: 'low',
  },
  {
    id: 6,
    title: 'Sleep Hygiene Improvement',
    description: 'Establish a consistent bedtime routine and aim for 7-8 hours of sleep',
    status: 'active',
    dueDate: '2024-01-18',
    createdAt: '2024-01-12',
    progress: 85,
    category: 'Lifestyle',
    priority: 'high',
  },
];

/**
 * Mock Weekly Report Data
 * Used for wellness report screens
 */
export const mockWeeklyReport = {
  id: 'report-2024-w12',
  weekStartDate: '2024-03-18',
  weekEndDate: '2024-03-24',
  generatedDate: new Date().toISOString(),
  moodSummary: {
    averageMood: 3.8,
    moodTrend: 'improving',
    totalCheckIns: 6,
    streakDays: 6,
    dominantMood: 'Good',
    moodDistribution: [
      { mood: 'Great', percentage: 33, emoji: '😊' },
      { mood: 'Good', percentage: 50, emoji: '🙂' },
      { mood: 'Okay', percentage: 17, emoji: '😐' },
      { mood: 'Bad', percentage: 0, emoji: '😔' },
      { mood: 'Terrible', percentage: 0, emoji: '😢' },
    ],
  },
  journalingSummary: {
    totalEntries: 6,
    averageLength: 85,
    commonThemes: ['gratitude', 'work stress', 'family time', 'self-care'],
    sentimentScore: 0.72,
    keyInsights: [
      'You expressed more gratitude this week compared to last week',
      'Work stress mentions decreased by 30%',
      'Family time was a recurring positive theme',
    ],
  },
  activitiesSummary: {
    completedActivities: 4,
    recommendedActivities: ['Morning meditation', 'Evening walk', 'Journaling'],
    upcomingGoals: ['Complete 7-day streak', 'Try group therapy session'],
    achievedMilestones: ['6-day mood tracking streak', 'First week of consistent journaling'],
  },
  recommendations: {
    moodBased: [
      'Continue your positive mood trend with morning affirmations',
      'Consider scheduling a therapy session to maintain progress',
    ],
    activityBased: [
      'Try our new mindfulness workshop this weekend',
      'Join a support group to connect with others',
    ],
    therapyRecommendations: [
      'Dr. Sarah Johnson - Specializes in stress management',
      'Group therapy session on Thursdays',
    ],
  },
  pointsEarned: 3500,
  nextReportDate: '2024-03-31',
};

/**
 * Mock Wallet/Vault Data
 * Used for wellness vault screens
 */
export const mockWalletBalance = {
  balance: 85000,
  currency: 'UGX',
  breakdown: {
    momoTopup: 50000,
    rewardPoints: 18000,
    wellnessCredits: 20000,
  },
};

export const mockWalletTransactions = [
  {
    id: 'txn_001',
    type: 'credit',
    description: 'MoMo Top-up',
    amount: 50000,
    currency: 'UGX',
    category: 'Top-up',
    date: '2025-10-25',
    time: '14:30',
    status: 'completed',
    paymentMethod: 'Mobile Money',
    icon: 'add-circle',
  },
  {
    id: 'txn_002',
    type: 'debit',
    description: 'Therapy Session Payment',
    amount: -30000,
    currency: 'UGX',
    category: 'Therapy',
    date: '2025-10-24',
    time: '10:00',
    status: 'completed',
    paymentMethod: 'Wellness Vault',
    icon: 'remove-circle',
  },
  {
    id: 'txn_003',
    type: 'credit',
    description: 'Wellness Credits Received',
    amount: 20000,
    currency: 'UGX',
    category: 'Credits',
    date: '2025-10-23',
    time: '09:15',
    status: 'completed',
    paymentMethod: 'Platform Donation',
    icon: 'volunteer-activism',
  },
  {
    id: 'txn_004',
    type: 'debit',
    description: 'Event Registration',
    amount: -15000,
    currency: 'UGX',
    category: 'Events',
    date: '2025-10-22',
    time: '16:45',
    status: 'completed',
    paymentMethod: 'Wellness Vault',
    icon: 'remove-circle',
  },
  {
    id: 'txn_005',
    type: 'credit',
    description: 'Reward Points Redeemed',
    amount: 5000,
    currency: 'UGX',
    category: 'Rewards',
    date: '2025-10-20',
    time: '11:20',
    status: 'completed',
    paymentMethod: 'Reward Points',
    icon: 'stars',
  },
  {
    id: 'txn_006',
    type: 'debit',
    description: 'Support Group Subscription',
    amount: -25000,
    currency: 'UGX',
    category: 'Subscription',
    date: '2025-10-18',
    time: '13:00',
    status: 'completed',
    paymentMethod: 'Wellness Vault',
    icon: 'remove-circle',
  },
  {
    id: 'txn_007',
    type: 'credit',
    description: 'MoMo Top-up',
    amount: 100000,
    currency: 'UGX',
    category: 'Top-up',
    date: '2025-10-17',
    time: '08:30',
    status: 'completed',
    paymentMethod: 'Mobile Money',
    icon: 'add-circle',
  },
  {
    id: 'txn_008',
    type: 'debit',
    description: 'Appointment Booking',
    amount: -40000,
    currency: 'UGX',
    category: 'Appointment',
    date: '2025-10-11',
    time: '15:00',
    status: 'completed',
    paymentMethod: 'Wellness Vault',
    icon: 'remove-circle',
  },
];

/**
 * Mock Support Tickets Data
 * Used for support ticket screens
 */
export const mockSupportTickets = [
  {
    id: 'TKT-001',
    subject: 'Unable to book therapy session',
    category: 'Technical Issue',
    status: 'Open',
    priority: 'High',
    createdAt: '2025-01-25T10:30:00Z',
    updatedAt: '2025-01-27T14:20:00Z',
    lastResponse: 'We are investigating this issue and will update you soon.',
    responseCount: 3,
    isUnread: true,
  },
  {
    id: 'TKT-002',
    subject: 'Payment not processed correctly',
    category: 'Billing',
    status: 'Pending',
    priority: 'Medium',
    createdAt: '2025-01-23T16:45:00Z',
    updatedAt: '2025-01-26T09:15:00Z',
    lastResponse: 'Please provide your transaction reference number.',
    responseCount: 2,
    isUnread: false,
  },
  {
    id: 'TKT-003',
    subject: 'Add dark mode to the app',
    category: 'Feature Request',
    status: 'Open',
    priority: 'Low',
    createdAt: '2025-01-20T11:20:00Z',
    updatedAt: '2025-01-22T13:30:00Z',
    lastResponse: "Thank you for the suggestion. We'll consider this for future updates.",
    responseCount: 1,
    isUnread: false,
  },
  {
    id: 'TKT-004',
    subject: 'Cannot access my account',
    category: 'Account Problem',
    status: 'Resolved',
    priority: 'Urgent',
    createdAt: '2025-01-18T08:15:00Z',
    updatedAt: '2025-01-19T10:45:00Z',
    lastResponse: 'Your account has been restored. Please try logging in again.',
    responseCount: 4,
    isUnread: false,
  },
  {
    id: 'TKT-005',
    subject: 'Mood tracker not saving data',
    category: 'Technical Issue',
    status: 'Pending',
    priority: 'Medium',
    createdAt: '2025-01-15T14:30:00Z',
    updatedAt: '2025-01-24T16:20:00Z',
    lastResponse: "We've identified the issue and are working on a fix.",
    responseCount: 5,
    isUnread: true,
  },
  {
    id: 'TKT-006',
    subject: 'How to join support groups?',
    category: 'General',
    status: 'Resolved',
    priority: 'Low',
    createdAt: '2025-01-12T09:45:00Z',
    updatedAt: '2025-01-13T11:30:00Z',
    lastResponse: 'Please check our user guide for detailed instructions.',
    responseCount: 2,
    isUnread: false,
  },
];

/**
 * ========================================
 * THERAPIST DASHBOARD MOCK DATA
 * ========================================
 */

/**
 * Mock Therapist Dashboard Stats
 * Used by: THDashboardScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockTherapistDashboardStats = {
  todayAppointments: 5,
  pendingRequests: 3,
  activeGroups: 8,
  unreadMessages: 12,
  totalClients: 45,
  weekAppointments: 24,
  monthAppointments: 96,
};

/**
 * Mock Therapist Appointments
 * Used by: THAppointmentsScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockTherapistAppointments = [
  {
    id: '1',
    clientId: 'client_1',
    clientName: 'John Doe',
    clientAvatar: '👨',
    type: 'Individual Session',
    date: '2026-02-06',
    time: '10:00 AM',
    duration: '60 min',
    status: 'upcoming',
    notes: 'Third session - anxiety management techniques',
  },
  {
    id: '2',
    clientId: 'client_2',
    clientName: 'Sarah Williams',
    clientAvatar: '👩',
    type: 'Follow-up Session',
    date: '2026-02-06',
    time: '2:00 PM',
    duration: '45 min',
    status: 'upcoming',
    notes: 'Review progress on CBT homework',
  },
  {
    id: '3',
    clientId: 'client_3',
    clientName: 'Michael Brown',
    clientAvatar: '👨‍💼',
    type: 'Initial Consultation',
    date: '2026-02-07',
    time: '11:30 AM',
    duration: '60 min',
    status: 'scheduled',
    notes: 'First session - intake assessment',
  },
  {
    id: '4',
    clientId: 'client_4',
    clientName: 'Emily Chen',
    clientAvatar: '👩‍💼',
    type: 'Group Therapy',
    date: '2026-02-07',
    time: '4:00 PM',
    duration: '90 min',
    status: 'scheduled',
    notes: 'Anxiety support group session',
  },
  {
    id: '5',
    clientId: 'client_5',
    clientName: 'David Martinez',
    clientAvatar: '👨‍🦱',
    type: 'Individual Session',
    date: '2026-02-08',
    time: '9:00 AM',
    duration: '60 min',
    status: 'scheduled',
    notes: 'Working on stress management',
  },
  {
    id: '6',
    clientId: 'client_6',
    clientName: 'Lisa Anderson',
    clientAvatar: '👩‍🦰',
    type: 'Follow-up Session',
    date: '2026-02-08',
    time: '1:00 PM',
    duration: '45 min',
    status: 'scheduled',
    notes: 'Depression recovery progress check',
  },
  {
    id: '7',
    clientId: 'client_7',
    clientName: 'James Wilson',
    clientAvatar: '👨‍🦲',
    type: 'Individual Session',
    date: '2026-02-05',
    time: '3:00 PM',
    duration: '60 min',
    status: 'completed',
    notes: 'Completed - discussed trauma processing',
  },
  {
    id: '8',
    clientId: 'client_8',
    clientName: 'Emma Thompson',
    clientAvatar: '👩‍🦳',
    type: 'Group Therapy',
    date: '2026-02-05',
    time: '6:00 PM',
    duration: '90 min',
    status: 'completed',
    notes: 'Mindfulness group - meditation practice',
  },
];

/**
 * Mock Therapist Client Requests
 * Used by: THRequestsScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockTherapistClientRequests = [
  {
    id: 1,
    clientId: 'client_pending_1',
    clientName: 'John Doe',
    clientAvatar: null,
    requestType: 'Chat Session',
    description: 'Seeking support for anxiety management and would like to discuss CBT techniques.',
    timestamp: '2 hours ago',
    urgency: 'medium',
    createdAt: '2026-02-06T10:00:00Z',
  },
  {
    id: 2,
    clientId: 'client_pending_2',
    clientName: 'Jane Smith',
    clientAvatar: null,
    requestType: 'Support Group',
    description: 'Would like to join the depression support group. Currently struggling with motivation.',
    timestamp: '5 hours ago',
    urgency: 'low',
    createdAt: '2026-02-06T07:00:00Z',
  },
  {
    id: 3,
    clientId: 'client_pending_3',
    clientName: 'Mike Johnson',
    clientAvatar: null,
    requestType: 'Chat Session',
    description: 'Urgent: Experiencing panic attacks. Need immediate guidance on coping strategies.',
    timestamp: '30 minutes ago',
    urgency: 'high',
    createdAt: '2026-02-06T11:30:00Z',
  },
  {
    id: 4,
    clientId: 'client_pending_4',
    clientName: 'Amanda Rodriguez',
    clientAvatar: null,
    requestType: 'Initial Consultation',
    description: 'First time seeking therapy. Dealing with work-related stress and burnout.',
    timestamp: '1 day ago',
    urgency: 'medium',
    createdAt: '2026-02-05T12:00:00Z',
  },
  {
    id: 5,
    clientId: 'client_pending_5',
    clientName: 'Robert Lee',
    clientAvatar: null,
    requestType: 'Support Group',
    description: 'Interested in the trauma recovery group. Have been in therapy for 6 months.',
    timestamp: '3 hours ago',
    urgency: 'low',
    createdAt: '2026-02-06T09:00:00Z',
  },
];

/**
 * Mock Therapist Conversations/Chats
 * Used by: THChatsScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockTherapistConversations = [
  {
    id: '1',
    clientId: 'client_1',
    clientName: 'John Doe',
    clientAvatar: '👨',
    lastMessage: 'Thank you for the session today. The breathing exercises really helped!',
    lastMessageTime: '2m ago',
    unreadCount: 2,
    isOnline: true,
    lastSeen: null,
  },
  {
    id: '2',
    clientId: 'client_2',
    clientName: 'Sarah Williams',
    clientAvatar: '👩',
    lastMessage: 'Can we reschedule tomorrow\'s appointment? Something urgent came up.',
    lastMessageTime: '15m ago',
    unreadCount: 1,
    isOnline: true,
    lastSeen: null,
  },
  {
    id: '3',
    clientId: 'client_3',
    clientName: 'Michael Brown',
    clientAvatar: '👨‍💼',
    lastMessage: 'I\'ve been practicing the techniques we discussed. Feeling much better.',
    lastMessageTime: '1h ago',
    unreadCount: 0,
    isOnline: false,
    lastSeen: '30 min ago',
  },
  {
    id: '4',
    clientId: 'client_4',
    clientName: 'Emily Chen',
    clientAvatar: '👩‍💼',
    lastMessage: 'Looking forward to our next session. I have some progress to share.',
    lastMessageTime: '3h ago',
    unreadCount: 0,
    isOnline: false,
    lastSeen: '2 hours ago',
  },
  {
    id: '5',
    clientId: 'client_5',
    clientName: 'David Martinez',
    clientAvatar: '👨‍🦱',
    lastMessage: 'The journal exercise you suggested has been really insightful.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    lastSeen: '1 day ago',
  },
  {
    id: '6',
    clientId: 'client_6',
    clientName: 'Lisa Anderson',
    clientAvatar: '👩‍🦰',
    lastMessage: 'I had a difficult day today. Can we talk?',
    lastMessageTime: '5m ago',
    unreadCount: 3,
    isOnline: true,
    lastSeen: null,
  },
  {
    id: '7',
    clientId: 'client_7',
    clientName: 'James Wilson',
    clientAvatar: '👨‍🦲',
    lastMessage: 'Thanks for the homework assignment. I\'ll work on it.',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    isOnline: false,
    lastSeen: '2 days ago',
  },
];

/**
 * Mock Therapist Support Groups
 * Used by: THGroupsScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockTherapistGroups = [
  {
    id: '1',
    name: 'Anxiety Support Circle',
    description: 'A safe space for individuals dealing with anxiety disorders.',
    icon: '💙',
    memberCount: 24,
    maxMembers: 30,
    nextSession: 'Today, 7:00 PM',
    status: 'active',
    category: 'anxiety',
    createdDate: '2025-11-15',
    isPrivate: false,
  },
  {
    id: '2',
    name: 'Depression Recovery Group',
    description: 'Supporting each other through depression recovery.',
    icon: '🌟',
    memberCount: 18,
    maxMembers: 25,
    nextSession: 'Tomorrow, 6:30 PM',
    status: 'active',
    category: 'depression',
    createdDate: '2025-10-20',
    isPrivate: false,
  },
  {
    id: '3',
    name: 'Trauma Healing Circle',
    description: 'Specialized group for trauma survivors focusing on healing.',
    icon: '🕊️',
    memberCount: 12,
    maxMembers: 15,
    nextSession: 'Saturday, 10:00 AM',
    status: 'scheduled',
    category: 'trauma',
    createdDate: '2025-12-01',
    isPrivate: true,
  },
  {
    id: '4',
    name: 'Mindfulness & Meditation',
    description: 'Practice mindfulness and meditation techniques together.',
    icon: '🕉️',
    memberCount: 20,
    maxMembers: 30,
    nextSession: 'Saturday, 9:00 AM',
    status: 'scheduled',
    category: 'mindfulness',
    createdDate: '2025-09-10',
    isPrivate: false,
  },
  {
    id: '5',
    name: 'Stress Management Workshop',
    description: 'Learn practical strategies to manage stress effectively.',
    icon: '🧘',
    memberCount: 15,
    maxMembers: 20,
    nextSession: 'Next Week',
    status: 'scheduled',
    category: 'stress',
    createdDate: '2026-01-05',
    isPrivate: false,
  },
  {
    id: '6',
    name: 'Social Anxiety Group',
    description: 'Safe space for those dealing with social anxiety.',
    icon: '🤝',
    memberCount: 10,
    maxMembers: 15,
    nextSession: 'Friday, 5:00 PM',
    status: 'active',
    category: 'anxiety',
    createdDate: '2025-11-28',
    isPrivate: false,
  },
];

/**
 * Mock Therapist Clients List
 * Used by: Client management screens
 * Used as fallback when API is unavailable or for testing
 */
export const mockTherapistClients = [
  {
    id: 'client_1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phoneNumber: '+256700000001',
    avatar: '👨',
    status: 'active',
    joinedDate: '2025-09-15',
    lastSessionDate: '2026-02-05',
    totalSessions: 12,
    upcomingSessions: 2,
    diagnosis: ['Generalized Anxiety Disorder', 'Stress Management'],
    assignedGroups: ['Anxiety Support Circle'],
    notes: 'Making excellent progress with CBT techniques. Shows great improvement in managing anxiety triggers.',
  },
  {
    id: 'client_2',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@email.com',
    phoneNumber: '+256700000002',
    avatar: '👩',
    status: 'active',
    joinedDate: '2025-10-20',
    lastSessionDate: '2026-02-04',
    totalSessions: 8,
    upcomingSessions: 1,
    diagnosis: ['Social Anxiety', 'Depression'],
    assignedGroups: ['Depression Recovery Group', 'Social Anxiety Group'],
    notes: 'Actively participating in group therapy. Working on building social connections.',
  },
  {
    id: 'client_3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phoneNumber: '+256700000003',
    avatar: '👨‍💼',
    status: 'active',
    joinedDate: '2026-01-10',
    lastSessionDate: '2026-01-28',
    totalSessions: 3,
    upcomingSessions: 1,
    diagnosis: ['Work-related Stress', 'Burnout'],
    assignedGroups: ['Stress Management Workshop'],
    notes: 'New client. Showing good engagement and openness to therapy process.',
  },
  {
    id: 'client_4',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@email.com',
    phoneNumber: '+256700000004',
    avatar: '👩‍💼',
    status: 'active',
    joinedDate: '2025-11-05',
    lastSessionDate: '2026-02-03',
    totalSessions: 10,
    upcomingSessions: 1,
    diagnosis: ['Panic Disorder', 'Anxiety'],
    assignedGroups: ['Anxiety Support Circle', 'Mindfulness & Meditation'],
    notes: 'Significant reduction in panic attack frequency. Practicing mindfulness daily.',
  },
  {
    id: 'client_5',
    firstName: 'David',
    lastName: 'Martinez',
    email: 'david.martinez@email.com',
    phoneNumber: '+256700000005',
    avatar: '👨‍🦱',
    status: 'active',
    joinedDate: '2025-08-22',
    lastSessionDate: '2026-02-01',
    totalSessions: 15,
    upcomingSessions: 1,
    diagnosis: ['Depression', 'Insomnia'],
    assignedGroups: ['Depression Recovery Group'],
    notes: 'Long-term client showing steady improvement. Sleep patterns have normalized.',
  },
  {
    id: 'client_6',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@email.com',
    phoneNumber: '+256700000006',
    avatar: '👩‍🦰',
    status: 'active',
    joinedDate: '2025-12-01',
    lastSessionDate: '2026-02-02',
    totalSessions: 6,
    upcomingSessions: 1,
    diagnosis: ['Major Depression', 'Low Self-esteem'],
    assignedGroups: ['Depression Recovery Group'],
    notes: 'Building self-confidence gradually. Responding well to cognitive restructuring.',
  },
  {
    id: 'client_7',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phoneNumber: '+256700000007',
    avatar: '👨‍🦲',
    status: 'active',
    joinedDate: '2025-07-15',
    lastSessionDate: '2026-02-05',
    totalSessions: 18,
    upcomingSessions: 0,
    diagnosis: ['PTSD', 'Trauma'],
    assignedGroups: ['Trauma Healing Circle'],
    notes: 'Trauma processing ongoing. Using EMDR therapy with positive results.',
  },
  {
    id: 'client_8',
    firstName: 'Emma',
    lastName: 'Thompson',
    email: 'emma.thompson@email.com',
    phoneNumber: '+256700000008',
    avatar: '👩‍🦳',
    status: 'active',
    joinedDate: '2025-10-10',
    lastSessionDate: '2026-02-05',
    totalSessions: 11,
    upcomingSessions: 0,
    diagnosis: ['General Anxiety', 'Stress'],
    assignedGroups: ['Mindfulness & Meditation', 'Stress Management Workshop'],
    notes: 'Excellent progress with mindfulness practice. Reports feeling more centered.',
  },
  {
    id: 'client_9',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@email.com',
    phoneNumber: '+256700000009',
    avatar: '👨‍🦰',
    status: 'inactive',
    joinedDate: '2025-06-20',
    lastSessionDate: '2025-12-15',
    totalSessions: 20,
    upcomingSessions: 0,
    diagnosis: ['Anxiety', 'Depression'],
    assignedGroups: [],
    notes: 'Completed treatment plan. Moved to maintenance phase. Contact as needed.',
  },
  {
    id: 'client_10',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@email.com',
    phoneNumber: '+256700000010',
    avatar: '👩‍🦱',
    status: 'active',
    joinedDate: '2025-11-20',
    lastSessionDate: '2026-01-30',
    totalSessions: 7,
    upcomingSessions: 2,
    diagnosis: ['Social Anxiety', 'Low Confidence'],
    assignedGroups: ['Social Anxiety Group'],
    notes: 'Working on exposure therapy. Showing courage in facing social situations.',
  },
];

/**
 * Mock Therapist Client Notes
 * Used by: THClientProfileScreen.tsx, THAddClientNoteScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockTherapistClientNotes = [
  {
    id: 'note_1',
    clientId: 'client_1',
    therapistId: 'therapist_1',
    sessionDate: '2026-02-05',
    sessionType: 'Individual Session',
    duration: '60 min',
    notes: 'Client showed significant improvement in managing anxiety triggers. We discussed new coping strategies including deep breathing and progressive muscle relaxation. Client is practicing these techniques daily with good results.',
    mood: 'Positive',
    topics: ['Anxiety Management', 'Coping Strategies', 'Progress Review'],
    homework: 'Practice breathing exercises twice daily. Journal anxiety triggers and responses.',
    nextSession: '2026-02-12',
    createdAt: '2026-02-05T15:30:00Z',
  },
  {
    id: 'note_2',
    clientId: 'client_1',
    therapistId: 'therapist_1',
    sessionDate: '2026-01-29',
    sessionType: 'Individual Session',
    duration: '60 min',
    notes: 'Reviewed homework from last session. Client successfully identified major anxiety triggers. Introduced cognitive restructuring techniques to challenge negative thoughts.',
    mood: 'Neutral',
    topics: ['Cognitive Behavioral Therapy', 'Thought Patterns', 'Homework Review'],
    homework: 'Complete thought record for three anxiety episodes this week.',
    nextSession: '2026-02-05',
    createdAt: '2026-01-29T14:00:00Z',
  },
  {
    id: 'note_3',
    clientId: 'client_2',
    therapistId: 'therapist_1',
    sessionDate: '2026-02-04',
    sessionType: 'Follow-up Session',
    duration: '45 min',
    notes: 'Client reported improved mood this week. Discussed progress in social anxiety group. Working on building confidence for upcoming social event.',
    mood: 'Improving',
    topics: ['Social Anxiety', 'Group Therapy Progress', 'Confidence Building'],
    homework: 'Practice one positive social interaction daily. Continue group attendance.',
    nextSession: '2026-02-11',
    createdAt: '2026-02-04T16:45:00Z',
  },
  {
    id: 'note_4',
    clientId: 'client_3',
    therapistId: 'therapist_1',
    sessionDate: '2026-01-28',
    sessionType: 'Initial Consultation',
    duration: '60 min',
    notes: 'Initial assessment completed. Client experiencing work-related stress and early signs of burnout. Discussed work-life balance and stress management strategies. Client is motivated and engaged.',
    mood: 'Stressed',
    topics: ['Initial Assessment', 'Work Stress', 'Burnout Prevention'],
    homework: 'Keep stress diary for one week. List current coping mechanisms.',
    nextSession: '2026-02-07',
    createdAt: '2026-01-28T12:00:00Z',
  },
  {
    id: 'note_5',
    clientId: 'client_4',
    therapistId: 'therapist_1',
    sessionDate: '2026-02-03',
    sessionType: 'Individual Session',
    duration: '60 min',
    notes: 'Significant progress - client reports only one panic attack this week (down from 5-6). Mindfulness practice is helping. Continue current treatment plan.',
    mood: 'Much Improved',
    topics: ['Panic Disorder', 'Mindfulness', 'Treatment Progress'],
    homework: 'Daily mindfulness meditation. Use panic management techniques as needed.',
    nextSession: '2026-02-10',
    createdAt: '2026-02-03T17:30:00Z',
  },
];

/**
 * Mock Therapist Notifications
 * Used by: THNotificationsScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockTherapistNotifications = [
  {
    id: '1',
    type: 'appointment',
    title: 'New Appointment Booked',
    message: 'John Doe has booked a session for tomorrow at 10:00 AM',
    timestamp: '10 minutes ago',
    isRead: false,
    actionUrl: 'THAppointmentDetailsScreen',
    actionParams: { appointmentId: '123' },
    icon: 'calendar-today',
    color: '#4CAF50',
    createdAt: '2026-02-06T11:50:00Z',
  },
  {
    id: '2',
    type: 'request',
    title: 'New Client Request',
    message: 'Mike Johnson is requesting an urgent chat session',
    timestamp: '30 minutes ago',
    isRead: false,
    actionUrl: 'THRequestsScreen',
    actionParams: {},
    icon: 'person-add',
    color: '#FF9800',
    createdAt: '2026-02-06T11:30:00Z',
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    message: 'Sarah Williams: "Can we reschedule tomorrow\'s appointment?"',
    timestamp: '1 hour ago',
    isRead: false,
    actionUrl: 'THChatConversationScreen',
    actionParams: { clientId: 'client_2' },
    icon: 'message',
    color: '#2196F3',
    createdAt: '2026-02-06T11:00:00Z',
  },
  {
    id: '4',
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'You have a session with Emily Chen at 4:00 PM today',
    timestamp: '2 hours ago',
    isRead: true,
    actionUrl: 'THAppointmentDetailsScreen',
    actionParams: { appointmentId: '124' },
    icon: 'notifications',
    color: '#9C27B0',
    createdAt: '2026-02-06T10:00:00Z',
  },
  {
    id: '5',
    type: 'group',
    title: 'Group Session Starting Soon',
    message: 'Anxiety Support Circle session starts in 30 minutes',
    timestamp: '3 hours ago',
    isRead: true,
    actionUrl: 'THGroupDetailsScreen',
    actionParams: { groupId: '1' },
    icon: 'people',
    color: '#607D8B',
    createdAt: '2026-02-06T09:00:00Z',
  },
  {
    id: '6',
    type: 'message',
    title: 'New Messages (3)',
    message: 'Lisa Anderson has sent you 3 new messages',
    timestamp: '5 hours ago',
    isRead: true,
    actionUrl: 'THChatConversationScreen',
    actionParams: { clientId: 'client_6' },
    icon: 'message',
    color: '#2196F3',
    createdAt: '2026-02-06T07:00:00Z',
  },
  {
    id: '7',
    type: 'appointment',
    title: 'Session Completed',
    message: 'Your session with James Wilson has been marked as completed',
    timestamp: '1 day ago',
    isRead: true,
    actionUrl: null,
    actionParams: {},
    icon: 'check-circle',
    color: '#4CAF50',
    createdAt: '2026-02-05T16:00:00Z',
  },
  {
    id: '8',
    type: 'system',
    title: 'Weekly Summary Available',
    message: 'Your weekly performance summary is ready to view',
    timestamp: '1 day ago',
    isRead: true,
    actionUrl: 'THAnalyticsScreen',
    actionParams: {},
    icon: 'assessment',
    color: '#00BCD4',
    createdAt: '2026-02-05T09:00:00Z',
  },
  {
    id: '9',
    type: 'request',
    title: 'Support Group Request',
    message: 'Jane Smith wants to join Depression Recovery Group',
    timestamp: '2 days ago',
    isRead: true,
    actionUrl: 'THRequestsScreen',
    actionParams: {},
    icon: 'group-add',
    color: '#FF9800',
    createdAt: '2026-02-04T14:00:00Z',
  },
  {
    id: '10',
    type: 'appointment',
    title: 'Appointment Cancelled',
    message: 'Michael Brown has cancelled the appointment on Feb 10',
    timestamp: '2 days ago',
    isRead: true,
    actionUrl: null,
    actionParams: {},
    icon: 'cancel',
    color: '#F44336',
    createdAt: '2026-02-04T10:30:00Z',
  },
  {
    id: '11',
    type: 'message',
    title: 'New Message',
    message: 'David Martinez: "The journal exercise has been helpful"',
    timestamp: '3 days ago',
    isRead: true,
    actionUrl: 'THChatConversationScreen',
    actionParams: { clientId: 'client_5' },
    icon: 'message',
    color: '#2196F3',
    createdAt: '2026-02-03T15:00:00Z',
  },
  {
    id: '12',
    type: 'group',
    title: 'New Group Member',
    message: 'Robert Taylor joined Mindfulness & Meditation group',
    timestamp: '3 days ago',
    isRead: true,
    actionUrl: 'THGroupDetailsScreen',
    actionParams: { groupId: '4' },
    icon: 'person-add',
    color: '#9C27B0',
    createdAt: '2026-02-03T11:00:00Z',
  },
];

/**
 * Mock Therapist Profile
 * Used by: THAccountScreen.tsx
 * Used as fallback when API is unavailable or for testing
 */
export const mockTherapistProfile = {
  id: '52863268761',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@innerspark.com',
  phoneNumber: '+256700000000',
  avatar: require('../assets/images/dummy-people/d-person1.png'),
  specialization: ['Anxiety Disorders', 'Depression', 'Cognitive Behavioral Therapy', 'Trauma & PTSD'],
  licenseNumber: 'PSY-UG-12345',
  yearsExperience: 8,
  education: 'PhD in Clinical Psychology, Makerere University',
  bio: 'Experienced therapist specializing in anxiety and depression treatment using evidence-based approaches. Passionate about helping clients develop resilience and achieve their mental health goals.',
  languages: ['English', 'Luganda', 'Swahili'],
  availability: {
    monday: ['09:00-17:00'],
    tuesday: ['09:00-17:00'],
    wednesday: ['09:00-17:00'],
    thursday: ['09:00-17:00'],
    friday: ['09:00-15:00'],
    saturday: [],
    sunday: [],
  },
  rating: 4.8,
  totalReviews: 124,
  totalClients: 45,
  activeSince: '2018-03-15',
};
