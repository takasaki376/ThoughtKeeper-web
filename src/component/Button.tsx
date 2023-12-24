import React from 'react'

type Props = {
  children: React.ReactNode;
};


const Button:React.FC<Props> = (props) => {
  return (
    <button className='flex justify-center whitespace-nowrap border border-gray '>{props.children}</button>
  )
}

export default Button
