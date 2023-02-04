import { Button, Input, Modal, Typography, notification, theme } from "antd"
import * as yup from 'yup'
import { useFormik } from "formik";
import axios from "axios";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
    password: yup.string().required('Không được trống trường này'),
    newPassword: yup.string()
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
        )
        .notOneOf([yup.ref('password')], 'Mật khẩu mới không được trùng với mật khẩu cũ'),
    reNewPassword: yup.string().required('Hãy nhập mật khẩu').oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp')
})

const initValue = {
    password: '',
    newPassword: '',
    reNewPassword: ''
}

const ChangePasswordModal = ({ isOpenModalChangePassword, setIsOpenModalChangePassword }) => {

    const [api, contextHolder] = notification.useNotification();

    const themeToken = theme.useToken().token;
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Đổi mật khẩu thành công',
            duration: 2,
        });
    };


    const formik = useFormik({
        initialValues: initValue,
        validationSchema: schema,
        onSubmit: async (values, onSubmitProps) => {

            try {

                const response = await axios.patch(`${process.env.REACT_APP_API_URL}/user/password`, {
                    email: user.email,
                    password: values.password,
                    newPassword: values.newPassword
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                openNotificationWithIcon('success');
                setIsOpenModalChangePassword(false);
            } catch (err) {
                const resp = err.response.data

                onSubmitProps.setFieldError('password', resp.message)
            }
        }
    })

    const invalidPassword = formik.touched.password && Boolean(formik.errors.password);
    const invalidNewPassword = formik.touched.newPassword && Boolean(formik.errors.newPassword);
    const invalidRePassword = formik.touched.reNewPassword && Boolean(formik.errors.reNewPassword);

    return (
        <Modal
            title='Thay đổi mật khẩu'
            open={isOpenModalChangePassword}
            onCancel={() => setIsOpenModalChangePassword(false)}
            footer={null}
        >
            {contextHolder}
            <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>

                <Input
                    placeholder='Nhập mật khẩu hiện tại'
                    style={{
                        margin: '0.5rem 0'
                    }}
                    type="password"
                    name='password'
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    status={invalidPassword && 'error'}
                />
                {invalidPassword && <Typography.Paragraph
                    style={{
                        marginBottom: '0.5rem',
                        color: 'red'
                    }}
                >
                    {formik.errors.password}
                </Typography.Paragraph>}

                <Input
                    placeholder='Nhập mật khẩu mới'
                    style={{
                        margin: '0.5rem 0'
                    }}
                    type="password"
                    name='newPassword'
                    onChange={formik.handleChange}
                    value={formik.values.newPassword}
                    status={invalidNewPassword && 'error'}
                />
                {invalidNewPassword && <Typography.Paragraph
                    style={{
                        marginBottom: '0.5rem',
                        color: 'red'
                    }}
                >
                    {formik.errors.newPassword}
                </Typography.Paragraph>}

                <Input
                    placeholder='Nhập lại mật khẩu'
                    style={{
                        margin: '0.5rem 0'
                    }}
                    type="password"
                    name='reNewPassword'
                    onChange={formik.handleChange}
                    value={formik.values.reNewPassword}
                    status={invalidRePassword && 'error'}
                />
                {invalidRePassword && <Typography.Paragraph
                    style={{
                        marginBottom: '0.5rem',
                        color: 'red'
                    }}
                >
                    {formik.errors.reNewPassword}
                </Typography.Paragraph>}

                <Button
                    style={{
                        marginTop: '1rem',
                        width: '100%',
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor
                    }}
                    htmlType="submit"
                >
                    Xác nhận
                </Button>

            </form>
        </Modal>
    )
}

export default ChangePasswordModal