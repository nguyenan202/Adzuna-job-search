import { Button, Modal, Row, Skeleton, Typography, notification, theme } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import styles from './styles.module.scss';
import FieldPostSetting from "../FieldPostSetting";
import TextArea from "antd/es/input/TextArea";
import MyFieldInput from "../../../../components/MyFieldInput";
import { socket } from '../../../../App';


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
            return openNotificationWithIcon('error', 'Kh??ng ???????c ????? tr???ng tr?????ng n??o')
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
            openNotificationWithIcon('success', 'T???o h??nh th???c l??m vi???c th??nh c??ng')
            setShowModal(false);
        } else {
            openNotificationWithIcon('error', 'C?? l???i, vui l??ng th??? l???i sau')
        }

        setIsLoadingModal(false);
    }

    const handleUpdate = async () => {
        if (inputWTNameUpdate === '' || inputWTDescriptionUpdate === '') {
            return openNotificationWithIcon('error', 'Kh??ng ???????c ????? tr???ng tr?????ng n??o')
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
            openNotificationWithIcon('success', 'S???a h??nh th???c l??m vi???c th??nh c??ng')
            setShowModalUpdate(false);
        } else {
            openNotificationWithIcon('error', 'C?? l???i, vui l??ng th??? l???i sau')
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
                title='H??nh th???c l??m vi???c'
                placeholder='e.g To??n th???i gian'
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
                        >Thay ?????i</Button>
                    </Row>
                </>
            }

            {/* Modal Th??m Level */}
            <Modal
                title={<Typography.Title>Th??m h??nh th???c l??m vi???c</Typography.Title>}
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
                    field='H??nh th???c l??m vi???c'
                    value={inputWTName}
                    onChange={e => setInputWTName(e.target.value)}
                    placeholder='Nh???p t??n h??nh th???c'
                />

                <Row className={styles.full_width}>
                    <Typography.Paragraph
                        className={styles.title_field}
                    >
                        M?? t???
                    </Typography.Paragraph>
                    <TextArea
                        rows={5}
                        placeholder="Nh???p m?? t???"
                        style={{ resize: 'none' }}
                        value={inputWTDescription}
                        onChange={e => setInputWTDescription(e.target.value)}
                    ></TextArea>
                </Row>
            </Modal>

            {/* Modal update level */}
            {selected && <Modal
                title={<Typography.Title>S???a h??nh th???c l??m vi???c</Typography.Title>}
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
                    field='H??nh th???c l??m vi???c'
                    value={inputWTNameUpdate}
                    onChange={e => setInputWTNameUpdate(e.target.value)}
                />

                <Row className={styles.full_width}>
                    <Typography.Paragraph
                        className={styles.title_field}
                    >
                        M?? t???
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