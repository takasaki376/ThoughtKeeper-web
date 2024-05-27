import "@/styles/globals.scss";

import { redirect } from "next/navigation";

import { Header } from "@/component/Header";
import { Navigation } from "@/component/Navigation";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="flex justify-center">
          <div className=" bg-tomato/5">
            <Navigation />
          </div>
          <div className="min-h-screen w-full">
            {user.email}
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
