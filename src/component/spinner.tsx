import Image from "next/image";
import React from "react";

import loader from "./spinner.gif";

const Spinner = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Image src={loader} alt="loading.." />
    </div>
  );
};

export default Spinner;
