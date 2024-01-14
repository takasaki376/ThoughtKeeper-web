import type { NextPage } from "next";

import Button from "@/component/Button";

const Home: NextPage = () => {
  return (
    <div className="mx-auto flex h-1/2 w-40 flex-col content-center justify-around">
      <Button>今日のメモ書き</Button>
      <Button>過去のメモ書き</Button>
      <Button>設定</Button>
    </div>
  );
};
export default Home;
