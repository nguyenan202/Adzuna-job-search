import { Button, Modal, Row, Skeleton, Typography, notification, theme } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import styles from './styles.module.scss';
import FieldPostSetting from "../FieldPostSetting";
import TextArea from "antd/es/input/TextArea";
import MyFieldInput from "../../../../components/MyFieldInput";
import { socket } from '../../../../App';


const LevelSetting = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [isLoadingModalUpdate, setIsLoadingModalUpdate] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [levels, setLevels] = useState(null);
    const [levelIdSelect, setLevelIdSelect] = useState(null);
    const [selected, setSelected] = useState(null);
    const [inputLevelName, setInputLevelName] = useState('');
    const [inputLevelDescription, setInputLevelDescription] = useState('');
    const [inputLevelNameUpdate, setInputLevelNameUpdate] = useState('');
    const [inputLevelDescriptionUpdate, setInputLevelDescriptionUpdate] = useState('');
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
        const fetchingLevel = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/level`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setLevels(response.data);
        }


        setIsLoading(true);
        fetchingLevel().then(() => {
            setIsLoading(false);
        });
    }, [token, keyRerender])

    useEffect(() => {
        const fetchingLevel = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/level/${levelIdSelect}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setSelected(response.data);
            setInputLevelNameUpdate(response.data ? response.data.name : '');
            setInputLevelDescriptionUpdate(response.data ? response.data.description : '');
        }

        fetchingLevel()
    }, [levelIdSelect, token])


    useEffect(() => {
        socket.on('update-level', () => {
            setTimeout(() => {
                setSelected(null);
                setLevelIdSelect(null);
                setLevels(null);

                setKeyRerender(keyRerender + 1);
            }, 2000)
        })
    }, [keyRerender])


    const handleCreateLevel = async () => {
        if (inputLevelName === '' || inputLevelDescription === '') {
            return openNotificationWithIcon('error', 'Không được để trống trường nào')
        }

        setIsLoadingModal(true);
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/level`, {
            name: inputLevelName,
            description: inputLevelDescription
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.data.status) {
            openNotificationWithIcon('success', 'Tạo cấp bậc thành công')
            setShowModal(false);
        } else {
            openNotificationWithIcon('error', 'Có lỗi, vui lòng thử lại sau')
        }

        setIsLoadingModal(false);
    }

    const handleUpdate = async () => {
        if (inputLevelNameUpdate === '' || inputLevelDescriptionUpdate === '') {
            return openNotificationWithIcon('error', 'Không được để trống trường nào')
        }

        setIsLoadingModalUpdate(true);
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/level`, {
            id: selected.id,
            name: inputLevelNameUpdate,
            description: inputLevelDescriptionUpdate
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.data.status) {
            openNotificationWithIcon('success', 'Sửa cấp bậc thành công')
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
                backgroundColor: themeToken.componentBackground
            }}
        >
            {levels && <FieldPostSetting
                title='Cấp bậc tuyển dụng'
                placeholder='e.g Senior'
                data={levels}
                onSelect={(id) => setLevelIdSelect(id)}
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
                title={<Typography.Title>Thêm cấp bậc</Typography.Title>}
                open={showModal}
                onCancel={() => {
                    setShowModal(false)
                    setInputLevelName('');
                    setInputLevelDescription('');
                }}
                onOk={handleCreateLevel}
                confirmLoading={isLoadingModal}
            >
                <MyFieldInput
                    field='Cấp bậc'
                    value={inputLevelName}
                    onChange={e => setInputLevelName(e.target.value)}
                    placeholder='Nhập tên cấp bậc'
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
                        value={inputLevelDescription}
                        onChange={e => setInputLevelDescription(e.target.value)}
                    ></TextArea>
                </Row>
            </Modal>

            {/* Modal update level */}
            {selected && <Modal
                title={<Typography.Title>Sửa cấp bậc</Typography.Title>}
                open={showModalUpdate}
                onCancel={() => {
                    setShowModalUpdate(false);
                    setInputLevelNameUpdate('');
                    setInputLevelDescriptionUpdate('');
                }}
                onOk={handleUpdate}
                confirmLoading={isLoadingModalUpdate}
            >
                <MyFieldInput
                    field='Cấp bậc'
                    value={inputLevelNameUpdate}
                    onChange={e => setInputLevelNameUpdate(e.target.value)}
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
                        value={inputLevelDescriptionUpdate}
                        onChange={e => setInputLevelDescriptionUpdate(e.target.value)}
                    ></TextArea>
                </Row>
            </Modal>}
        </Row>
    )
}

export default LevelSetting;