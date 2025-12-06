1. There were no steps about Android setup or iOS setup.

> Starting project at /Users/santoshvenkatraman/Personal/Coding/expo-riments
React Compiler enabled
Starting Metro Bundler
Failed to resolve the Android SDK path. Default install location not found: /Users/santoshvenkatraman/Library/Android/sdk. Use ANDROID_HOME to set the Android SDK location.
Failed to resolve the Android SDK path. Default install location not found: /Users/santoshvenkatraman/Library/Android/sdk. Use ANDROID_HOME to set the Android SDK location.
Error: spawn adb ENOENT
Error: spawn adb ENOENT
    at Process.ChildProcess._handle.onexit (node:internal/child_process:285:19)
    at onErrorNT (node:internal/child_process:483:16)
    at processTicksAndRejections (node:internal/process/task_queues:89:21)

Solution: 

Root Cause Analysis
Based on my investigation, here's what I found:

Root Cause:

❌ ANDROID_HOME environment variable is not set
❌ ANDROID_SDK_ROOT environment variable is not set
❌ adb (Android Debug Bridge) is not in PATH
❌ Android SDK directory does not exist at the default location (~/Library/Android/sdk)
This is an Expo/React Native project, and the error occurs because the Android SDK is either not installed or not properly configured on your system.

Proposed Solutions
Solution 1: Use Expo Go (Recommended - Quickest)
If you just want to test your app quickly without setting up the full Android development environment:

Install Expo Go on your Android device from the Play Store
Run the development server without targeting Android:
bash
npm start
Scan the QR code with the Expo Go app on your phone
This avoids needing the Android SDK entirely for development.

Solution 2: Install Android Studio & Configure SDK (Full Setup)
If you need to run Android emulators or build production apps:

Step 1: Install Android Studio
bash
brew install --cask android-studio
Step 2: Set up Android SDK through Android Studio
Open Android Studio
Go through the setup wizard (it will download the SDK)
Go to Preferences → Appearance & Behavior → System Settings → Android SDK
Note the SDK location (usually /Users/santoshvenkatraman/Library/Android/sdk)
Install required components:
Android SDK Platform (latest)
Android SDK Build-Tools
Android Emulator
Step 3: Configure environment variables
Add these lines to your ~/.zshrc file:

bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
Step 4: Apply the changes
bash
source ~/.zshrc
Step 5: Verify installation
bash
adb version
Solution 3: Use iOS Simulator Instead
If you have a Mac and Xcode installed:

bash
npm run ios
This will launch your app in the iOS Simulator without needing Android setup.