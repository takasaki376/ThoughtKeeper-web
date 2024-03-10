"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { signIn as signInByNextAuth } from "next-auth/react";
import { useState } from "react";

import { auth } from "@/firebase/client";

import GoogleAuthButton from "../_button/GoogleAuthButton";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    if (!email) return;
    if (!password) return;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();
      await signInByNextAuth("credentials", {
        callbackUrl: "/",
        idToken,
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="mx-auto flex w-1/2 flex-col items-center py-20">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="メールアドレス"
        className="border-2 border-gray"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="パスワード"
        className="my-3 border-2 border-gray"
      />
      <button
        className="bg-tomato "
        type="button"
        onClick={() => {
          signIn();
        }}
      >
        ログイン
      </button>
      <GoogleAuthButton />
    </div>
  );
};

export default SignInPage;
