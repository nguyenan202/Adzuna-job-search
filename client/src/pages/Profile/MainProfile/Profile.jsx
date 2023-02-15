import { Avatar, Button, Col, DatePicker, Input, Modal, Popover, Row, Typography, theme } from "antd"
import dayjs from 'dayjs'
import * as yup from 'yup';

import styles from './styles.module.scss'
import { useFormik } from "formik";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/store";
import ModalUploadAvatar from "./ModalUploadAvatar";
import ModalRemoveAvatar from "./ModalRemoveAvatar";
import useMediaQuery from "../../../hooks/useMediaQuery";

const content = <h3>Không thể sử dụng với các tài khoản đăng nhập bên thứ 3</h3>

const infoSchema = yup.object().shape({
    lastName: yup.string().required('Họ không được để trống'),
    firstName: yup.string().required('Tên không được để trống'),
    dob: yup.string().notRequired().nullable(),
    email: yup.string().email('Email không hợp lệ').required('Email không được trống'),
    address: yup.string().notRequired().nullable(),
    phone: yup.string().notRequired().nullable()
    .test(
        'Số điện thoại không hợp lệ',
        'Số điện thoại không hợp lệ',
        (value) => /^\d+$/.test(value)
    )
    .min(9, 'Độ dài số điện thoại từ 9-11')
    .max(11, 'Độ dài số điện thoại từ 9-11')
})

const InputField = ({ field, value, isInvalidMessage, ...props }) => {

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

const DatePickField = ({ field, value, ...props }) => {

    return (
        <Col span={props.span} style={{ margin: '0.5rem 0' }}>
            <Typography.Paragraph className={styles.title_field}>
                {field}
            </Typography.Paragraph>
            <DatePicker
                style={{ width: '100%' }}
                defaultValue={value && dayjs(`${value}`, 'DD/MM/YYYY')}
                format={'DD/MM/YYYY'}
                {...props}
            />
        </Col>
    )
}

const Profile = ({ layout, user }) => {

    const [statusUpdate, setStatusUpdate] = useState({})
    const [isSaveButton, setIsSaveButton] = useState(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [isOpenModalChangeAvatar, setIsOpenModalChangeAvatar] = useState(false);
    const [isOpenModalRemoveAvatar, setIsOpenModalRemoveAvatar] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [initValuesInfomation, setInitValuesInfomation] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        email: user.email,
        address: user.address,
        phone: user.phone
    });


    const themeToken = theme.useToken().token;
    const dispatch = useDispatch();
    const token = useSelector(state => state.token);

    const breakPointMobile = useMediaQuery('(max-width: 576px)')

    const formik = useFormik({
        initialValues: initValuesInfomation,
        validationSchema: infoSchema,
        onSubmit: (values, onSubmitProps) => {

            const newValues = {
                ...values,
                dob: initValuesInfomation.dob
            }

            formik.setValues(newValues);

            setIsOpenModalConfirm(true);
        }
    })

    const isInvalidMessageLastName = formik.touched.lastName && Boolean(formik.errors.lastName) && formik.errors.lastName;
    const isInvalidMessageFirstName = formik.touched.firstName && Boolean(formik.errors.firstName) && formik.errors.firstName;
    const isInvalidMessageEmail = formik.touched.email && Boolean(formik.errors.email) && formik.errors.email;
    const isInvalidMessagePhone = formik.touched.phone && Boolean(formik.errors.phone) && formik.errors.phone;

    const handleOke = async () => {
        setConfirmLoading(true);
        const dataUpdate = {
            ...formik.values,
            userId: user.id
        }

        const userResponse = await axios.patch(`${process.env.REACT_APP_API_URL}/user`, dataUpdate, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        dispatch(setUser({
            user: userResponse.data.user
        }))

        setStatusUpdate({
            status: userResponse.data.user.id ? 1 : 0,
            message: userResponse.data.user.id ? 'Cập nhập thông tin thành công' : 'Có lỗi, vui lòng thử lại sau'
        })
        setIsOpenModalConfirm(false);
        setConfirmLoading(false);
    }

    const handleChangeAvatar = () => {
        setIsOpenModalChangeAvatar(true);
    }

    const handleRemoveAvatar = () => {
        setIsOpenModalRemoveAvatar(true);
    }

    const avatarRow = (
        <Col
            className={styles.avatar_options}
            span={''}
            style={{
                margin: breakPointMobile && 0
            }}
        >
            <Button
                className={styles.avatar_btn}
                style={{
                    backgroundColor: themeToken.mainColor,
                    color: themeToken.textColor
                }}
                disabled={user.externalId}
                onClick={handleChangeAvatar}
            >
                Thay đổi ảnh
            </Button>
            <Button
                className={styles.avatar_btn}
                danger
                disabled={user.externalId}
                onClick={handleRemoveAvatar}
            >
                Xóa ảnh
            </Button>
        </Col>
    )


    return (
        <Col
            className={styles.container}
            span={layout}
        >
            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
                <Row className={styles.full_width} style={breakPointMobile ? { justifyContent: 'center' } : {}}>
                    <Typography.Title style={{ fontSize: '2rem' }}>
                        Ảnh đại diện
                    </Typography.Title>
                </Row>
                <Row className={styles.full_width}
                    style={{
                        flexDirection: breakPointMobile ? 'column' : 'unset'
                    }}
                >
                    <Col
                        span={''}
                        style={breakPointMobile && {
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Avatar
                            className={styles.avatar}
                            src={user.externalId ? user.picturePath : `${process.env.REACT_APP_API_URL}/images/${user.picturePath}`}
                            alt='avatar'
                            style={breakPointMobile && {
                                width: '10rem',
                                height: '10rem',
                                margin: '1rem 0'
                            }}
                        />
                    </Col>
                    {user.externalId ? <Popover content={content}>
                        {avatarRow}
                    </Popover> : avatarRow}
                </Row>
                <Row className={`${styles.full_width} ${styles.note}`}>
                    <Typography.Text>
                        Lưu ý: Dung lượng ảnh k được vượt quá 800 KB
                    </Typography.Text>
                </Row>
            </Row>

            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground,
                    margin: '1.5rem 0'
                }}
            >
                <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                    <Row className={styles.full_width}>
                        <Typography.Title style={{ fontSize: '2rem' }}>
                            Thông tin người dùng
                        </Typography.Title>
                    </Row>
                    <Row className={`${styles.infomation} ${styles.full_width}`}>
                        <InputField
                            field='ID'
                            value={`#${user.id}`}
                            span={breakPointMobile ? 24 : 11}
                            disabled
                        />
                        <InputField
                            field='Vai trò'
                            value={user.Role.name}
                            span={breakPointMobile ? 24 : 11}
                            disabled
                        />
                        <InputField
                            field='Ngày tạo tài khoản'
                            value={new Date(user.createdAt).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric'
                            })}
                            span={breakPointMobile ? 24 : 11}
                            disabled
                        />
                        <DatePickField
                            field='Ngày tháng năm sinh'
                            span={breakPointMobile ? 24 : 11}
                            name='dob'
                            onChange={(e) => {
                                setInitValuesInfomation(prev => {
                                    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                                    const myDate = e ? e.$d.toLocaleDateString('en-GB', options) : null;
                                    return {
                                        ...prev,
                                        dob: myDate
                                    }
                                });
                                setIsSaveButton(true);
                            }}
                            value={initValuesInfomation.dob}
                        />
                        <InputField
                            field='Họ'
                            span={breakPointMobile ? 24 : 11}
                            placeholder='Nhập họ của bạn'
                            name='lastName'
                            onChange={formik.handleChange}
                            onChangeCapture={() => setIsSaveButton(true)}
                            value={formik.values.lastName}
                            isInvalidMessage={isInvalidMessageLastName}
                            disabled={user.externalId}
                        />
                        <InputField
                            field='Tên'
                            span={breakPointMobile ? 24 : 11}
                            placeholder='Nhập tên của bạn'
                            name='firstName'
                            onChange={formik.handleChange}
                            onChangeCapture={() => setIsSaveButton(true)}
                            value={formik.values.firstName}
                            isInvalidMessage={isInvalidMessageFirstName}
                            disabled={user.externalId}
                        />
                        <InputField
                            field='Email'
                            span={breakPointMobile ? 24 : 11}
                            placeholder='Nhập email của bạn'
                            name='email'
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            isInvalidMessage={isInvalidMessageEmail}
                            disabled
                        />
                        <InputField
                            field='Số điện thoại'
                            span={breakPointMobile ? 24 : 11}
                            placeholder='Nhập số điện thoại'
                            name='phone'
                            onChange={formik.handleChange}
                            onChangeCapture={() => setIsSaveButton(true)}
                            value={formik.values.phone}
                            isInvalidMessage={isInvalidMessagePhone}
                        />
                        <InputField
                            field='Địa chỉ'
                            span={24}
                            placeholder='Nhập địa chỉ của bạn'
                            name='address'
                            onChange={formik.handleChange}
                            onChangeCapture={() => setIsSaveButton(true)}
                            value={formik.values.address}
                        />
                    </Row>

                    {statusUpdate.status && <Row
                        className={`${styles.full_width}`}
                        justify='center'
                    >
                        <Typography.Text style={{
                            fontSize: '1rem',
                            color: statusUpdate.status === 1 ? 'green' : 'red',
                            fontWeight: 500
                        }}>
                            {statusUpdate.message}
                        </Typography.Text>
                    </Row>}

                    {isSaveButton && <Row
                        className={`${styles.full_width} ${styles.btn_change}`}
                    >
                        <Button
                            style={{
                                backgroundColor: themeToken.mainColor,
                                color: themeToken.textColor,
                                width: breakPointMobile ? '100%' : 'auto'
                            }}
                            size='large'
                            htmlType='submit'
                        >
                            Lưu thay đổi
                        </Button>
                    </Row>}
                </form>
            </Row>


            {/* Modal confirm Update Profile */}
            <Modal
                open={isOpenModalConfirm}
                onOk={handleOke}
                onCancel={() => setIsOpenModalConfirm(false)}
                confirmLoading={confirmLoading}
                closeIcon={<></>}
            >
                <Row
                    style={{
                        width: '100%',
                        justifyContent: 'center'
                    }}
                >
                    <Typography.Paragraph style={{ fontSize: '1.5rem' }}>
                        Bạn có chắc muốn thay đổi thông tin
                    </Typography.Paragraph>
                </Row>
            </Modal>

            {/* Modal confirm remove avatar */}
            <ModalRemoveAvatar
                isOpenModalRemoveAvatar={isOpenModalRemoveAvatar}
                setIsOpenModalRemoveAvatar={setIsOpenModalRemoveAvatar}
            />

            {/* Modal change avatar */}
            <ModalUploadAvatar
                isOpenModalChangeAvatar={isOpenModalChangeAvatar}
                setIsOpenModalChangeAvatar={setIsOpenModalChangeAvatar}
            />
        </Col>
    )
}

export default Profile;