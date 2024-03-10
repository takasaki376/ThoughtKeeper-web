import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      // Firebaseの認証情報
      emailVerified?: boolean;
      uid: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    // Firebaseの認証情報
    emailVerified: boolean;
    uid: string;
  }
}
