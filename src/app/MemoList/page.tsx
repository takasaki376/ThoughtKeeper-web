import Link from "next/link";

import { memos } from "@/mock/memos";

const MemoListPage = () => {
  console.log(memos);
  return (
    <div className="flex flex-col items-center text-gray">
      <div className="my-6 w-1/2">
        <input
          className="w-full border-2 border-gray px-3 py-1"
          type="text"
          id="name"
          name="name"
          placeholder="Filter Theme"
        />
      </div>
      <div className="flex w-full flex-col  px-3">
        {memos.map((item) => {
          return (
            <Link
              href="/MemoViewer"
              // className="flex w-full items-center justify-center p-3"
              key={item.theme}
            >
              <li className="mb-2 flex justify-around">
                <div className="w-28"> {item.date}</div>
                <div className="mx-2 w-2/3">{item.memo}</div>
                <div className="w-1/3">({item.theme})</div>
              </li>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MemoListPage;
