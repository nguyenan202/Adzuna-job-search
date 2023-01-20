import { Row } from "antd"
import { Link } from "react-router-dom"



const MenuMobile = ({ user, currentStay, setCurrentStay, setIsMobileOptionOpen, themeToken, routeSetting }) => {

    const route = routeSetting.find(route => route.id === user.Role.id).routes

    return (
        <Row
            style={{
                display: 'block',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(5, 5, 5, 0.06)'
            }}
        >
            <Row justify='center'>
                <Link
                    to='/'
                    style={currentStay === '/' ? {
                        width: '100%',
                        textAlign: 'center',
                        color: themeToken.mainColor,
                        padding: '1rem 0',
                        fontSize: '1rem',
                        backgroundColor: '#ebe6e6',
                        fontWeight: 500
                    } : {
                        width: '100%',
                        textAlign: 'center',
                        color: '#000',
                        padding: '1rem 0',
                        fontSize: '1rem',
                        fontWeight: 500
                    }}
                    onClick={() => {
                        setCurrentStay('/')
                        setIsMobileOptionOpen(false)
                    }}
                >
                    Việc Làm
                </Link>
            </Row>
            <Row justify='center'>
                <Link
                    to={`/${route[0].path}`}
                    style={currentStay === `/${route[0].path}` ? {
                        width: '100%',
                        textAlign: 'center',
                        color: themeToken.mainColor,
                        padding: '1rem 0',
                        fontSize: '1rem',
                        backgroundColor: '#ebe6e6',
                        fontWeight: 500
                    } : {
                        width: '100%',
                        textAlign: 'center',
                        color: '#000',
                        padding: '1rem 0',
                        fontSize: '1rem',
                        fontWeight: 500
                    }}
                    onClick={() => {
                        setCurrentStay(`/${route[0].path}`)
                        setIsMobileOptionOpen(false)
                    }}
                >
                    {route[0].name}
                </Link>
            </Row>
            <Row justify='center'>
                <Link
                    to={`/${route[1].path}`}
                    style={currentStay === `/${route[1].path}` ? {
                        width: '100%',
                        textAlign: 'center',
                        color: themeToken.mainColor,
                        padding: '1rem 0',
                        fontSize: '1rem',
                        backgroundColor: '#ebe6e6',
                        fontWeight: 500
                    } : {
                        width: '100%',
                        textAlign: 'center',
                        color: '#000',
                        padding: '1rem 0',
                        fontSize: '1rem',
                        fontWeight: 500
                    }}
                    onClick={() => {
                        setCurrentStay(`/${route[1].path}`)
                        setIsMobileOptionOpen(false)
                    }}
                >
                    {route[1].name}
                </Link>
            </Row>
        </Row>
    )
}

export default MenuMobile;