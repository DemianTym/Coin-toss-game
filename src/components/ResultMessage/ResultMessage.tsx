import { type ResultMessageProps } from "./ResultMessageTypes";

export default function ResultMessage({ message }: ResultMessageProps) {
  return (
    <div
      className="
        text-5xl font-extrabold
        bg-clip-text text-transparent
        bg-linear-to-r from-yellow-400 via-red-500 to-pink-500
        drop-shadow-lg
        animate-pulse
        mt-8
        text-center
      "
    >
      {message}
    </div>
  );
}
