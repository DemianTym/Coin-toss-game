export default function FlippingText() {
  return (
    <div
      className="
        mt-4
        text-3xl sm:text-4xl
        font-extrabold
        text-center
        bg-clip-text text-transparent
        bg-linear-to-r from-yellow-400 via-red-500 to-pink-500
        drop-shadow-lg
        animate-pulse
      "
    >
      Flipping...
    </div>
  );
}
