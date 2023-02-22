import { Col, Image, Modal, Row, Typography, theme } from "antd"

import styles from './styles.module.scss';
import ItemCV from "./ItemCV";
import ItemCreateNewCV from "./ItemCreateNewCV";
import { useEffect, useState } from "react";
import MyFieldInput from "../../components/MyFieldInput";
import { useSelector } from "react-redux";
import axios from "axios";
import SpinLoading from "../../components/SpinLoading";

const ManageCV = () => {

    const [loadingCreateCV, setLoadingCreateCV] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [cvName, setCvName] = useState('');
    const [resumes, setResumes] = useState([]);
    const [keyReRender, setKeyReRender] = useState(0);

    const themeToken = theme.useToken().token;
    const openNotification = useSelector(state => state.notification);
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);


    useEffect(() => {
        const fetching = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/cv/user/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                
                if (response.status === 200 && response.data.status) {
                    setResumes(response.data.resums)
                    setIsLoading(false);
                }
            } catch (err) {
                setResumes([])
                setIsLoading(false);
            }
        }

        setIsLoading(true);
        fetching().then(() => {
            setIsLoading(false);
        })
    }, [token, keyReRender, user.id])

    const handleCreateNewCV = async () => {
        if (cvName === '') return openNotification('error', 'Vui lòng đặt tên CV');

        try {
            setLoadingCreateCV(true);
            const data = {
                name: cvName,
                fullName: `${user.lastName} ${user.firstName}`,
                dob: user.dob,
                phone: user.phone,
                email: user.email,
                address: user.address,
                userId: user.id
            }
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/cv`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setLoadingCreateCV(false);
            if (response.data.status && response.status === 200) {
                setCvName('');
                setShowModal(false);
                setKeyReRender(keyReRender + 1);
                return openNotification('success', 'Tạo CV thành công');
            }

            openNotification('error', 'Có lỗi, vui lòng thử lại sau');
        } catch (err) {
            setLoadingCreateCV(false);
            openNotification('error', 'Có lỗi, vui lòng thử lại sau');
        }
    }

    const listCV = resumes.map(resume => (
        <ItemCV
            key={resume.id}
            resume={resume}
            keyReRender={keyReRender}
            setKeyReRender={setKeyReRender}
        />
    ))

    return (isLoading ? <SpinLoading height='calc(100vh - 66px)' /> :
        <Row
            className={styles.container}
        >
            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
                <Typography.Title>
                    Quản lý CV
                </Typography.Title>

                <Row style={{ width: '100%' }}>
                    {listCV}
                    <ItemCreateNewCV
                        setShowModal={setShowModal}
                    />
                </Row>
            </Row>


            <Modal
                title='Tạo mới CV'
                open={showModal}
                onCancel={() => setShowModal(false)}
                onOk={handleCreateNewCV}
                confirmLoading={loadingCreateCV}
            >
                <MyFieldInput
                    field='Tên CV'
                    fieldSize='1rem'
                    size='large'
                    placeholder='e.g CV dành cho...'
                    value={cvName}
                    onChange={(e) => setCvName(e.target.value)}
                />
            </Modal>
        </Row>
    )
}

export default ManageCV;