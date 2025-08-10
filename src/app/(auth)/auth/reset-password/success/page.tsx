import Link from "next/link";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="flex justify-center gap-2 px-8">
      <div className="flex w-full flex-col gap-2 text-foreground md:w-1/2">
        <div className="text-center">
          <h1 className="mb-6 text-2xl font-bold">
            パスワードが更新されました
          </h1>

          <div className="mb-6">
            <svg
              className="mx-auto size-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Success checkmark"
              role="img"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <p className="text-gray-600 mb-6">
            パスワードが正常に更新されました。新しいパスワードでログインしてください。
          </p>

          <Link
            href="/auth/login"
            className="inline-block rounded-md bg-green-700 px-6 py-3 text-white hover:bg-green-800"
          >
            ログインする
          </Link>
        </div>
      </div>
    </div>
  );
}
