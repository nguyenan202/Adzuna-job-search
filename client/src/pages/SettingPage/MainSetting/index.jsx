import { Col, Drawer, Row, theme } from "antd"
import styles from './styles.module.scss'
import useMediaQuery from "../../../hooks/useMediaQuery"
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useState } from "react";

const MainSetting = ({ user, currentSettingIndex, setCurrentSettingIndex, renders, layout }) => {

    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    const themeToken = theme.useToken().token;

    const breakPointTablet = useMediaQuery('(max-width: 992px)');
    const breakPointMobile = useMediaQuery('(max-width: 576px)');

    const settings = user.Role.SettingPermissions;

    const handleClickSetting = (index) => {
        setCurrentSettingIndex(index);
        setIsOpenDrawer(false);
    }

    const listOption = settings.map((setting,index) => (
        <Row
            key={setting.id}
            className={`${styles.btn_option}`}
            style={currentSettingIndex === index && {
                backgroundColor: themeToken.mainColor,
                color: '#fff'
            }}
            onClick={() => handleClickSetting(index)}
        >
            {setting.name}
        </Row>
    ))

    return (
        <Col
            className={styles.container}
            span={layout}
            style={{
                padding: breakPointTablet && '1rem',
                position: 'relative'
            }}
        >
            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
                {renders[currentSettingIndex]}
            </Row>

            {breakPointTablet &&
                <>
                    <Row
                        className={styles.btn_drawer}
                        onClick={() => setIsOpenDrawer(true)}
                    >
                        <MdOutlineKeyboardArrowRight size='2rem' />
                    </Row>

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
            }
        </Col>
    )
}

export default MainSetting