import type { NextPage } from "next";
import Link from "next/link";

import Button from "@/component/Button";

import AuthButton from "./auth/_button/AuthButton";

const Home: NextPage = () => {
  return (
    <div className="mx-auto flex h-1/2 w-40 flex-col content-center justify-around">
      <AuthButton />
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
