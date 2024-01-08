import Link from "next/link";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineSettings } from 'react-icons/md';


const Header = () => {
  return (
    <header className='flex w-screen items-center justify-between bg-lightGray px-5 py-3'>
      <span className='text-lg font-semibold'>Tought Keeper</span>
      <div className="flex w-20 justify-around text-xl">

        <FaRegCircleUser />
        <Link href="/setting">
      <MdOutlineSettings />
        </Link>
      </div>
    </header>)
}

export default Header
