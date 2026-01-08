import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { type CoinProps } from "./CoinTypes";

export default function Coin({
  side,
  size = 150,
  isFlipping = false,
  onFlipStart,
  onFlipEnd,
}: CoinProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const animationRef = useRef<number | null>(null);
  const coinRef = useRef<PIXI.Sprite | null>(null);
  const texturesRef = useRef<{
    heads: PIXI.Texture;
    tails: PIXI.Texture;
  } | null>(null);

  // Prevents restarting the animation while it is already running
  const isAnimatingRef = useRef(false);

  // Stores the side the coin must land on after the animation
  const targetSideRef = useRef<"heads" | "tails">(side);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const initApp = async () => {
      const app = new PIXI.Application();

      await app.init({
        width: size,
        height: size,
        backgroundAlpha: 0,
      });

      if (!containerRef.current || appRef.current) return;

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(app.canvas);
      appRef.current = app;

      await PIXI.Assets.load(["/heads.svg", "/tails.svg"]);

      const headsTexture = PIXI.Texture.from("/heads.svg");
      const tailsTexture = PIXI.Texture.from("/tails.svg");
      texturesRef.current = { heads: headsTexture, tails: tailsTexture };

      const coin = new PIXI.Sprite(headsTexture);
      coin.anchor.set(0.5);
      coin.x = size / 2;
      coin.y = size / 2;
      coin.width = size;
      coin.height = size;

      app.stage.addChild(coin);
      coinRef.current = coin;
    };

    initApp();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      appRef.current?.destroy(true, { children: true });
      appRef.current = null;
    };
  }, [size]);

  useEffect(() => {
    if (!coinRef.current || !texturesRef.current) return;

    const coin = coinRef.current;
    const { heads, tails } = texturesRef.current;

    if (isFlipping) {
      // If animation is already running, only update the target side
      if (isAnimatingRef.current) {
        targetSideRef.current = side;
        return;
      }

      isAnimatingRef.current = true;
      targetSideRef.current = side;
      onFlipStart?.();

      const animationTargetSide = targetSideRef.current;
      const flipDuration = 2000 + Math.random() * 2000;
      const startTime = Date.now();

      const startingIsHeads = coin.texture === heads;

      // Number of half-rotations (odd/even determines final side)
      let numHalfFlips = 10 + Math.floor(Math.random() * 5);

      const wantsHeads = animationTargetSide === "heads";
      const willEndOnHeads = startingIsHeads
        ? numHalfFlips % 2 === 0
        : numHalfFlips % 2 === 1;

      if (willEndOnHeads !== wantsHeads) {
        numHalfFlips += 1;
      }

      let lastHalfFlip = 0;

      const animate = () => {
        if (!isAnimatingRef.current) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / flipDuration, 1);

        // Ease-out for natural slowdown
        const eased = 1 - Math.pow(1 - progress, 3);

        const targetHalfFlip = numHalfFlips * eased;
        let currentHalfFlip = Math.floor(targetHalfFlip);

        // Force the last flip to complete visually
        if (numHalfFlips - targetHalfFlip < 0.2) {
          currentHalfFlip = numHalfFlips;
        }

        const halfFlipProgress = targetHalfFlip - Math.floor(targetHalfFlip);
        const angle = halfFlipProgress * Math.PI;

        // Vertical squash simulates 3D flip
        coin.scale.y = Math.abs(Math.cos(angle));

        // Swap texture on every half flip
        if (currentHalfFlip !== lastHalfFlip) {
          const shouldBeHeads = startingIsHeads
            ? currentHalfFlip % 2 === 0
            : currentHalfFlip % 2 === 1;

          coin.texture = shouldBeHeads ? heads : tails;
          lastHalfFlip = currentHalfFlip;
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Ensure correct final state
          coin.scale.y = 1;
          coin.texture =
            animationTargetSide === "heads" ? heads : tails;

          isAnimatingRef.current = false;
          animationRef.current = null;
          onFlipEnd?.();
        }
      };

      animate();
    } else {
      // Hard stop if flipping was cancelled externally
      if (isAnimatingRef.current) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        isAnimatingRef.current = false;
      }

      // Static display when not flipping
      coin.scale.y = 1;
      coin.texture = side === "heads" ? heads : tails;
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      isAnimatingRef.current = false;
    };
  }, [isFlipping, side]);

  return <div className="mb-4" ref={containerRef} />;
}
