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
            return openNotificationWithIcon('error', 'Kh??ng ???????c ????? tr???ng tr?????ng n??o')
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
            openNotificationWithIcon('success', 'T???o c???p b???c th??nh c??ng')
            setShowModal(false);
        } else {
            openNotificationWithIcon('error', 'C?? l???i, vui l??ng th??? l???i sau')
        }

        setIsLoadingModal(false);
    }

    const handleUpdate = async () => {
        if (inputLevelNameUpdate === '' || inputLevelDescriptionUpdate === '') {
            return openNotificationWithIcon('error', 'Kh??ng ???????c ????? tr???ng tr?????ng n??o')
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
            openNotificationWithIcon('success', 'S???a c???p b???c th??nh c??ng')
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
                backgroundColor: themeToken.componentBackground
            }}
        >
            {levels && <FieldPostSetting
                title='C???p b???c tuy???n d???ng'
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
                        >Thay ?????i</Button>
                    </Row>
                </>
            }

            {/* Modal Th??m Level */}
            <Modal
                title={<Typography.Title>Th??m c???p b???c</Typography.Title>}
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
                    field='C???p b???c'
                    value={inputLevelName}
                    onChange={e => setInputLevelName(e.target.value)}
                    placeholder='Nh???p t??n c???p b???c'
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
                        value={inputLevelDescription}
                        onChange={e => setInputLevelDescription(e.target.value)}
                    ></TextArea>
                </Row>
            </Modal>

            {/* Modal update level */}
            {selected && <Modal
                title={<Typography.Title>S???a c???p b???c</Typography.Title>}
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
                    field='C???p b???c'
                    value={inputLevelNameUpdate}
                    onChange={e => setInputLevelNameUpdate(e.target.value)}
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
                        value={inputLevelDescriptionUpdate}
                        onChange={e => setInputLevelDescriptionUpdate(e.target.value)}
                    ></TextArea>
                </Row>
            </Modal>}
        </Row>
    )
}

export default LevelSetting;