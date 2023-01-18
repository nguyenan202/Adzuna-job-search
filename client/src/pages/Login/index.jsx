
import styles from './style.module.scss'
import {
    Row,
    Col,
    Typography,
    Image,
    Button
} from 'antd'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useState } from 'react'

const Login = () => {

    const [isLogin, setIsLogin] = useState(true);

    const googleAuth = () => {
        window.open(
            `${process.env.REACT_APP_API_URL}/auth/google/callback`,
            '_self'
        )
    }

    const facebookAuth = () => {
        window.open(
            `${process.env.REACT_APP_API_URL}/auth/facebook/callback`,
            '_self'
        )
    }

    const handleRegisterLogin = (e) => {
        e.preventDefault();

        setIsLogin(!isLogin);
    }
    
    return (
        <Row className={styles.container}>
            <Col className={styles.box}>
                <Row className={styles.logo}>
                    <Image preview={false} src='assets/images/logo.png' alt='logo' width='8rem' />
                </Row>
                <Row className={styles.head}>
                    <Col span={24}>
                        <Typography className={styles.heading}>
                            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                        </Typography>
                    </Col>
                    <Col span={24}>
                        <Typography className={styles.slogan}>
                            Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng
                        </Typography>
                    </Col>
                </Row>

                {isLogin ? <LoginForm /> : <RegisterForm />}

                <Row className={styles.button}>
                    {isLogin && <>
                        <Col span={24} className={styles.another_choise}>
                            <Typography>Hoặc</Typography>
                        </Col>
                        <Row style={{ width: '100%' }} justify='space-between'>
                            <Col xs={{ span: 24 }} sm={{ span: 11 }}>
                                <Button
                                    className={`${styles.btn} ${styles.btn_google}`}
                                    onClick={googleAuth}
                                >
                                    <FcGoogle />Đăng nhập với Google
                                </Button>
                            </Col>
                            <Col xs={{ span: 24 }} sm={{ span: 11 }}>
                                <Button
                                    className={`${styles.btn} ${styles.btn_facebook}`}
                                    onClick={facebookAuth}
                                >
                                    <FaFacebook />Đăng nhập với Facebook
                                </Button>
                            </Col>
                        </Row>
                    </>}
                    <Row style={{ width: '100%', marginTop: '0.5rem' }} justify='space-between'>
                        <Col span={12}>
                            <Typography>
                                {isLogin ? 'Bạn chưa có tài khoản? ': 'Đã có tài khoản? '}
                                <a href='/login' onClick={handleRegisterLogin}>
                                    {isLogin ? 'Đăng kí ngay' : 'Đăng nhập ngay'}
                                </a>
                            </Typography>
                        </Col>
                        <Col span={12}>
                            <Typography
                                style={{
                                    textAlign: 'right'
                                }}
                            >
                                <a href='/login'>Quên mật khẩu</a>
                            </Typography>
                        </Col>
                    </Row>
                </Row>
            </Col>
        </Row>
    )
}

export default Login