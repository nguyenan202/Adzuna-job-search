import { Button, Modal, Row, Typography, theme } from "antd"
import MyFieldInput from "../../components/MyFieldInput";
import { useRef, useState } from "react";
import * as yup from 'yup';
import { useFormik } from 'formik'
import { useSelector } from "react-redux";
import emailjs from '@emailjs/browser';
import axios from 'axios';

const changePassSchema = yup.object().shape({
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
    password: '',
    rePassword: ''
}

const ForGotPassword = ({ show, setShow }) => {

    const [isLoadingSendMail, setIsLoadingSendMail] = useState(false);
    const [currentPin, setCurrentPin] = useState(null);
    const [canChangePassword, setCanChangePassword] = useState(false);
    const [keyRender, setKeyRender] = useState(0);

    const form = useRef();

    const openNotification = useSelector(state => state.notification);
    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);

    const handleSendEmail = async (e) => {
        e.preventDefault();

        //Check exist email
        try {
            const userEmail = form.current.querySelector('.user_email').value
            
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/email/${userEmail}`)

            if (response.status !== 200) return;
        }catch(err) {
            openNotification('error', err.response.data.message);
            setCurrentPin(null);
            return;
        }

        // If email not exist send code to reset password
        let randomPin = Math.random().toString(36).substring(2, 8);

        setIsLoadingSendMail(true);
        setCurrentPin(() => randomPin);
        form.current.querySelector('.pin').value = randomPin;

        await emailjs.sendForm('service_q2prvch', 'template_kzqmvi5', form.current, 'xL5FFXTq7i8sc2iPZ')
            .then((result) => {
                openNotification('success', 'Mã xác nhận đã được gửi tới email của bạn');
            }, (error) => {
                openNotification('error', 'Có lỗi, vui lòng thử lại sau');
            });
            setIsLoadingSendMail(false);
    }


    const formik = useFormik({
        initialValues: initValuesRegister,
        validationSchema: changePassSchema,
        onSubmit: async (values, onSubmitProps) => {
            try {
                const userEmail = form.current.querySelector('.user_email').value
                const response = await axios.patch(`${process.env.REACT_APP_API_URL}/user/email/password`, {
                    email: userEmail,
                    password: values.password,
                });

                if (response.status === 200) {
                    openNotification('success', response.data.message);
                    setKeyRender(keyRender+1);
                    setShow(false);
                }
            } catch (err) {
                openNotification('error', err.response.data.message);
            }
        }
    })

    const invalidPassword = formik.touched.password && Boolean(formik.errors.password);
    const invalidRePassword = formik.touched.rePassword && Boolean(formik.errors.rePassword);

    return (
        <Modal
            title={<Typography.Title style={{ fontSize: '1.5rem' }}>Lấy lại mật khẩu bằng email</Typography.Title>}
            open={show}
            onCancel={() => setShow(false)}
            footer={null}
            key={keyRender}
        >
            <form ref={form}>
                <MyFieldInput
                    className='pin'
                    name='pin'
                    type='hidden'
                    value={currentPin}
                />
                <MyFieldInput
                    className='user_email'
                    field='Nhập email'
                    fieldSize='1rem'
                    placeholder='e.g hahahihi@gmail.com'
                    name='user_email'
                />
                <Row style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button
                        style={{ backgroundColor: themeToken.mainColor, color: themeToken.textColor, opacity: isLoadingSendMail && 0.8, cursor: isLoadingSendMail && 'wait' }}
                        htmlType="submit"
                        onClick={handleSendEmail}
                        disabled={isLoadingSendMail}
                    >
                        {currentPin ?
                            'Gửi lại mã xác nhận' :
                            'Gửi mã xác nhận'
                        }
                    </Button>
                </Row>
            </form>

            {(currentPin && !isLoadingSendMail) &&
                <MyFieldInput
                    field='Nhập mã pin đc gửi tới email'
                    placeholder='Mã pin gồm 6 chữ số'
                    onChange={e => e.target.value === currentPin ? setCanChangePassword(true) : setCanChangePassword(false)}
                />

            }
            {canChangePassword &&
                <form onSubmit={formik.handleSubmit}>
                    <MyFieldInput
                        type='password'
                        field='Nhập mật khẩu mới'
                        fieldSize='1rem'
                        placeholder='mật khẩu phải trên 8 ký tự bao gồm chữ hoa, chữ thường và số'
                        name='password'
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        status={invalidPassword ? 'error' : ''}
                        isInvalidMessage={invalidPassword && formik.errors.password}
                    />
                    <MyFieldInput
                        type='password'
                        field='Nhập lại mật khẩu mới'
                        fieldSize='1rem'
                        placeholder='mật khẩu mới của bạn'
                        name='rePassword'
                        onChange={formik.handleChange}
                        value={formik.values.rePassword}
                        status={invalidRePassword ? 'error' : ''}
                        isInvalidMessage={invalidRePassword && formik.errors.rePassword}
                    />
                    <Row style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <Button
                            htmlType="submit"
                            style={{ backgroundColor: themeToken.mainColor, color: themeToken.textColor }}
                        >
                            Đổi mật khẩu
                        </Button>
                    </Row>
                </form>
            }
        </Modal>
    )
}

export default ForGotPassword;