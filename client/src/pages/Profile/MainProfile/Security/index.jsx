

import { Button, Col, Input, Row, Typography, theme } from 'antd';
import styles from './styles.module.scss';
import { EyeInvisibleTwoTone, EyeTwoTone } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import SpinLoading from '../../../../components/SpinLoading'
import useMediaQuery from '../../../../hooks/useMediaQuery';
import ChangePasswordModal from './ChangePasswordModal';

const iconStyle = { marginRight: '0.5rem', fontSize: '1.2rem', cursor: 'pointer' }

const FieldInput = ({ field, value, isInvalidMessage, ...props }) => {

    return (
        <Col span={props.span} style={{ margin: '0.5rem 0' }}>
            <Typography.Paragraph
                className={styles.title_field}
                style={{
                    color: isInvalidMessage && 'red'
                }}
            >
                {field}
            </Typography.Paragraph>
            <Input
                style={{
                    border: isInvalidMessage && `1px solid red`
                }}
                value={value}
                {...props}
            />
            {isInvalidMessage && <Typography.Text style={{ fontSize: '0.8rem', color: 'red' }}>
                {isInvalidMessage}
            </Typography.Text>}
        </Col>
    )
}

const MyButton = ({ value, backgroundColor, color, ...props }) => {


    return (
        <Col
            span={props.span}
            style={{
                margin: '0.5rem 0',
                display: 'flex',
                alignItems: 'end'
            }}
        >
            <Button
                style={{ width: '100%', backgroundColor: backgroundColor, color: color }}
                {...props}
            >
                {value}
            </Button>
        </Col>
    )
}

const Security = ({ layout, user }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isOpenModalChangePassword, setIsOpenModalChangePassword] = useState(false);
    const [password, setPassword] = useState(null);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);

    const breakPointMobile = useMediaQuery('(max-width: 576px)')
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/password/${user.id}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setPassword(response.data.password)
            setIsLoading(false);
        }

        fetchData();
    },[user.id])

    const togglePassword = () => {
        setIsShowPassword(!isShowPassword)
    }

    const handleOpenModalChangePassowrd = () => {
        setIsOpenModalChangePassword(true);
    }

    const handleChangePassword = () => {
        setIsOpenModalChangePassword(false);
    }
    
    return (
        <Col
            className={styles.container}
            span={layout}
            style={breakPointMobile && {
                padding: '1rem'
            }}
        >
            {isLoading ? <SpinLoading/> : <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
                <Row
                    className={`${styles.title} ${styles.full_width}`}
                >
                    <Typography.Title style={{ fontSize: '2rem' }}>
                        Mật khẩu
                    </Typography.Title>
                </Row>

                <FieldInput
                    field='Mật khẩu'
                    value={password}
                    span={breakPointMobile ? 24 : 11}
                    readOnly
                    addonAfter={isShowPassword ? <EyeTwoTone style={iconStyle} onClick={togglePassword} /> : <EyeInvisibleTwoTone style={iconStyle} onClick={togglePassword} />}
                    type={isShowPassword ? 'text' : 'password'}
                />

                <MyButton
                    value='Đổi mật khẩu'
                    backgroundColor={themeToken.mainColor}
                    color={themeToken.textColor}
                    span={breakPointMobile ? 24 : 11}
                    onClick={handleOpenModalChangePassowrd}
                    disabled={user.externalId}
                />
            </Row>}


            {/* Modal change password */}
            <ChangePasswordModal
                isOpenModalChangePassword={isOpenModalChangePassword}
                setIsOpenModalChangePassword={setIsOpenModalChangePassword}
            />

        </Col>
    )
}

export default Security