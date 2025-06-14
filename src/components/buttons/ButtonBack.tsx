import Button from "./Button.tsx";
import {useTranslation} from "react-i18next";
import {useMenuStore} from "../../store/MenuStore.ts";
import IconBack from "../icons/IconBack.tsx";
import type {MenuType} from "../../constants/types.ts";
import {ICON_STYLES} from "../../constants/values.ts";

interface IProps {
    newState: MenuType;
}

const ButtonBack = ({newState}: IProps) => {
    const {t} = useTranslation('translations')
    const {change: changeMenu} = useMenuStore()

    return (
        <Button title={t('back')} onClick={() => changeMenu(newState)}
                textColorClass="text-red-500 hover:text-red-400"
                textGradientClass="from-rose-700"
                icon={<IconBack className={ICON_STYLES}/>}/>
    );
}

export default ButtonBack;