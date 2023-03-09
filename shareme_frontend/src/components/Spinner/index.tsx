import { Oval } from 'react-loader-spinner'

export type SpinnerProps = {
  message?: string
  className?: string | undefined
}

const Spinner = ({ message, className }: SpinnerProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full ${className}`}
    >
      <Oval color="#fc8181" secondaryColor="#fc8181" height={50} width={200} />

      {message && <p className="text-lg text-center px-2">{message}</p>}
    </div>
  )
}

export default Spinner
