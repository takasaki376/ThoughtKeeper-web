import { getServerSession } from "next-auth/next";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
// path/toは適宜書き換えてください

const ServerComponent = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return <p>{JSON.stringify(user)}</p>;
};

export default ServerComponent;
