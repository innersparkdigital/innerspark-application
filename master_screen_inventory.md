# Master Screen Inventory - Responsive Scaling

This document provides a comprehensive inventory of all screens in the Innerspark application and their current responsive scaling status.

## Status Legend
- ✅ **Scaled**: `scale()` and `moderateScale()` applied; verified.
- 🟡 **Partial**: Some scaling applied, but needs audit/refinement.
- ❌ **Unscaled**: Hardcoded dimensions and font sizes detected.
- 🔘 **Audit Pending**: Not yet inspected.
- ⚪ **N/A**: Dev tools, templates, or legacy files to be ignored.

---

## 🏠 Root Screens (`src/screens/*.tsx`)

| Screen | Status | Notes |
| :--- | :--- | :--- |
| `HomeScreen.tsx` | ✅ | Extensively scaled. |
| `TherapistsScreen.tsx` | ✅ | Extensively scaled. |
| `MoodScreen.tsx` | ✅ | Scaled. |
| `MeditationsScreen.tsx` | ✅ | Scaled. |
| `GoalsScreen.tsx` | ✅ | Scaled. |
| `EventsScreen.tsx` | ✅ | Scaled. |
| `AccountScreen.tsx` | ✅ | Scaled. |
| `NotificationScreen.tsx` | ✅ | Scaled. |
| `AboutAppScreen.tsx` | ❌ | Unscaled (hardcoded fonts/paddings). |
| `ChatScreen.tsx` | ❌ | Unscaled header/tabs. |
| `GroupsScreen.tsx` | ❌ | Unscaled header/tabs/fonts. |
| `EmergencyScreen.tsx` | ✅ | Scaled. |
| `HelpCenterScreen.tsx` | ❌ | Unscaled fonts/paddings. |
| `NotificationDetailScreen.tsx` | ✅ | Scaled. |
| `ServicesScreen.tsx` | ❌ | Unscaled header/tabs. |
| `DevTestScreen.js` | ⚪ | Dev tool. |
| `TestScreen.js` | ⚪ | Dev tool. |

---

## 📂 Feature Modules (`src/screens/feature/*`)

### Auth & Onboarding
| Screen | Status | Module |
| :--- | :--- | :--- |
| `SigninScreen.js` | ✅ | `authScreens` |
| `SignupScreen.js` | ✅ | `signupScreens` |
| `SigninOTPScreen.js` | ✅ | `authScreens` |
| `YoAvatarScreen.js` | 🔘 | `authScreens` |
| `WelcomeStarterScreen.js` | ✅ | `starterScreens` |
| `AppIntroSliderScreen.js` | ✅ | `sliderScreens` |
| `VerifyEmailScreen.js` | ✅ | `verificationScreens` |
| `VerifyPhoneScreen.js` | ✅ | `verificationScreens` |
| `VerifyAppVersionScreen.js` | ✅ | `verificationScreens` |

### Password Reset
| Screen | Status | Module |
| :--- | :--- | :--- |
| `PasswordResetScreen.js` | ✅ | `passwordResetScreens` |
| `NewPasswordScreen.js` | ✅ | `passwordResetScreens` |
| `PasswordResetOTPScreen.js` | ✅ | `passwordResetScreens` |

### Chat & Messaging
| Screen | Status | Module |
| :--- | :--- | :--- |
| `ConversationsListScreen.tsx` | ✅ | Scaled. |
| `DMThreadScreen.tsx` | 🔘 | Audit pending. |
| `GroupInfoScreen.tsx` | 🔘 | Audit pending. |
| `MyGroupChatsListScreen.tsx` | 🔘 | Audit pending. |
| `NewMessageScreen.tsx` | 🔘 | Audit pending. |
| `TherapistProfileViewScreen.tsx` | 🔘 | Audit pending. |

### Goals
| Screen | Status | Module |
| :--- | :--- | :--- |
| `CreateGoalScreen.tsx` | ✅ | Scaled. |
| `GoalDetailScreen.tsx` | ✅ | Scaled. |

### Emergency & Safety
| Screen | Status | Module |
| :--- | :--- | :--- |
| `PanicButtonScreen.tsx` | ✅ | Scaled. |
| `EmergencyLandingScreen.tsx` | 🔘 | Audit pending. |
| `SafetyPlanScreen.tsx` | 🔘 | Audit pending. |

### Profile & Settings
| Screen | Status | Module |
| :--- | :--- | :--- |
| `ProfileScreen.tsx` | ✅ | Scaled. |
| `ProfileUpdateScreen.tsx` | ✅ | Scaled. |
| `SettingsScreen.tsx` | ✅ | `settingScreens` |
| *All setting sub-screens* | ✅ | `settingScreens` |

### Services & Billing
| Screen | Status | Module |
| :--- | :--- | :--- |
| `ServicesCatalogScreen.tsx` | ✅ | Scaled. |
| `PlansSubscriptionsScreen.tsx` | ✅ | Scaled. |
| `BillingHistoryScreen.tsx` | ✅ | Scaled. |
| `SubscriptionCheckoutScreen.tsx` | ✅ | Scaled. |

### Reports
| Screen | Status | Module |
| :--- | :--- | :--- |
| `ReportDetailScreen.tsx` | 🔘 | `reportScreens` |
| `WeeklyReportScreen.tsx` | 🔘 | `reportScreens` |

### Wellness Vault (Transactions)
| Screen | Status | Module |
| :--- | :--- | :--- |
| `WellnessVaultScreen.tsx` | ✅ | `vaultScreens` |
| `TransactionHistoryScreen.tsx` | ✅ | `vaultScreens` |
| `TransactionDetailScreen.tsx` | ✅ | `vaultScreens` |
| `MoMoTopupScreen.tsx` | ✅ | `vaultScreens` |

### Support Tickets
| Screen | Status | Module |
| :--- | :--- | :--- |
| `MyTicketsScreen.tsx` | ✅ | `supportTicketScreens` |
| `CreateTicketScreen.tsx` | ✅ | `supportTicketScreens` |
| `TicketDetailScreen.tsx` | ✅ | `supportTicketScreens` |

### Therapist (User Facing)
| Screen | Status | Module |
| :--- | :--- | :--- |
| `TherapistDetailScreen.tsx` | ✅ | `therapistScreens` |
| `AppointmentsScreen.tsx` | ✅ | `therapistScreens` |
| `AppointmentDetailsScreen.tsx` | ✅ | `therapistScreens` |
| `BookingCheckoutScreen.tsx` | ✅ | `therapistScreens` |
| `BookingConfirmationScreen.js` | ✅ | `therapistScreens` |
| `DonateToTherapistScreen.tsx` | ✅ | `therapistScreens` |
| `TherapistMatchingQuizScreen.tsx` | ✅ | `therapistScreens` |
| `TherapistSuggestionsScreen.tsx` | ✅ | `therapistScreens` |
| `PostSessionFeedbackScreen.tsx` | 🔘 | `therapistScreens` |

### Therapist Dashboard (Professional Facing)
| Screen | Status | Module |
| :--- | :--- | :--- |
| `THDashboardScreen.tsx` | ✅ | `therapistDashboardScreens` |
| `THAccountScreen.tsx` | ✅ | `therapistDashboardScreens` |
| `THAppointmentsScreen.tsx` | ✅ | `therapistDashboardScreens` |
| `THChatsScreen.tsx` | 🔘 | `therapistDashboardScreens` |
| `THEventsScreen.tsx` | ✅ | `therapistDashboardScreens` |
| `THGroupsScreen.tsx` | ✅ | `therapistDashboardScreens` |
| `THNotificationsScreen.tsx` | ✅ | `therapistDashboardScreens` |
| `THRequestsScreen.tsx` | ✅ | `therapistDashboardScreens` |

---

## 🧹 Legacy & Cleanup (`-OLD`, `-Template`, etc.)
- `chatScreens/ClientGroupChatScreen-OLD.tsx` ⚪
- `chatScreens/GroupMessagesViewScreen-OLD.tsx` ⚪
- `emergencyScreens/SafetyPlanScreen-OLD.tsx` ⚪
- `groupScreens/GroupChatScreen-OLD.tsx` ⚪
- `profileScreens/ProfileInfoScreen-Template.js` ⚪
- `servicesScreens/ServicesCatalogScreen-OLD.tsx` ⚪
