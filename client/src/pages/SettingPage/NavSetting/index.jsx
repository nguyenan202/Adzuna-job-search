import { Col, Row, theme } from "antd"
import styles from './styles.module.scss'
import { AiFillSetting } from 'react-icons/ai'


const NavSetting = ({ user, currentSettingIndex, setCurrentSettingIndex, layout }) => {

    const settings = user.Role.SettingPermissions;
    const themeToken = theme.useToken().token;
    

    const listSetting = settings.map((setting, index) => (
        <Row
            key={setting.id}
            className={styles.setting}
            style={currentSettingIndex === index ? {
                backgroundColor: '#ccc',
                margin: '0.5rem 0'
            } : { margin: '0.5rem 0' }}
            onClick={() => setCurrentSettingIndex(index)}
        >
            {setting.name}
        </Row>
    ));
    
    return (
        <Col
            className={styles.container}
            span={layout}
        >
            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
                <Row
                    className={styles.header}
                >
                    <AiFillSetting
                        className={styles.icon}
                        style={{
                            color: themeToken.mainColor
                        }}
                    />
                    Setting
                </Row>
                {listSetting}
            </Row>
        </Col>
    )
}

export default NavSetting