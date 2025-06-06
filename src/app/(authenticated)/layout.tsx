import "@/styles/globals.scss";

import { MantineProvider } from "@mantine/core";
import { Provider } from "jotai";
import { redirect } from "next/navigation";

import { Header } from "@/component/Header";
import { Navigation } from "@/component/Navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Tought Keeper",
  description: "Generated by Next.js",
};

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <Provider>
      <MantineProvider>
        <body>
          <Header />
          <div className="flex">
            <div className=" bg-lightGray/20">
              <Navigation />
            </div>
            <div className="min-h-screen w-full">{children}</div>
          </div>
        </body>
      </MantineProvider>
    </Provider>
  );
}
