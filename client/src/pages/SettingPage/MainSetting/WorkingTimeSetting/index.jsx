import { Button, Modal, Row, Skeleton, Typography, notification, theme } from "antd"
import { socket } from "../../../../App";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import styles from './styles.module.scss';
import FieldPostSetting from "../FieldPostSetting";
import TextArea from "antd/es/input/TextArea";
import MyFieldInput from "../../../../components/MyFieldInput";



const WorkingTimeSetting = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [isLoadingModalUpdate, setIsLoadingModalUpdate] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [workingTimes, setWorkingTimes] = useState(null);
    const [wTIdSelect, setWTIdSelect] = useState(null);
    const [selected, setSelected] = useState(null);
    const [inputWTName, setInputWTName] = useState('');
    const [inputWTDescription, setInputWTDescription] = useState('');
    const [inputWTNameUpdate, setInputWTNameUpdate] = useState('');
    const [inputWTDescriptionUpdate, setInputWTDescriptionUpdate] = useState('');
    const [api, contextHolder] = notification.useNotification();

    const [keyRerender, setKeyRerender] = useState(0);

    const token = useSelector(state => state.token);
    const themeToken = theme.useToken().token;

    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            duration: 2
        });
    };

    useEffect(() => {
        const fetchingWorkingTimes = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/working-time`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setWorkingTimes(response.data);
        }


        setIsLoading(true);
        fetchingWorkingTimes().then(() => {
            setIsLoading(false);
        });
    }, [token, keyRerender])

    useEffect(() => {
        const fetchingLevel = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/working-time/${wTIdSelect}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setSelected(response.data);
            setInputWTNameUpdate(response.data ? response.data.name : '');
            setInputWTDescriptionUpdate(response.data ? response.data.description : '');
        }

        fetchingLevel()
    }, [wTIdSelect, token])


    useEffect(() => {
        socket.on('update-working-time', () => {
            setTimeout(() => {
                setSelected(null);
                setWTIdSelect(null);
                setWorkingTimes(null);

                setKeyRerender(keyRerender + 1);
            }, 2000)
        })
    }, [keyRerender])


    const handleCreateLevel = async () => {
        if (inputWTName === '' || inputWTDescription === '') {
            return openNotificationWithIcon('error', 'Không được để trống trường nào')
        }

        setIsLoadingModal(true);
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/working-time`, {
            name: inputWTName,
            description: inputWTDescription
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.data.status) {
            openNotificationWithIcon('success', 'Tạo hình thức làm việc thành công')
            setShowModal(false);
        } else {
            openNotificationWithIcon('error', 'Có lỗi, vui lòng thử lại sau')
        }

        setIsLoadingModal(false);
    }

    const handleUpdate = async () => {
        if (inputWTNameUpdate === '' || inputWTDescriptionUpdate === '') {
            return openNotificationWithIcon('error', 'Không được để trống trường nào')
        }

        setIsLoadingModalUpdate(true);
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/working-time`, {
            id: selected.id,
            name: inputWTNameUpdate,
            description: inputWTDescriptionUpdate
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.data.status) {
            openNotificationWithIcon('success', 'Sửa hình thức làm việc thành công')
            setShowModalUpdate(false);
        } else {
            openNotificationWithIcon('error', 'Có lỗi, vui lòng thử lại sau')
        }

        setIsLoadingModalUpdate(false);
    }

    return (isLoading ? <Skeleton active /> :
        <Row
            className={styles.sub_container}
            style={{
                width: '100%',
                marginTop: '1.5rem',
                backgroundColor: themeToken.componentBackground
            }}
        >
            {workingTimes && <FieldPostSetting
                title='Hình thức làm việc'
                placeholder='e.g Toàn thời gian'
                data={workingTimes}
                onSelect={(id) => setWTIdSelect(id)}
                onClickBtn={() => setShowModal(true)}
            />}

            {contextHolder}

            {/* Show Description */}
            {selected &&
                <>
                    <TextArea
                        rows={5}
                        value={selected.description}
                        readOnly
                        style={{ resize: 'none' }}
                    ></TextArea>
                    <Row
                        style={{
                            width: '100%',
                            margin: '1rem 0',
                            justifyContent: 'flex-end'
                        }}>
                        <Button
                            size="large"
                            style={{
                                width: '10rem',
                                backgroundColor: themeToken.mainColor,
                                color: themeToken.textColor
                            }}
                            onClick={() => setShowModalUpdate(true)}
                        >Thay đổi</Button>
                    </Row>
                </>
            }

            {/* Modal Thêm Level */}
            <Modal
                title={<Typography.Title>Thêm hình thức làm việc</Typography.Title>}
                open={showModal}
                onCancel={() => {
                    setShowModal(false)
                    setInputWTName('');
                    setInputWTDescription('');
                }}
                onOk={handleCreateLevel}
                confirmLoading={isLoadingModal}
            >
                <MyFieldInput
                    field='Hình thức làm việc'
                    value={inputWTName}
                    onChange={e => setInputWTName(e.target.value)}
                    placeholder='Nhập tên hình thức'
                />

                <Row className={styles.full_width}>
                    <Typography.Paragraph
                        className={styles.title_field}
                    >
                        Mô tả
                    </Typography.Paragraph>
                    <TextArea
                        rows={5}
                        placeholder="Nhập mô tả"
                        style={{ resize: 'none' }}
                        value={inputWTDescription}
                        onChange={e => setInputWTDescription(e.target.value)}
                    ></TextArea>
                </Row>
            </Modal>

            {/* Modal update level */}
            {selected && <Modal
                title={<Typography.Title>Sửa hình thức làm việc</Typography.Title>}
                open={showModalUpdate}
                onCancel={() => {
                    setShowModalUpdate(false);
                    setInputWTNameUpdate('');
                    setInputWTDescriptionUpdate('');
                }}
                onOk={handleUpdate}
                confirmLoading={isLoadingModalUpdate}
            >
                <MyFieldInput
                    field='Hình thức làm việc'
                    value={inputWTNameUpdate}
                    onChange={e => setInputWTNameUpdate(e.target.value)}
                />

                <Row className={styles.full_width}>
                    <Typography.Paragraph
                        className={styles.title_field}
                    >
                        Mô tả
                    </Typography.Paragraph>
                    <TextArea
                        rows={5}
                        style={{ resize: 'none' }}
                        value={inputWTDescriptionUpdate}
                        onChange={e => setInputWTDescriptionUpdate(e.target.value)}
                    ></TextArea>
                </Row>
            </Modal>}
        </Row>
    )
}

export default WorkingTimeSetting;