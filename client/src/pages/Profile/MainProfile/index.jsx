import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Drawer, Row, theme } from "antd";
import { useState } from "react";

import styles from './styles.module.scss';
import Profile from "./Profile";
import Security from "./Security";
import useMediaQuery from "../../../hooks/useMediaQuery";
import Company from "./Company";


const MainProfile = ({ currentOptionIndex, setCurrentOptionIndex, layout, user, options }) => {

    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    const breakPointTablet = useMediaQuery('(max-width: 992px)');
    const breakPointMobile = useMediaQuery('(max-width: 576px)');

    const themeToken = theme.useToken().token;

    const optionsView = [
        <Profile
            layout={layout}
            user={user}
        />,
        <Security
            layout={layout}
            user={user}
        />,
        <Company
            user={user}
            layout={layout}
        />
    ]

    const handleClickOption = (index) => {
        setCurrentOptionIndex(index);
        setIsOpenDrawer(false);
    }

    const listOption = options.filter(option => option.roleAccess.includes(user.Role.id)).map((option, index) => (
        <Row
            key={option.id}
            className={`${styles.btn_option}`}
            style={currentOptionIndex === index && {
                backgroundColor: themeToken.mainColor,
                color: '#fff'
            }}
            onClick={() => handleClickOption(index)}
        >
            {option.name}
        </Row>
    ))

    return (
        <>
            {breakPointTablet &&
                <Row
                    className={styles.btn_drawer}
                    onClick={() => setIsOpenDrawer(true)}
                >
                    <MdOutlineKeyboardArrowRight size='2rem' />
                </Row>
            }
            {optionsView[currentOptionIndex]}
            <Drawer
                placement='left'
                closable={false}
                onClose={() => setIsOpenDrawer(false)}
                open={isOpenDrawer}
                width={breakPointMobile ? '80vw' : '372px'}
            >
                {listOption}
            </Drawer>
        </>
    )
}

export default MainProfile