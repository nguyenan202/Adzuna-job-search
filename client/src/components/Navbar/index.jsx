import styles from './styles.module.scss'

import { Avatar, Col, Drawer, Image, Row, Typography, theme } from "antd"
import { CaretLeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { CgDetailsMore } from 'react-icons/cg'
import { Link } from 'react-router-dom'
import Menu from './Menu';
import useBreakPoint from '../../hooks/useBreakPoint'
import MenuTablet from './MenuTablet'
import MenuMobile from './MenuMobile'

const Paragraph = Typography.Paragraph;
const currentUrl = window.location.href;

// id map with user role id
const routeSetting = [
    {
        id: 1,
        routes: [
            {
                path: 'manage-post-admin',
                name: 'Quản lý post'
            },
            {
                path: 'manage-user',
                name: 'Quản lý người dùng'
            }
        ]
    },
    {
        id: 2,
        routes: [
            {
                path: 'manage-post-employer',
                name: 'Quản lý post'
            },
            {
                path: 'create-post',
                name: 'Tạo post'
            }
        ]
    },
    {
        id: 3,
        routes: [
            {
                path: 'cv',
                name: 'Hồ sơ CV'
            },
            {
                path: 'review-company',
                name: 'Đánh giá công ty'
            }
        ]
    }
]

const Navbar = ({ user }) => {

    const [isMobileOptionOpen, setIsMobileOptionOpen] = useState(false);
    const [currentStay, setCurrentStay] = useState(currentUrl.replace(process.env.REACT_APP_CURRENT_URL, ''));
    const [isOption, setIsOption] = useState(false);

    const themeToken = theme.useToken().token;
    const breakpointMobile = useBreakPoint(700);

    useEffect(() => {
        const htmlElement = document.querySelector('html')

        const listenHtml = () => {
            setIsOption(false);
        };

        htmlElement.addEventListener('click', listenHtml)

        return () => htmlElement.removeEventListener('click', listenHtml)
    }, [])


    const route = routeSetting.find(route => route.id === user.Role.id).routes
    console.log(user.Role.name);

    return (
        <Row className={styles.container}>
            <Row>
                <Col className={styles.logo}>
                    <Image
                        width='4rem'
                        preview={false}
                        src='assets/images/logo.png'
                    />
                </Col>
                <Col className={styles.item}>
                    <Link
                        className={styles.paragraph}
                        to='/'
                        style={currentStay === '/' ? { color: themeToken.mainColor } : {}}
                        onClick={() => setCurrentStay('/')}
                    >
                        Việc Làm
                    </Link>
                </Col>
                <Col className={styles.item}>
                    <Link
                        className={styles.paragraph}
                        to={`/${route[0].path}`}
                        style={currentStay === `/${route[0].path}` ? { color: themeToken.mainColor } : {}}
                        onClick={() => setCurrentStay(`/${route[0].path}`)}
                    >
                        {route[0].name}
                    </Link>
                </Col>
                <Col className={styles.item}>
                    <Link
                        className={styles.paragraph}
                        to={`/${route[1].path}`}
                        style={currentStay === `/${route[1].path}` ? { color: themeToken.mainColor } : {}}
                        onClick={() => setCurrentStay(`/${route[1].path}`)}
                    >
                        {route[1].name}
                    </Link>
                </Col>
            </Row>

            <Row style={{ position: 'relative', alignItems: 'center' }}>
                <Col
                    className={styles.btn_menu}
                    style={{
                        backgroundColor: themeToken.mainBackground
                    }}
                    onClick={() => setIsMobileOptionOpen(true)}
                >
                    <CgDetailsMore />
                </Col>
                <Col
                    className={styles.info}
                    style={isOption ? {
                        backgroundColor: themeToken.mainBackground,
                        borderBottomLeftRadius: '0',
                        borderBottomRightRadius: '0',
                        borderBottom: 'none'
                    } : {
                        backgroundColor: themeToken.mainBackground,
                        border: 'none'
                    }}
                    onClick={(e) => {
                        setIsOption(!isOption)
                        e.stopPropagation();
                    }}
                >
                    <Avatar
                        className={styles.avatar}
                        src={user.externalId ? user.picturePath : `${process.env.REACT_APP_API_URL}/images/${user.picturePath}`}
                        alt={user.firstName}
                        size='default'
                    />
                    <Paragraph className={styles.fullName}>
                        {`${user.lastName} ${user.firstName}`}
                        <CaretLeftOutlined
                            className={styles.arrow}
                            style={isOption ? {
                                transition: 'transform 0.3s ease',
                                transform: 'rotate(-90deg)'
                            } : {
                                transition: 'transform 0.3s ease',
                                transform: 'rotate(0deg)'
                            }}
                        />
                    </Paragraph>
                </Col>

                {isOption && <Menu setIsOption={setIsOption} />}
            </Row>




            {/* for modals */}

            <Drawer
                onClose={() => setIsMobileOptionOpen(false)}
                open={isMobileOptionOpen}
                placement="right"
                width={breakpointMobile ? '80vw' : '372px'}
            >
                <Row justify='center'>
                    <Avatar
                        src={user.externalId ? user.picturePath : `${process.env.REACT_APP_API_URL}/images/${user.picturePath}`}
                        alt={user.firstName}
                        style={{
                            width: '6rem',
                            height: '6rem'
                        }}
                    />
                </Row>

                <Row
                    justify='center'
                    style={{
                        marginTop: '1rem'
                    }}
                >
                    <Col
                        style={{
                            padding: '0.5rem 1rem',
                            color: themeToken.mainColor,
                            borderRadius: '5px',
                            border: '1px solid ' + themeToken.mainColor
                        }}
                    >
                        {user.Role.name}
                    </Col>
                </Row>

                <Row
                    justify='center'
                    style={{
                        fontSize: '1.2rem',
                        padding: '1rem 0',
                        fontWeight: 500,
                        borderBottom: '1px solid rgba(5, 5, 5, 0.06)'
                    }}
                >
                    {`${user.lastName} ${user.firstName}`}
                </Row>

                {breakpointMobile &&
                    <MenuMobile
                        user={user}
                        currentStay={currentStay}
                        setCurrentStay={setCurrentStay}
                        setIsMobileOptionOpen={setIsMobileOptionOpen}
                        themeToken={themeToken}
                        routeSetting={routeSetting}
                    />}

                <Row>
                    <MenuTablet
                        currentStay={currentStay}
                        themeToken={themeToken}
                        setCurrentStay={setCurrentStay}
                        setIsMobileOptionOpen={setIsMobileOptionOpen}
                    />
                </Row>
            </Drawer>
        </Row>
    )
}

export default Navbar