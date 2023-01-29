import type { NextPage } from 'next'

type obj = {
  name:string,
  a: number,
  id:number,
  }
const Home: NextPage = () => {
  return (
    <h1 className="text-xl font-bold underline text-red-600 bg-gray-200">
      Hello world!
    </h1>
  )
}
export default Home
