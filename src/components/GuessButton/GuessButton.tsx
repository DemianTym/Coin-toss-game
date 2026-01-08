import { type GuessButtonProps } from './GuessButtonTypes'

export default function GuessButton({ label, onClick }: GuessButtonProps) {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center justify-center
        w-50 h-12.5
        text-3xl text-red-400 font-bold
        rounded-xl
        bg-yellow-400 hover:bg-yellow-600 active:bg-yellow-700
        hover:cursor-pointer
        active:scale-95
        transition-all duration-150
      "
    >
      {label}
    </div>
  )
}
