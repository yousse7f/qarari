# PickWise

**PickWise** is a comprehensive decision-making app built with **React Native** and **Expo** that helps users make better choices through structured comparison and analysis.

## 🎯 Key Features

### Decision Framework
- Create decisions with custom titles and descriptions  
- Add multiple options to compare (jobs, purchases, life choices, etc.)  
- Define personalized criteria that matter to your decision  

### 📊 Smart Rating System
- Rate each option (1–10) against your defined criteria  
- Automatic score calculation and ranking  
- Visual breakdown showing why each option scored as it did  

### 🤖 AI-Powered Insights
- Generate intelligent analysis using **Google's Gemini AI**  
- Get explanations for why certain options ranked higher  
- Receive recommendations on whether more consideration is needed  

### 📱 Full-Featured Experience
- Beautiful, production-ready UI with dark/light themes  
- Bilingual support (English/Arabic) with RTL layout  
- Persistent local storage for all decisions  
- Edit and update existing decisions  
- Share results with others  

### 🎨 Modern Design
- Clean, intuitive interface with smooth animations  
- Responsive design for all screen sizes  
- Professional styling with thoughtful micro-interactions  
- Apple-level design aesthetics  

## 🚀 How It Works

The app guides users through a **3-step process**:
1. **Define** the decision and add options  
2. **Set** criteria important to you  
3. **Rate** everything to get data-driven recommendations  

Perfect for important life decisions like job offers, major purchases, or any choice with multiple factors to consider.

# 📦 Exporting PickWise for Android and iOS

To export your **PickWise** app for Android and iOS, follow these steps:

## ✅ Prerequisites

Install Expo CLI globally:

```bash
npm install -g @expo/cli
```

## Create an Expo account at expo.dev

Development Builds (Recommended)

## Install EAS CLI:

```bash
npm install -g eas-cli
```
### Login to Expo:

```bash
eas login
```

### Configure EAS Build:

```bash
eas build:configure
```

### Build for Android:

```bash
eas build --platform android
```

### Build for iOS:

```bash
eas build --platform ios
```

## For Standalone APK (Android Only)

```bash
eas build --platform android --profile preview
```

## For App Store / Play Store Distribution

### Production builds for both platforms:

```bash
eas build --platform all --profile production
```

## Alternative: Local Development

If you prefer to work with native code locally:
	
### Eject the project:

```bash
npx expo eject
```

### Open the project:

- **For Android**: Open the project in Android Studio  
- **For iOS**: Open the `.xcworkspace` file in Xcode

## Notes 

-  iOS builds require an Apple Developer Account ($99/year)
-  Android builds can be tested immediately with APK files
-  EAS Build handles the complex native compilation process
-  PickWise uses Expo SDK 52, which is fully compatible with EAS Build
-  Once builds are complete, they will be available in your Expo dashboard for download or distribution
