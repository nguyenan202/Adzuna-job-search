import { LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons"
import { Row } from "antd"
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom"
import { setLogout } from "../../redux/store";

const MenuTablet = ({ currentStay, themeToken, setCurrentStay, setIsMobileOptionOpen }) => {

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(setLogout())
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
            </Row>
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