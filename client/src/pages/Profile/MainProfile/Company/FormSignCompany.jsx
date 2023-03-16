import { Button, Col, Modal, Row, Typography, notification, theme } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import styles from './styles.module.scss';
import MyFieldInput from '../../../../components/MyFieldInput';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import { useReducer, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const initState = {
    title: {
        error: false,
        message: null,
        input: '',
    },
    name: {
        error: false,
        message: null,
        input: '',
    },
    reason: {
        error: false,
        message: null,
        input: '',
    },
    url: {
        error: false,
        message: null,
        input: '',
    },
    taxCode: {
        error: false,
        message: null,
        input: '',
    },
    businessCode: {
        error: false,
        message: null,
        input: '',
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'changeTitle':
            const error_title = action.payload.length < 8;
            const message_title = error_title && 'Tiêu đề quá ngắn (ít nhất 8 ký tự)';

            return {
                ...state,
                title: {
                    error: error_title,
                    message: message_title,
                    input: action.payload
                }
            }
        case 'changeName':
            return {
                ...state,
                name: {
                    ...state.name,
                    input: action.payload
                }
            }
        case 'changeReason':
            const error_reason = action.payload.length < 20;
            const message_reason = error_reason && 'Nội dung quá ngắn (ít nhất 20 ký tự)';

            return {
                ...state,
                reason: {
                    error: error_reason,
                    message: message_reason,
                    input: action.payload
                }
            }
        case 'changeUrl':
            const regex = /^(ftp|http|https):\/\/[^ "]+$/;
            const error_url = !regex.test(action.payload);
            const message_url = error_url && 'Vui lòng nhập một địa chỉ website hợp lệ';

            return {
                ...state,
                url: {
                    error: error_url,
                    message: message_url,
                    input: action.payload
                }
            }
        case 'changeTaxCode':
            const error_tax = action.payload.length < 10;
            const message_tax = error_tax && 'Mã số thuế có ít nhất 10 ký tự';

            return {
                ...state,
                taxCode: {
                    error: error_tax,
                    message: message_tax,
                    input: action.payload
                }
            }
        case 'changeBussinessCode':
            const error_bc = action.payload.length < 10;
            const message_bc = error_bc && 'Mã số doanh nghiệp có ít nhất 10 ký tự';

            return {
                ...state,
                businessCode: {
                    error: error_bc,
                    message: message_bc,
                    input: action.payload
                }
            }
        case 'clearData':
            return initState

        default:
            return state
    }
}

const FormSignCompany = ({ keyRerender, setKeyRerender }) => {

    const [state, dispatch] = useReducer(reducer, initState);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);
    const user = useSelector(state => state.user);

    const breakPointMobile = useMediaQuery('(max-width: 576px)');

    const openNotificationWithIcon = (type) => {
        type === 'success' && api[type]({
            message: 'Đăng ký công ty thành công',
            duration: 2,
        });

        type === 'error' && api[type]({
            message: 'Có lỗi vui lòng thử lại sau',
            duration: 2,
        })
    };

    const handleSign = () => {
        //check all field have no error
        const checkNoError = Object.values(state).map(value => value.error).every(error => error === false);
        const checkFieldNotEmpty = Object.values(state).map(value => value.input === '').every(status => status === false);

        if (checkNoError && checkFieldNotEmpty) setIsOpenModal(true);
    }

    const handleSubmitForm = async () => {

        setIsLoadingConfirm(true);
        const data = Object.fromEntries(
            Object.entries(state).map(([key, value]) => ([key, value.input]))
        );

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/company`, {
            userId: user.id,
            ...data
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.data.id) {
            openNotificationWithIcon('success')
            dispatch({ type: 'clearData' })
        } else openNotificationWithIcon('error')

        setIsOpenModal(false);
        setIsLoadingConfirm(false);
        setKeyRerender(keyRerender + 1);
    }


    const handleChangeTitle = (e) => {
        dispatch({
            type: 'changeTitle',
            payload: e.target.value
        })
    }

    const handleChangeName = (e) => {
        dispatch({
            type: 'changeName',
            payload: e.target.value
        })
    }

    const handleChangeReason = (e) => {
        dispatch({
            type: 'changeReason',
            payload: e.target.value
        })
    }

    const handleChangeUrl = (e) => {
        dispatch({
            type: 'changeUrl',
            payload: e.target.value
        })
    }

    const handleChangeTaxCode = (e) => {
        dispatch({
            type: 'changeTaxCode',
            payload: e.target.value
        })
    }

    const handleChangeBussinessCode = (e) => {
        dispatch({
            type: 'changeBussinessCode',
            payload: e.target.value
        })
    }

    return (
        <>
            {contextHolder}
            <Row
                className={styles.full_width}
            >
                <Typography.Title style={{ fontSize: '2rem' }}>
                    Đăng kí công ty
                </Typography.Title>
            </Row>

            <Row
                className={styles.full_width}
            >
                <MyFieldInput
                    placeholder='Nhập tiêu đề'
                    field='Title'
                    span={24}
                    size='large'
                    value={state.title.input}
                    onChange={handleChangeTitle}
                    status={state.title.error && 'error'}
                    isInvalidMessage={state.title.error && state.title.message}
                />

                <MyFieldInput
                    placeholder='Nhập tên công ty'
                    field='Tên công ty'
                    span={24}
                    size='large'
                    value={state.name.input}
                    onChange={handleChangeName}
                    status={state.name.error && 'error'}
                    isInvalidMessage={state.name.error && state.name.message}
                />

                <Col span={24} style={{ margin: '0.5rem 0' }}>
                    <Typography.Paragraph
                        style={{
                            marginBottom: '0.25rem',
                            fontSize: '1rem',
                            fontWeight: 500
                            // color: isInvalidMessage && 'red'
                        }}
                    >
                        Nội dung
                    </Typography.Paragraph>
                    <TextArea
                        placeholder='Nhập nội dung'
                        rows={4}
                        autoSize={false}
                        style={{ resize: 'none' }}
                        onChange={handleChangeReason}
                        status={state.reason.error && 'error'}
                        value={state.reason.input}
                    >

                    </TextArea>
                    {state.reason.error && <Typography.Text style={{ fontSize: '0.8rem', color: 'red' }}>
                        {state.reason.message}
                    </Typography.Text>}
                </Col>

                <MyFieldInput
                    placeholder='Nhập mã số thuế'
                    field='Mã số thuế'
                    span={24}
                    size='large'
                    value={state.taxCode.input}
                    onChange={handleChangeTaxCode}
                    status={state.taxCode.error && 'error'}
                    isInvalidMessage={state.taxCode.error && state.taxCode.message}
                />

                <MyFieldInput
                    placeholder='Nhập mã số doanh nghiệp'
                    field='Mã số doanh nghiệp'
                    span={24}
                    size='large'
                    value={state.businessCode.input}
                    onChange={handleChangeBussinessCode}
                    status={state.businessCode.error && 'error'}
                    isInvalidMessage={state.businessCode.error && state.businessCode.message}
                />

                <MyFieldInput
                    placeholder='https://adzuna.com'
                    field='Website công ty'
                    span={24}
                    size='large'
                    value={state.url.input}
                    onChange={handleChangeUrl}
                    status={state.url.error && 'error'}
                    isInvalidMessage={state.url.error && state.url.message}
                />
            </Row>

            <Col
                className={`${styles.btn_submit_container}`}
                span={breakPointMobile ? 24 : 11}
            >
                <Button
                    className={styles.btn_submit}
                    size='large'
                    style={{
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor
                    }}
                    onClick={handleSign}
                >
                    Gửi đăng kí
                </Button>
            </Col>

            <Modal
                title='Xác nhận'
                open={isOpenModal}
                onCancel={() => setIsOpenModal(false)}
                onOk={handleSubmitForm}
                confirmLoading={isLoadingConfirm}
            >
                Xác nhận đăng ký công ty
            </Modal>
        </>
    )
}

export default FormSignCompany;