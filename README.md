# Ianel Card

A static personal card packaged for Android with Ionic CLI and Capacitor.

## Build an APK on Windows

Requirements: Node.js 22+, JDK 21, Android SDK platform 36 and build tools 36.0.0.
Set `JAVA_HOME` to your JDK 21 directory and `ANDROID_HOME` to your Android SDK.

```powershell
npm ci
npm run android:apk
```

The debug APK is generated at `android/app/build/outputs/apk/debug/app-debug.apk`.
Install it on a connected device with:

```powershell
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Edit the root HTML/CSS/JS and assets, then rebuild. `ionic build` copies web assets
to `www`; Capacitor sync copies them into Android. QR codes and the portrait load
offline. External profile destinations and Google Fonts require internet access;
system fonts are used when Google Fonts cannot load.

This is a debug build for local installation. A store release needs a release
signing key and a signed release build. Keep signing keys out of Git.

`npm audit --omit=dev` passes. The Ionic CLI development dependency tree currently
has audit findings; those Node packages are not included in the Android APK.
