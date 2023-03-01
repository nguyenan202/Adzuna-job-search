import { Col, Row, theme } from "antd"
import styles from './styles.module.scss'
import { LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { clearBoxChat, setLogout } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";

const Menu = ({ setCurrentStay, setIsOption, user }) => {

    const navigate = useNavigate();
    const themeToken = theme.useToken().token;
    const dispatch = useDispatch();

    const handleInfo = () => {
        navigate('/profile')
        setCurrentStay('/profile')
        setIsOption(false);
    }

    const handleSetting = () => {
        navigate('/setting')
        setCurrentStay('/setting')
        setIsOption(false);
    }

    const handleLogout = async () => {

        socket.emit('user-offline', user.id);
        dispatch(setLogout());
        dispatch(clearBoxChat());
        
        if (user.externalId) {
            window.open(
                `${process.env.REACT_APP_API_URL}/auth/logout`,
                '_self'
            )
        }

        navigate('/login');
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
            {/* Check user can access 'setting' */}
            {user.UserPermissions.find(permission => permission.Permission.path === 'setting') && <Row
                className={styles.sub_option}
                onClick={handleSetting}
            >
                <SettingOutlined style={{
                    color: themeToken.mainColor,
                    marginRight: '1rem'
                }} />
                Cài đặt
            </Row>}
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