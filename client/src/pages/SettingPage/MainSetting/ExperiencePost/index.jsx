import { Button, Modal, Row, Skeleton, Typography, notification, theme } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import styles from './styles.module.scss';
import FieldPostSetting from "../FieldPostSetting";
import TextArea from "antd/es/input/TextArea";
import MyFieldInput from "../../../../components/MyFieldInput";
import { socket } from '../../../../App';


const ExperiencePost = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [isLoadingModalUpdate, setIsLoadingModalUpdate] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [posts, setPosts] = useState(null);
    const [ePIdSelect, setEPIdSelect] = useState(null);
    const [selected, setSelected] = useState(null);
    const [inputEPName, setInputEPName] = useState('');
    const [inputEPDescription, setInputEPDescription] = useState('');
    const [inputEPNameUpdate, setInputEPNameUpdate] = useState('');
    const [inputEPDescriptionUpdate, setInputEPDescriptionUpdate] = useState('');
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
        const fetchingExperiencePosts = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/experience-post`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setPosts(response.data);
        }


        setIsLoading(true);
        fetchingExperiencePosts().then(() => {
            setIsLoading(false);
        });
    }, [token, keyRerender])

    useEffect(() => {
        const fetchingExperiencePost = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/experience-post/${ePIdSelect}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setSelected(response.data);
            setInputEPNameUpdate(response.data ? response.data.name : '');
            setInputEPDescriptionUpdate(response.data ? response.data.description : '');
        }

        fetchingExperiencePost();
    }, [ePIdSelect, token])


    useEffect(() => {
        socket.on('update-experience-post', () => {
            setTimeout(() => {
                setSelected(null);
                setEPIdSelect(null);
                setPosts(null);

                setKeyRerender(keyRerender + 1);
            }, 2000)
        })
    }, [keyRerender])


    const handleCreateExperiencePost = async () => {
        if (inputEPName === '' || inputEPDescription === '') {
            return openNotificationWithIcon('error', 'Kh??ng ???????c ????? tr???ng tr?????ng n??o')
        }

        setIsLoadingModal(true);
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/experience-post`, {
            name: inputEPName,
            description: inputEPDescription
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.data.status) {
            openNotificationWithIcon('success', 'T???o kinh nghi???m th??nh c??ng')
            setShowModal(false);
        } else {
            openNotificationWithIcon('error', 'C?? l???i, vui l??ng th??? l???i sau')
        }

        setIsLoadingModal(false);
    }

    const handleUpdate = async () => {
        if (inputEPNameUpdate === '' || inputEPDescriptionUpdate === '') {
            return openNotificationWithIcon('error', 'Kh??ng ???????c ????? tr???ng tr?????ng n??o')
        }

        setIsLoadingModalUpdate(true);
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/experience-post`, {
            id: selected.id,
            name: inputEPNameUpdate,
            description: inputEPDescriptionUpdate
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.data.status) {
            openNotificationWithIcon('success', 'S???a kinh nghi???m th??nh c??ng')
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
            {posts && <FieldPostSetting
                title='Kinh nghi???m tuy???n d???ng'
                placeholder='e.g Kh??ng y??u c???u kinh nghi???m'
                data={posts}
                onSelect={(id) => setEPIdSelect(id)}
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

            {/* Modal Th??m Experience Post */}
            <Modal
                title={<Typography.Title>Th??m kinh nghi???m</Typography.Title>}
                open={showModal}
                onCancel={() => {
                    setShowModal(false)
                    setInputEPName('');
                    setInputEPDescription('');
                }}
                onOk={handleCreateExperiencePost}
                confirmLoading={isLoadingModal}
            >
                <MyFieldInput
                    field='Kinh nghi???m'
                    value={inputEPName}
                    onChange={e => setInputEPName(e.target.value)}
                    placeholder='Nh???p kinh nghi???m'
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
                        value={inputEPDescription}
                        onChange={e => setInputEPDescription(e.target.value)}
                    ></TextArea>
                </Row>
            </Modal>

            {/* Modal update Experience Post */}
            {selected && <Modal
                title={<Typography.Title>S???a kinh nghi???m</Typography.Title>}
                open={showModalUpdate}
                onCancel={() => {
                    setShowModalUpdate(false);
                    setInputEPNameUpdate('');
                    setInputEPDescriptionUpdate('');
                }}
                onOk={handleUpdate}
                confirmLoading={isLoadingModalUpdate}
            >
                <MyFieldInput
                    field='Kinh nghi???m'
                    value={inputEPNameUpdate}
                    onChange={e => setInputEPNameUpdate(e.target.value)}
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
                        value={inputEPDescriptionUpdate}
                        onChange={e => setInputEPDescriptionUpdate(e.target.value)}
                    ></TextArea>
                </Row>
            </Modal>}
        </Row>
    )
}

export default ExperiencePost;