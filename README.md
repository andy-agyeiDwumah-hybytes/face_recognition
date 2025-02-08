# Face Recognition Authentication Project

This project is a simple React application that uses Firebase Authentication and
 Cloud Firestore for storing user and face recognition data. It leverages
  [face-api.js](https://github.com/justadudewhohacks/face-api.js) to perform
   face detection and recognition.

## Features

- **Email/Password Authentication:** Users can sign up and log in using Firebase Authentication.
- **Face Recognition:** Users can set up face recognition and log in with their face.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

`git clone`
`cd`

### 2. Create a Firebase Project

* Create a new project with [Firebase](https://console.firebase.google.com/?_gl=1*171i0zp*_up*MQ..*_ga*MTcxMzk4Mjk4Ny4xNzM5MDI4NTgw*_ga_CW55HF8NVT*MTczOTAyODU4MC4xLjAuMTczOTAyODU4MC4wLjAuMA..)

* Enable Email/Password Authentication
* Set up a Cloud Firestore database and add a new Web App to you Firebase project
 to obtain your Firebase configuration

### 3. Set Up Environment Variables

Create an `.env` file in the root of your project from the `.env.example` file. Add your
 configuration variables as follows:

`
VITE_API_KEY=your_api_key_here

VITE_AUTH_DOMAIN=your_project.firebaseapp.com

VITE_PROJECT_ID=your_project_id_here

VITE_STORAGE_BUCKET=your_project.appspot.com

VITE_MESSAGING_SENDER_ID=your_messaging_sender_id_here

VITE_APP_ID=your_app_id_here

VITE_MEASUREMENT_ID=your_measurement_id_here
`

**This project uses Vite, so the environment variables must be prefixed with `VITE_`**

### 4. Configure Firestore Security Rules

To allow your project to work correctly during development, update your Firestore rules to
 allow access to the required collections.

**NOTE: The following rules are not secure for production. You should double-check and update these
 rules before deploying your app.**

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // USERS collection: Stores basic user info
    // Public read is allowed so the sign-up process can check for duplicate emails.
    // Only an authenticated user can write to their own document.
    match /users/{userId} {
      allow read: if true;  
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // FACEDATA collection: Stores face recognition descriptors and related data.
    // Public read is allowed so that any user—even when not authenticated—can use face detection to log in.
    // Only an authenticated user can write to their own face data document.
    match /face_data/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default rule: deny all access to any other collection or document.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 5. Install Dependencies

`npm install`

### 6. Start the development server

`npm run dev`
