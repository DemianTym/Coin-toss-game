import { useState, useRef, useEffect } from "react";
import GuessButton from "./components/GuessButton/GuessButton";
import { tossCoin } from "../api/tossCoin";
import Coin from "./components/Coin/Coin";
import ResultMessage from "./components/ResultMessage/ResultMessage";
import FlippingText from "./components/FlippingText/FlippingText";
import Title from "./components/Title/Title";

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [coinSide, setCoinSide] = useState<"heads" | "tails">("heads");

  // Single audio instance reused between spins
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    spinAudioRef.current = new Audio("/sounds/coin-sound.mp3");
    spinAudioRef.current.loop = true;
    spinAudioRef.current.volume = 0.8;

    return () => {
      spinAudioRef.current?.pause();
      spinAudioRef.current = null;
    };
  }, []);

  const handleGuess = async (guess: "heads" | "tails") => {
    // Prevent double spins
    if (loading) return;

    setLoading(true);
    setResult(null);

    // Backend decides the final side
    const response = await tossCoin();
    setCoinSide(response.result);

    // Result is shown after the flip animation finishes
    setTimeout(() => {
      const win = response.result === guess;
      setResult(win ? "You Win!" : "You Lose!");
      setLoading(false);

      // Auto-hide result message
      setTimeout(() => setResult(null), 3000);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-[url('/background.jpg')] bg-no-repeat bg-cover bg-center">
      <Title />

      <Coin
        side={coinSide}
        isFlipping={loading}
        // Sound starts exactly when the coin animation starts
        onFlipStart={() => {
          if (!spinAudioRef.current) return;
          spinAudioRef.current.currentTime = 0;
          spinAudioRef.current.play().catch(() => {});
        }}
        // Sound stops exactly when the animation ends
        onFlipEnd={() => {
          spinAudioRef.current?.pause();
          if (spinAudioRef.current) spinAudioRef.current.currentTime = 0;
        }}
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <GuessButton label="Heads" onClick={() => handleGuess("heads")} />
        <GuessButton label="Tails" onClick={() => handleGuess("tails")} />
      </div>

      <div className="h-12 flex flex-col items-center">
        {loading && <FlippingText />}
        <ResultMessage message={result || ""} />
      </div>
    </div>
  );
}

export default App;
