import { Col, Row, theme } from "antd"
import styles from './styles.module.scss'
import { LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setLogout } from "../../redux/store";

const Menu = ({ setIsOption }) => {

    const themeToken = theme.useToken().token;
    const dispatch = useDispatch();

    const handleInfo = () => {
        console.log('go to info');
        setIsOption(false);
    }

    const handleSetting = () => {
        console.log('go to setting');
        setIsOption(false);
    }

    const handleLogout = () => {
        dispatch(setLogout());
    }

    return (
        <Col
            className={styles.option}
            style={{
                backgroundColor: themeToken.mainBackground,
                borderTop: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <Row
                className={styles.sub_option}
                onClick={handleInfo}
            >
                <UserOutlined
                    style={{
                        color: themeToken.mainColor,
                        marginRight: '1rem'
                    }}
                />
                Thông tin
            </Row>
            <Row
                className={styles.sub_option}
                onClick={handleSetting}
            >
                <SettingOutlined style={{
                    color: themeToken.mainColor,
                    marginRight: '1rem'
                }} />
                Cài đặt
            </Row>
            <Row
                className={styles.sub_option}
                onClick={handleLogout}    
            >
                <LogoutOutlined style={{
                    color: themeToken.mainColor,
                    marginRight: '1rem'
                }} />
                Đăng xuất
            </Row>
        </Col>
    )
}

export default Menu