
import { EyeInvisibleTwoTone, EyeTwoTone, LockTwoTone, MailTwoTone } from "@ant-design/icons";
import { Button, Col, Input, Row, Typography, theme } from "antd";
import styles from './style.module.scss';
import { useState } from "react";
import * as yup from 'yup';
import { useFormik } from 'formik'

const iconStyle = { marginRight: '0.5rem', fontSize: '1.2rem', cursor: 'pointer' }

const registerSchema = yup.object().shape({
    firstName: yup.string().required('Hãy nhập tên'),
    lastName: yup.string().required('Hãy nhập họ'),
    email: yup.string().email('Email không hợp lệ').required('Email không được trống'),
    password: yup.string()
        .required('Mật khẩu không được trống')
        .min(8, 'Mật khẩu phải có tối thiểu 8 kí tự')
        .test(
            'Mật khẩu hợp lệ',
            'Mật khẩu phải có tối thiểu 8 kí tự, ít nhất 1 chữ thường, 1 chữ hoa và 1 số hoặc 1 kí tự đặc biệt',
            (value, context) => {
                const hasUpperCase = /[A-Z]/.test(value);
                const hasLowerCase = /[a-z]/.test(value);
                const hasNumber = /[0-9]/.test(value);
                const hasSymbole = /[!@#%&]/.test(value);

                let validCondition = 0;
                const numberOfMustBeValidConditions = 3;
                const conditions = [hasUpperCase, hasLowerCase, hasNumber, hasSymbole];

                conditions.forEach(condition => condition ? validCondition++ : null)

                if (validCondition >= numberOfMustBeValidConditions) return true;

                return false;
            }
        ),
    rePassword: yup.string().required('Hãy nhập lại mật khẩu').oneOf([yup.ref('password')], 'Mật khẩu không khớp')
})

const initValuesRegister = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rePassword: ''
}

const RegisterForm = () => {

    const [isShowPassword, setIsShowPassword] = useState(false);

    const tokenTheme = theme.useToken().token;

    const togglePassword = () => {
        setIsShowPassword(!isShowPassword)
    }

    const formik = useFormik({
        initialValues: initValuesRegister,
        validationSchema: registerSchema,
        onSubmit: (values, onSubmitProps) => {
            console.log(values);
        }
    })


    const invalidLastName = formik.touched.lastName && Boolean(formik.errors.lastName);
    const invalidFirstName = formik.touched.firstName && Boolean(formik.errors.firstName);
    const invalidEmail = formik.touched.email && Boolean(formik.errors.email);
    const invalidPassword = formik.touched.password && Boolean(formik.errors.password);
    const invalidRePassword = formik.touched.rePassword && Boolean(formik.errors.rePassword);

    return (
        <Row className={styles.input}>
            <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                <Row justify='space-between' style={{ width: '100%' }}>
                    <Col xs={{ span: 24 }} sm={{ span: 11 }} className={styles.field}>
                        <Typography
                            style={invalidLastName ? {color: 'red'} : {color: '#000'}}
                        >
                            Họ
                        </Typography>
                        <Input
                            placeholder='Nhập họ'
                            prefix={<MailTwoTone style={iconStyle} />}
                            name='lastName'
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                            status={invalidLastName ? 'error' : ''}
                        />
                        {invalidLastName && <Typography style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'red' }}>
                            {formik.errors.lastName}
                        </Typography>}
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 11 }} className={styles.field}>
                        <Typography
                            style={invalidFirstName ? {color: 'red'} : {color: '#000'}}
                        >
                            Tên
                        </Typography>
                        <Input
                            placeholder='Nhập tên'
                            prefix={<MailTwoTone style={iconStyle} />}
                            name='firstName'
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                            status={invalidFirstName ? 'error' : ''}
                        />
                        {invalidFirstName && <Typography style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'red' }}>
                            {formik.errors.firstName}
                        </Typography>}
                    </Col>
                </Row>
                <Col span={24} className={styles.field}>
                    <Typography
                        style={invalidEmail ? {color: 'red'} : {color: '#000'}}
                    >
                        Email
                    </Typography>
                    <Input
                        placeholder='Nhập email của bạn'
                        prefix={<MailTwoTone style={iconStyle} />}
                        name='email'
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        status={invalidEmail ? 'error' : ''}
                    />
                    {invalidEmail && <Typography style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'red' }}>
                        {formik.errors.email}
                    </Typography>}
                </Col>
                <Col span={24} className={styles.field}>
                    <Typography
                        style={invalidPassword ? {color: 'red'} : {color: '#000'}}
                    >
                        Mật khẩu
                    </Typography>
                    <Input
                        placeholder='Nhập mật khẩu'
                        prefix={<LockTwoTone style={iconStyle} />}
                        addonAfter={isShowPassword ? <EyeTwoTone style={iconStyle} onClick={togglePassword} /> : <EyeInvisibleTwoTone style={iconStyle} onClick={togglePassword} />}
                        type={isShowPassword ? 'text' : 'password'}
                        name='password'
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        status={invalidPassword ? 'error' : ''}
                    />
                    {invalidPassword && <Typography style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'red' }}>
                        {formik.errors.password}
                    </Typography>}
                </Col>
                <Col span={24} className={styles.field}>
                    <Typography
                        style={invalidRePassword ? {color: 'red'} : {color: '#000'}}
                    >
                        Mật khẩu
                    </Typography>
                    <Input
                        placeholder='Nhập mật khẩu'
                        prefix={<LockTwoTone style={iconStyle} />}
                        type={isShowPassword ? 'text' : 'password'}
                        name='rePassword'
                        onChange={formik.handleChange}
                        value={formik.values.rePassword}
                        status={invalidRePassword ? 'error' : ''}
                    />
                    {invalidRePassword && <Typography style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'red' }}>
                        {formik.errors.rePassword}
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
                        Đăng kí
                    </Button>
                </Col>
            </form>
        </Row>
    )
}

export default RegisterForm;