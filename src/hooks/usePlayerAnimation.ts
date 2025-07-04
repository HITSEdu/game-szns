import {Rectangle, Texture} from "pixi.js";
import {useRef, useMemo} from "react";
import {useTick} from "@pixi/react";
import {usePlayerStore} from "../store/PlayerStore.ts";
import type {AnimationsMap} from "../game/systems/playerAnimations.ts";
import type {Action, Direction} from "../constants/types.ts";
import {keys} from "../game/systems/ControlSystem.ts";
import {useLevelStore} from "../store/LevelStore.ts";

interface UsePlayerAnimationProps {
  texture: Texture;
  frameWidth: number;
  frameHeight: number;
  animations: AnimationsMap;
  animationSpeed: number;
}

export function usePlayerAnimation({
                                     texture,
                                     frameWidth,
                                     frameHeight,
                                     animations,
                                     animationSpeed
                                   }: UsePlayerAnimationProps) {
  const frameIndex = useRef(0);
  const elapsed = useRef(0);
  const currentTexture = useRef<Texture>(Texture.EMPTY);
  const lastKey = useRef<string>("");

  const velocityX = usePlayerStore(state => state.velocityX);
  const velocityY = usePlayerStore(state => state.velocityY);
  const onGround = usePlayerStore(state => state.onGround);

  const climbing = usePlayerStore(state => state.onLadder);
  const isMiniGame = useLevelStore(state => state.isMiniGame);

  const {action, direction} = useMemo(() => {
    let action: Action = 'idle';
    let direction: Direction = 'right';

    const isActuallyJumping = !onGround && Math.abs(velocityY) > 0.1;
    const isMovingX = Math.abs(velocityX) > 0.5;
    const isMovingY = Math.abs(velocityY) > 0.5;

    if (climbing) {
      action = "climb";
      direction = keys.up ? "up" : "down";
    } else if (isActuallyJumping) {
      action = "jump";
      direction = velocityX < 0 ? "left" : "right";
    } else if (isMiniGame) {
      if (isMovingX || isMovingY) {
        action = "walk";

        if (Math.abs(velocityX) > Math.abs(velocityY)) {
          direction = velocityX < 0 ? "left" : "right";
        } else {
          direction = velocityY < 0 ? "up" : "down";
        }
      }
    } else if (isMovingX) {
      action = "walk";
      direction = velocityX < 0 ? "left" : "right";
    }

    if (isMiniGame && (action === 'climb' || action === 'jump')) {
      action = 'walk';
      direction = velocityY < 0 ? "up" : "down";
    }

    return {action, direction};
  }, [velocityX, velocityY, onGround, climbing, isMiniGame]);


  let key = `${action}-${direction}`;
  if (isMiniGame) key += "-mini-game";


  const anim = animations[key] || animations["idle-right"];

  if (key !== lastKey.current) {
    frameIndex.current = 0;
    elapsed.current = 0;
    lastKey.current = key;
  }

  useTick((ticker) => {
    const delta = ticker.deltaMS / (1000 / 60);
    elapsed.current += delta;
    if (action == 'idle') animationSpeed *= 3
    if (elapsed.current >= animationSpeed) {
      elapsed.current = 0;
      frameIndex.current = (frameIndex.current + 1) % anim.frames;
    }

    const frame = new Rectangle(
      frameIndex.current * frameWidth,
      anim.row * frameHeight,
      frameWidth,
      frameHeight
    );

    currentTexture.current = new Texture({
      source: texture.source,
      frame,
    });
  });

  return currentTexture.current;
}