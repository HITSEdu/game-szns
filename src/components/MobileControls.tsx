import {press, release} from '../game/systems/ControlSystem.ts'
import IconKeyboardDown from './icons/IconKeyboardDown.tsx';
import IconKeyboardLeft from './icons/IconKeyboardLeft.tsx';
import IconKeyboardRight from './icons/IconKeyboardRight.tsx';
import IconKeyboardUp from './icons/IconKeyboardUp.tsx';
import {usePlayerStore} from "../store/PlayerStore.ts";
import {useLevelStore} from "../store/LevelStore.ts";

const MobileControls = () => {
  const isMobile = window.innerWidth <= 1000 || window.innerHeight <= 600;
  if (!isMobile) return null;

  const iconClasses = 'w-18 h-18';
  const btnWrapper = 'pointer-events-auto flex items-center justify-center';

  const {onLadder} = usePlayerStore.getState();
  const {isMiniGame} = useLevelStore.getState();

  return (
    <div className="fixed bottom-4 left-8 right-4 flex justify-between items-end px-4 z-50 pointer-events-none">
      <div className="flex gap-2">
        <button
          className={btnWrapper}
          onTouchStart={() => press('left')}
          onTouchEnd={() => release('left')}
          onTouchCancel={() => release('left')}
          type="button"
        >
          <IconKeyboardLeft className={iconClasses} />
        </button>
        <button
          className={btnWrapper}
          onTouchStart={() => press('right')}
          onTouchEnd={() => release('right')}
          onTouchCancel={() => release('right')}
          type="button"
        >
          <IconKeyboardRight className={iconClasses} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <button
          className={btnWrapper}
          onTouchStart={() => {
            if (onLadder || isMiniGame) {
              press('up');
            } else {
              press('jump');
            }
          }}
          onTouchEnd={() => {
            release('up');
            release('jump');
          }}
          onTouchCancel={() => {
            release('up');
            release('jump');
          }}
          type="button"
        >
          <IconKeyboardUp className={iconClasses} />
        </button>
        <button
          className={btnWrapper}
          onTouchStart={() => press('down')}
          onTouchEnd={() => release('down')}
          onTouchCancel={() => release('down')}
          type="button"
        >
          <IconKeyboardDown className={iconClasses} />
        </button>
      </div>
    </div>
  )
    ;
};

export default MobileControls;