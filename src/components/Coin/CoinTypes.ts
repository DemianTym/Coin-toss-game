export interface CoinProps {
  side: "heads" | "tails";
  size?: number;
  isFlipping?: boolean;
  onFlipStart?: () => void;
  onFlipEnd?: () => void;
}