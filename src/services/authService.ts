export async function sendPasswordResetEmail(email: string): Promise<[true, string] | [false, string]> {
  try {
    const response = await fetch("/api/auth/reset-password", {
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Reset password error:", data.error);
      return [false, data.error || "パスワードリセットに失敗しました"];
    }

    console.log("Password reset email sent successfully");
    return [true, "パスワードリセット用のメールを送信しました。メールをご確認ください。"];
  } catch (error) {
    console.error("Unexpected error during password reset:", error);
    return [false, "予期しないエラーが発生しました。"];
  }
}
