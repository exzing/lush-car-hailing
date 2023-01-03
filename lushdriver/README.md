# lushdriver

Pls follow these steps to run the app:

1. Clone the repo and run npm install or yarn from the root of the project folder.
2. This app requires the Google Map API key work. So Create an API Key from the google cloud console (https://console.cloud.google.com/apis/credentials). Create a file named env.js then add the API Key to the env.js file:
   export const keys = {
   GOOGLE_MAP_APIKEY: 'AIzaSyDNaKE-KYiemHsLIWpjRaZ8MpkZ7T3TkHE',
   };
   This file is added to the .gitignore file to prevent checking it into version control.

3. For the android app navigate to this folder and add your API Key there:
   ~/lush-car-hailing/lushdriver/android/app/src/main/AndroidManifest.xml
   <application>
   <meta-data android:name="com.google.android.geo.API_KEY" android:value="GOOGLE_MAP_API_KEY"/>
   </application>

4. For the ios app navigate to this folder and add your API Key there:
   ~/lushdriver/ios/lushdriver/AppDelegate.mm

   @implementation AppDelegate

   - (BOOL)application:(UIApplication _)application didFinishLaunchingWithOptions:(NSDictionary _)launchOptions
     {
     [GMSServices provideAPIKey:@"GOOGLE_MAP_API_KEY"];

   }

5. Run cd ios && pod-install to build the app for ios and then run npx react-native run-ios to launch the app on ios emulator
6. Run npx react-native run-android to build and run the app on android emulator.
