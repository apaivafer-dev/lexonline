import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// In production (Cloud Run), uses default credentials automatically.
// Locally, requires GOOGLE_APPLICATION_CREDENTIALS env var pointing to service account JSON,
// or FIREBASE_SERVICE_ACCOUNT_JSON containing the JSON string.
function initializeFirebase(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'portallexonline-app';
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`;

  // Option 1: JSON string in env var (useful for Cloud Run secrets)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket,
    });
  }

  // Option 2: GOOGLE_APPLICATION_CREDENTIALS file path (set automatically in Cloud Run)
  // or Application Default Credentials
  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket,
  });
}

const app = initializeFirebase();
const bucket = admin.storage().bucket();

export { admin, app, bucket };
