import { DefaultJWT, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

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
  interface JWT extends DefaultJWT {
    // Firebaseの認証情報
    emailVerified: boolean;
    idToken?: string;
    uid: string;
  }
}

export default JWT;
