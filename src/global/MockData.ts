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
