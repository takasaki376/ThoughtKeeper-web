// import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";

import firebaseAdapter from "./firebaseAdapter";
import { gitHubProvider, googleProvider } from "./providers";

export const authOptions = {
  adapter: firebaseAdapter, // firebase adapter config in firebaseAdapter.ts file
  providers: [googleProvider, gitHubProvider], // all providers in providers folder
  secret: process.env.NEXT_AUTH_SECRET, // this command can be generated by command "openssl rand -base64 32"
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
