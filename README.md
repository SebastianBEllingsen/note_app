# Notes App

A mobile app for creating and sharing notes, built as a university project using React Native (Expo) and Supabase. You can write notes, attach photos, and get push notifications when someone else posts something.

## What it does

- Sign up / log in with email and password
- Create, edit, and delete notes, optionally with an image attached
- Take photos or record video with the camera, or just pick something from your gallery
- Set up your profile with a username and avatar
- Get a push notification when another user creates a note

## The Stack used

- React Native + Expo SDK 54
- Expo Router for navigation (file-based)
- Supabase for the database, auth, file storage, and edge functions
- Push notifications via Expo Notifications + a Supabase Edge Function written in Deno
- TypeScript

## Getting started

You'll need Node.js v18+, and a Supabase project set up.

```
npm install -g eas-cli
npm install
```

Create a `.env` file at the project root with your Supabase credentials (find these under Settings then API in your Supabase dashboard):

.env
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase setup

Youl need to create these tables and buckets in your Supabase project:

**Tables:**
- `notes` — `id`, `title`, `content`, `imageUrl`, `user_id`, `created_at`, `updated_at`
- `profiles` — `id`, `username`, `avatar_url`, `push_token`, `email`

**Storage buckets** (both public):
- `images` — for note attachments
- `avatars` — for profile pictures

**Edge function:**
- Deploy `supabase/functions/notify-new-note/` — this sends push notifications whenever a new note is created

## Running locally

```bash
npx expo start          # start the dev server
npx expo run:android    # open on Android emulator
npm run ios        # open on iOS simulator
npm run web        # open in browser
```
I exclusively used "npx expo:android"
some functionalitty like the push notifications doesnt always work with expo start, and ios you need a mac to emulate, unless using expo go app.

## Building an APK

The project uses [EAS Build](https://docs.expo.dev/build/introduction/). To build locally without uploading to Expo's servers:

```bash
eas login
eas build --platform android --profile preview --local
```

This produces an `.apk` you can sideload directly onto a device or emulator:
this is because there is limiting on the expo site when builing, which makes you have to wait for queing,

```bash
adb install path/to/app.apk
```
this lets you push/install the package directly on to your android emulator, this is bundled in with the android studio program. adb is "Android Debug Bridge".

## Project structure

```
note_app/
├── app/                    # Screens (Expo Router file-based routing)
│   ├── login.tsx           # Login / sign-up screen
│   └── (tabs)/
│       ├── index.tsx       # Home screen
│       ├── notes.tsx       # Notes list
│       ├── account.tsx     # User profile
│       └── (pages)/
│           ├── newnote.tsx     # Create note
│           ├── editnote.tsx    # Edit note
│           ├── camera.tsx      # Camera (photo & video)
│           └── cameraroll.tsx  # Image picker
├── components/             # Reusable UI components
├── providers/              # Auth context provider
├── storage/                # Notes CRUD (Supabase queries)
├── utils/                  # Supabase client, notifications, image upload
├── supabase/functions/     # Deno edge function for push notifications
└── assets/                 # Icons, images, splash screen
```


## Tests

```bash
npm test __testname__
```
