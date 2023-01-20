import { EyeInvisibleTwoTone, EyeTwoTone, LockTwoTone, MailTwoTone } from "@ant-design/icons";
import { Button, Col, Input, Row, Typography, theme } from "antd";
import styles from './style.module.scss';
import { useState } from "react";
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import axios from "axios";

import { setLogin } from "../../redux/store";
import { useNavigate } from "react-router-dom";

const iconStyle = { marginRight: '0.5rem', fontSize: '1.2rem', cursor: 'pointer' }

const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid Email').required('Email is required'),
    password: yup.string().min(8, 'Password should be of minimum 8 characters length').required('Password is required'),
});

const initValuesLogin = {
    email: '',
    password: ''
}

const LoginForm = () => {

    const [isShowPassword, setIsShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tokenTheme = theme.useToken().token;

    const togglePassword = () => {
        setIsShowPassword(!isShowPassword)
    }

    const formik = useFormik({
        initialValues: initValuesLogin,
        validationSchema: loginSchema,
        onSubmit: async (value, onSubmitProps) => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, value)

                const data = await response.data;

                dispatch(setLogin({
                    user: data.user,
                    token: data.token
                }))

                navigate('/')
            } catch (err) {
                const msg = err.response.data.message;
                onSubmitProps.setFieldError('email', msg);
            }
        }
    })

    const invalidEmail = formik.touched.email && Boolean(formik.errors.email);
    const invalidPassword = formik.touched.password && Boolean(formik.errors.password);

    return (
        <Row className={styles.input}>
            <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                <Col span={24} className={styles.field}>
                    <Typography style={invalidEmail ? { color: 'red' } : { color: '#000' }}>Email</Typography>
                    <Input
                        placeholder='Nhập email của bạn'
                        name='email'
                        prefix={<MailTwoTone style={iconStyle} />}
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        status={invalidEmail ? 'error' : ''}
                    />
                    {invalidEmail && <Typography style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'red' }}>
                        {formik.errors.email}
                    </Typography>}
                </Col>
                <Col span={24} className={styles.field}>
                    <Typography style={invalidPassword ? { color: 'red' } : { color: '#000' }}>Mật khẩu</Typography>
                    <Input
                        placeholder='Nhập mật khẩu'
                        name='password'
                        prefix={<LockTwoTone style={iconStyle} />}
                        addonAfter={isShowPassword ? <EyeTwoTone style={iconStyle} onClick={togglePassword} /> : <EyeInvisibleTwoTone style={iconStyle} onClick={togglePassword} />}
                        type={isShowPassword ? 'text' : 'password'}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        status={invalidPassword ? 'error' : ''}
                    />
                    {invalidPassword && <Typography style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'red' }}>
                        {formik.errors.password}
                    </Typography>}
                </Col>
                <Col span={24}>
                    <Button
                        type='primary'
                        className={styles.btn_login_register}
                        htmlType='submit'
                        style={{
                            backgroundColor: tokenTheme.mainColor
                        }}
                    >
                        Đăng nhập
                    </Button>
                </Col>
            </form>
        </Row>
    )
}

export default LoginForm