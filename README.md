# Innerspark Mobile App

This repository contains the **React Native mobile application** for Innerspark. The app is the **frontend client** for delivering mental health and wellness services to end users.

> ⚠️ Note: Backend (therapist/admin dashboards, APIs, payments logic) lives in a **separate repository**.


## 📱 App Features

* **User account & authentication**
* **Therapy booking** with smart matching and MoMo/loyalty/donation payments
* **Mood tracking** (emoji check-ins, journaling, insights)
* **Support groups** (calendar + in-app video sessions)
* **Weekly wellness report** (in-app + email delivery)
* **Quick help button** for emergency contact or calming support
* **WellnessVault**: integrated loyalty + MoMo + donation balance


## 🛠️ Tech Stack

* React Native (Bare Workflow)
* React Navigation
* Redux Toolkit / Context API
* Native modules for Android/iOS integration
* MTN MoMo API (payments)
* Google Meet API (video sessions)
* Firebase / Notifee (notifications)


## 🚀 Development Setup

### Prerequisites

* Node.js ≥ 18
* React Native CLI
* Android Studio + SDK
* Xcode (for iOS builds, macOS required)
* Java JDK 17+
* CocoaPods (for iOS dependencies)

### Installation

```bash
git clone https://github.com/innerspark/innerspark-mobile.git
cd innerspark-mobile
npm install

# iOS only
cd ios && pod install && cd ..
```

### Running

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```


## 📂 Structure

```
src/
 ├── screens/      # App screens
 ├── components/   # Reusable UI components
 ├── navigation/   # Navigation setup
 ├── services/     # API integrations
 └── assets/       # Icons, fonts, images
```


## 🔒 Notes

* Do not expose this repo publicly.
* Environment variables for API keys, MoMo integration, and Firebase are managed via `.env` (not checked into git).
* Sync with the **backend repo** for API updates and endpoints.



## 👥 Internal Contribution

1. Create a feature branch: `feature/<name>`
2. Commit and push your changes
3. Open a PR for review before merging into `develop`
4. Main → production release branch


