
type Props = {
  children: React.ReactNode;
};


const Button:React.FC<Props> = (props) => {
  return (
    <button type="button" className="flex justify-center whitespace-nowrap rounded border bg-yellow-700 px-4 py-2 font-bold text-white shadow hover:bg-yellow-500 focus:outline-none">
      {props.children}
    </button>
  );
}

export default Button
