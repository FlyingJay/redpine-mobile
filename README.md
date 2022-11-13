# Installation

- `npm install -g yarn` to install yarn, if you don't have it
- `yarn install` to install nodeJS dependencies
- `cp environment.example.js environments/your-envrionment.js` to create your environment file (see `Environments` below for more details)


## iOS Installation

- `cd ios && pod install` to install iOS dependencies
- `open ios/redpine.xcworkspace` to open the project in Xcode.  Then just build for your device.
- *Make sure you follow the instructions below in `Environments`*

# Environments

- Keep your environment files in `/environments/env-name.js`
- To swap the environments, use `npm run set-env {env-name}`.  All this does is copy `./environments/env-name.js` to `./environment.js`


# Release

## iOS

1. `npm run set-env {your env}` (set your deploy environment properly)
2. `npm run bundle-ios` (bundle the app for release)
3. `open ios/redpine.xcworkspace`
4. Remove problematic linked frameworks / libs (see notes below, don't commit this)
5. Bump build number
6. Archive & upload

## Android

1. `npm run set-env {your env}` (set your deploy environment properly)
2. Increment build numbers in `android/app/build.gradle` and `android/app/src/main/AndroidManifest.xml`
3. `cd android && ./gradlew assembleRelease` to build.  See the following sections for debugging errors
4. Sign the build.  Connor has a bash script for this and the signing keys.. this could be made simpler using fastlane or something.
5. Release signed build.

### Multidex Error

For `./gradlew assembleRelease`, you may encounter the following error:

```
Could not resolve all files for configuration ':app:releaseRuntimeClasspath'.
> Could not find com.android.support:multidex:28.0.0.
```

To fix this, edit `node_modules/react-native-firebase/android/build.gradle` and delete the line `multiDexEnabled true`.  If there are any other references to `multiDex`, delete those too.

### Duplicate Resources Error

For `./gradlew assembleRelease`, you may encounter the following error:

```
* What went wrong:
Execution failed for task ':app:mergeReleaseResources'.
``` 

[This fix](https://github.com/facebook/react-native/issues/22234#issuecomment-437812451) worked for me.

### RN Square POS AAPT2 error

If you get something like this during compilation, go to `node_modules/react-native-square-pos/android/build.gradle` and change `compileSdkVersion`, `buildToolsVersion` and `targetSdkVersion` to `28` and `28.0.3`.

### 

For `./gradle installDebug`, you may encounter the following error:

```
A problem occurred configuring project ':react-native-screens'.
> Could not get unknown property 'javaCompileProvider' for object of type com.android.build.gradle.internal.api.LibraryVariantImpl.
```

[This fix](https://github.com/kmagiera/react-native-reanimated/issues/315#issuecomment-503916860) worked for me.


# Notes

- `gradlew` (Android build tool) relies on `./bin/node` being a NodeJS executable.  Either symlink or drop a node executable there.
- `/environment.js` must exist
- For some reason linked libs need to be removed to archive the build, but added to build local.  The libs are: libRCTWebsockets.a libRCTPushNotications.a, libRCTNetwork.a, libRCTAnimation.a, libRCTActionSheet.a.  There's a patch that can apply these changes when needed: `git apply environments/ios-release-patch.diff` 


# Push Notification format

## ShowHub

To launch showhub, send the following:

```
{
	"type": "SHOW_HUB",
	"showId": "328",
	"route": "showChat" 
}
```

`route` is optional and can be one of `showInfo`, `whosHere`, `readyToPlay`, `ticketsMerch`, `showChat`, `documents`
