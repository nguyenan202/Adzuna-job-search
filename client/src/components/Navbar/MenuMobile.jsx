import { Row } from "antd"
import { Link } from "react-router-dom"



const MenuMobile = ({ currentStay, setCurrentStay, setIsMobileOptionOpen, themeToken, permissions }) => {
    
    const listPermission = permissions.map(permission => permission.id !== 7 && (
        <Row justify='center' key={permission.id}>
            <Link
                to={`/${permission.path}`}
                style={currentStay === `/${permission.path}` ? {
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
                    setCurrentStay(`/${permission.path}`)
                    setIsMobileOptionOpen(false)
                }}
            >
                {permission.name}
            </Link>
        </Row>
    ))

    
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
            {listPermission}
        </Row>
    )
}

export default MenuMobile;