"use client";
import ky from "ky";
import { useState } from "react";

interface PasswordResetResponse {
  error?: string;
  message?: string;
}

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sendResetEmail = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await ky.post("/api/auth/reset-password", {
        json: { email },
      }).json<PasswordResetResponse>();

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(response.message || "パスワードリセット用のメールを送信しました");
      }
    } catch (err) {
      setError("メールの送信に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string, confirmPassword: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await ky.post("/api/auth/update-password", {
        json: { confirmPassword, password },
      }).json<PasswordResetResponse>();

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(response.message || "パスワードが正常に更新されました");
      }
    } catch (err) {
      setError("パスワードの更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    sendResetEmail,
    success,
    updatePassword,
  };
}
