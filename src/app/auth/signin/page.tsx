"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const SignInPage = () => {
  return (
    <div className="mt-24 flex justify-center">
      <div
        className="flex h-auto w-64 cursor-pointer items-center justify-center gap-x-3 rounded-md border border-gray px-4 py-2"
        onClick={() => signIn("google")}
      >
        <FcGoogle />
        <span>Sign in with Google</span>
      </div>
    </div>
  );
};

export default SignInPage;
