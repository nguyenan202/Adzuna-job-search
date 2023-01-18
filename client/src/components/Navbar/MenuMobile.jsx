import { Row } from "antd"
import { Link } from "react-router-dom"



const MenuMobile = ({ currentStay, setCurrentStay, setIsMobileOptionOpen, themeToken}) => {


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
                    to='/cv'
                    style={currentStay === '/cv' ? {
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
                        setCurrentStay('/cv')
                        setIsMobileOptionOpen(false)
                    }}
                >
                    Hồ sơ CV
                </Link>
            </Row>
            <Row justify='center'>
                <Link
                    to='/review'
                    style={currentStay === '/review' ? {
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
                        setCurrentStay('/review')
                        setIsMobileOptionOpen(false)
                    }}
                >
                    Đánh giá công ty
                </Link>
            </Row>
        </Row>
    )
}

export default MenuMobile;