interface InputProps{
    children: string;
    
}


export const Button = ({children}: InputProps) => {
  return (
    <button
        className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"   
        type="submit"
    >
        {children}
    </button>
  )
}
