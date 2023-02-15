import styles from './styles.module.scss'

import { Avatar, Button, Col, Drawer, Dropdown, Image, Row, Tag, Typography, theme } from "antd"
import { CaretLeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { CgDetailsMore } from 'react-icons/cg'
import { MdMoreHoriz } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import Menu from './Menu';
import useMediaQuery from '../../hooks/useMediaQuery'
import MenuTablet from './MenuTablet'
import MenuMobile from './MenuMobile'

const Paragraph = Typography.Paragraph;
const currentUrl = window.location.href;

const roleColor = ['none','blue','gold','green'];

const Navbar = ({ user }) => {
    
    const [isMobileOptionOpen, setIsMobileOptionOpen] = useState(false);
    const [currentStay, setCurrentStay] = useState(currentUrl.replace(process.env.REACT_APP_CURRENT_URL, ''));
    const [isOption, setIsOption] = useState(false);

    const themeToken = theme.useToken().token;
    const navigate = useNavigate();

    const breakpointMobile = useMediaQuery('(min-width: 692px)');
    const breakpointTablet = useMediaQuery('(min-width: 992px)');

    useEffect(() => {
        const htmlElement = document.querySelector('html')

        const listenHtml = () => {
            setIsOption(false);
        };

        htmlElement.addEventListener('click', listenHtml)

        return () => htmlElement.removeEventListener('click', listenHtml)
    }, [])

    useEffect(() => {
        if (breakpointTablet) setIsMobileOptionOpen(false);
    }, [breakpointTablet])

    const data = user.UserPermissions.map(p => p.Permission).filter(p => p.path !== 'setting');
    
    const listPermission = data.map(permission => (
        <Col className={styles.item} key={permission.id}>
            <Link
                className={styles.paragraph}
                to={`/${permission.path}`}
                style={currentStay === `/${permission.path}` ? { color: themeToken.mainColor } : {}}
                onClick={() => setCurrentStay(`/${permission.path}`)}
            >
                {permission.name}
            </Link>
        </Col>
    ))

    const showPermission = listPermission.filter((permission, index) => index <= 1)
    const items = data.filter((permission, index) => index > 1 && permission.id !== 7).map((permission, index) => ({
        key: index + '',
        label: (
            <Link
                className={styles.paragraph}
                to={`/${permission.path}`}
                style={currentStay === `/${permission.path}` ? { color: themeToken.mainColor } : {}}
                onClick={() => setCurrentStay(`/${permission.path}`)}
            >
                {permission.name}
            </Link>
        )
    }))

    const hidePermission = data.length > 2 && (
        <Dropdown
            menu={{ items }}
            overlayStyle={{
                width: '15rem'
            }}
        >
            <Button>
                <MdMoreHoriz />
            </Button>
        </Dropdown>
    )

    return (
        <Row className={styles.container}>
            <Row style={{ alignItems: 'center' }}>
                <Col className={styles.logo}>
                    <Image
                        width='4rem'
                        preview={false}
                        src={`${process.env.REACT_APP_CURRENT_URL}/assets/images/logo.png`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setCurrentStay('/');
                            navigate('/');
                        }}
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
                {showPermission}
                {breakpointMobile && hidePermission}
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

                {isOption &&
                    <Menu
                        setCurrentStay={setCurrentStay}
                        setIsOption={setIsOption}
                        user={user}
                    />}
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
                        fontSize: '1.2rem',
                        padding: '1rem 0',
                        fontWeight: 500,
                        borderBottom: '1px solid rgba(5, 5, 5, 0.06)'
                    }}
                >
                    <Row
                        style={{
                            width: '100%',
                            fontSize: 'inherit',
                            justifyContent: 'center'
                        }}
                    >
                        {`${user.lastName} ${user.firstName}`}

                    </Row>

                    <Row
                        justify='center'
                        style={{
                            marginTop: '1rem'
                        }}
                    >
                        <Tag
                            color={roleColor[user.Role.id]}
                            style={{
                                padding: '0.25rem 1rem'
                            }}    
                        >
                            {user.Role.name}
                        </Tag>
                    </Row>
                </Row>

                {!breakpointMobile &&
                    <MenuMobile
                        user={user}
                        currentStay={currentStay}
                        setCurrentStay={setCurrentStay}
                        setIsMobileOptionOpen={setIsMobileOptionOpen}
                        themeToken={themeToken}
                        permissions={data}
                    />}

                <Row>
                    <MenuTablet
                        user={user}
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