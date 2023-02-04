import { LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons"
import { Row } from "antd"
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom"
import { setLogout } from "../../redux/store";

const MenuTablet = ({ user, currentStay, themeToken, setCurrentStay, setIsMobileOptionOpen }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(setLogout());
        
        if (user.externalId) {
            window.open(
                `${process.env.REACT_APP_API_URL}/auth/logout`,
                '_self'
            )
        }

        navigate('/login');
    }

    const styleOnFocus = {
        width: '100%',
        textAlign: 'center',
        color: themeToken.mainColor,
        padding: '1rem 0',
        fontSize: '1rem',
        backgroundColor: '#ebe6e6',
        fontWeight: 500,
    }

    const styleOutFocus = {
        width: '100%',
        textAlign: 'center',
        color: '#000',
        padding: '1rem 0',
        fontSize: '1rem',
        fontWeight: 500,
    }



    return (
        <>
            <Row justify='center' style={{ width: '100%' }}>
                <Link
                    to='/profile'
                    style={currentStay === '/profile' ? styleOnFocus : styleOutFocus}
                    onClick={() => {
                        setCurrentStay('/profile')
                        setIsMobileOptionOpen(false)
                    }}
                >
                    <UserOutlined
                        style={{
                            color: themeToken.mainColor,
                            marginRight: '1rem'
                        }}
                    />
                    Thông tin
                </Link>
            </Row>
            {user.UserPermissions.map(permission => permission.Permission).filter(permission => permission.path === 'setting').length !== 0 &&
                <Row justify='center' style={{ width: '100%' }}>
                    <Link
                        to='/setting'
                        style={currentStay === '/setting' ? styleOnFocus : styleOutFocus}
                        onClick={() => {
                            setCurrentStay('/setting')
                            setIsMobileOptionOpen(false)
                        }}
                    >
                        <SettingOutlined style={{
                            color: themeToken.mainColor,
                            marginRight: '1rem'
                        }} />
                        Cài đặt
                    </Link>
                </Row>}
            <Row justify='center' style={{ width: '100%' }}>
                <Link
                    to='/login'
                    style={styleOutFocus}
                    onClick={handleLogout}
                >
                    <LogoutOutlined style={{
                        color: themeToken.mainColor,
                        marginRight: '1rem'
                    }} />
                    Đăng xuất
                </Link>
            </Row>
        </>
    )
}

export default MenuTablet