import type { NextPage } from "next";
import Link from "next/link";

import Button from "@/component/Button";
import ClientComponent from "@/component/ClientComponent";
import ServerComponent from "@/component/ServerComponent";

const Home: NextPage = () => {
  return (
    <div className="mx-auto flex h-1/2 w-40 flex-col content-center justify-around">
      <ClientComponent />
      <ServerComponent />
      <Button>
        <Link href="/ThemeSelect">今日のメモ書き</Link>
      </Button>
      <Button>
        <Link href="/ThemeSelect">過去のメモ書き</Link>
      </Button>
      <Button>
        <Link href="/ThemeSelect">設定</Link>
      </Button>
    </div>
  );
};
export default Home;
