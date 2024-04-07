import { FirestoreAdapter, initFirestore } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import type { Adapter } from "next-auth/adapters";

const firestore = initFirestore({
  credential: cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
});

const firebaseAdapter = FirestoreAdapter(firestore) as Adapter;

export default firebaseAdapter;
