import {useGameSessionStore} from '../../store/GameSessionStore.ts';
import GameScene from "../../game/GameScene.tsx";
import {useMenuStore} from "../../store/MenuStore.ts";
import ModalWindow from "../ModalWindow.tsx";
import MobileControls from "../MobileControls.tsx";
import {SettingsIcon} from "lucide-react";
import LevelInfo from "../ui/LevelInfo.tsx";
import GamingMainMenu from "../menu/GamingMainMenu.tsx";
import SettingsMenu from "../menu/SettingsMenu.tsx";
import LanguageMenu from "../menu/LanguageMenu.tsx";
import VolumeMenu from "../menu/VolumeMenu.tsx";
import WinMenu from "../menu/WinMenu.tsx";
import Inventory from "../Inventory.tsx";
import {usePlayerStore} from "../../store/PlayerStore.ts";
import {useBackgroundStore} from "../../store/BackgroundStore.tsx";
import {useEffect} from "react";
import {backgrounds} from "../../constants/backgrounds.ts";
import ItemModal from "../ui/ItemModal.tsx";

const GameScreen = () => {
  const {
    status,
    currentAttempts,
    pause,
    curTime,
  } = useGameSessionStore();

  const {season} = usePlayerStore();

  const {setBackground} = useBackgroundStore();

  const {menu: menu} = useMenuStore();

  useEffect(() => {
    if (!season) return;
    setBackground(backgrounds[season]);
  }, [season, setBackground]);

  const renderMenu = () => {
    switch (menu) {
      case 'main':
        return <GamingMainMenu />;
      case 'settings':
        return <SettingsMenu />
      case 'language':
        return <LanguageMenu />;
      case 'volume':
        return <VolumeMenu />;
    }
  }

  return (
    <div className="w-screen h-screen flex-center flex-col relative overflow-hidden gap-2">
      <h1
        className="h-xs:hidden
        mt-auto font-bold text-fg text-center
                            h-sm:hidden
                            h-md:text-7xl
                            h-lg:text-8xl
                            h-xl:text-9xl
                            "
      >
        {season}
      </h1>
      <div
        className="
                    my-auto
                    relative
                    h-[60vh]
                    w-[60vw]
                    border-black
                    flex-center
                "
      >
        <div className="fixed left-2 top-2 z-1001 flex-center flex-row">
          <LevelInfo
            attempts={currentAttempts}
            time={curTime}
          />
        </div>

        <GameScene />

        <button
          className="z-1001 fixed top-4 right-4 w-10 h-10 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition flex-center"
          onClick={pause}
        >
          <SettingsIcon />
        </button>

        <MobileControls />
      </div>
      <Inventory />
      <ItemModal />
      {status === "paused" && <ModalWindow>{renderMenu()}</ModalWindow>}
      {status === "won" && <ModalWindow><WinMenu /></ModalWindow>}
    </div>
  );
}

export default GameScreen;