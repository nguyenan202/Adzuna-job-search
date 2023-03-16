import { Button, Col, Image, Input, Modal, Row, Typography, theme } from "antd"

import styles from './styles.module.scss';
import ItemCV from "./ItemCV";
import ItemCreateNewCV from "./ItemCreateNewCV";
import { useEffect, useState } from "react";
import MyFieldInput from "../../components/MyFieldInput";
import { useSelector } from "react-redux";
import axios from "axios";
import SpinLoading from "../../components/SpinLoading";
import { AiOutlineCloudUpload } from "react-icons/ai";
import ItemCVUpload from "./ItemCVUpload";

const ManageCV = () => {

    const [isLoadingAutoFill, setIsLoadingAutoFill] = useState(false);
    const [loadingCreateCV, setLoadingCreateCV] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalUpload, setShowModalUpload] = useState(false);
    const [imageCV, setImageCV] = useState(null);
    const [cvNameUpload, setCvNameUpload] = useState({ error: false, value: '' })
    const [cvName, setCvName] = useState('');
    const [resumes, setResumes] = useState([]);
    const [resumesUpload, setResumesUpload] = useState([]);
    const [showModalAutoFill, setShowModalAutoFill] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [keyReRender, setKeyReRender] = useState(0);

    const themeToken = theme.useToken().token;
    const openNotification = useSelector(state => state.notification);
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);


    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/cv/user/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                const response_cvUpload = await axios.get(`${process.env.REACT_APP_API_URL}/cv-upload/user/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.status === 200 && response.data.status && response_cvUpload.status === 200) {
                    setResumes(response.data.resums)
                    setResumesUpload(response_cvUpload.data.allCvUpload);
                }
            } catch (err) {
                setResumes([]);
                setResumesUpload([]);
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

    const handleUpload = async () => {
        if (!imageCV) openNotification('error', 'Hãy chọn 1 CV trước khi tải lên')
        if (cvNameUpload.value === '') setCvNameUpload({
            ...cvNameUpload,
            error: true
        })
        if (!imageCV || cvNameUpload.value === '') return;

        setLoadingUpload(true);
        try {
            const data = new FormData();
            data.append('name', cvNameUpload.value);
            data.append('userId', user.id);
            data.append('picture', imageCV);

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/cv-upload`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                openNotification('success', 'Tải CV lên thành công');
                setShowModalUpload(false);
                setKeyReRender(keyReRender + 1);
            }

        } catch (err) {
            openNotification('error', 'Có lỗi, vui lòng thử lại sau');
        }
        setLoadingUpload(false);
    }

    const handleFillCV = async () => {
        
    }

    const listCV = resumes.map(resume => (
        <ItemCV
            key={resume.id}
            resume={resume}
            keyReRender={keyReRender}
            setKeyReRender={setKeyReRender}
        />
    ))

    const listCVUpload = resumesUpload.map(resume => (
        <ItemCVUpload
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
                <Row style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography.Title>
                        Quản lý CV
                    </Typography.Title>
                    <Button
                        size='large'
                        style={{
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor
                        }}
                        onClick={() => setShowModalAutoFill(true)}
                    >
                        <AiOutlineCloudUpload style={{ marginRight: '0.5rem', fontSize: '1rem' }} /> Tải + Autofill CV
                    </Button>
                </Row>

                <Row style={{ width: '100%' }}>
                    {listCV}
                    <ItemCreateNewCV
                        setShowModal={setShowModal}
                    />
                </Row>
            </Row>

            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground,
                    marginTop: '2rem'
                }}
            >
                <Row style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography.Title style={{ margin: 0 }}>
                        CV đã tải lên
                    </Typography.Title>
                    <Button
                        size='large'
                        style={{
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor
                        }}
                        onClick={() => setShowModalUpload(true)}
                    >
                        <AiOutlineCloudUpload style={{ marginRight: '0.5rem', fontSize: '1rem' }} /> Tải CV lên
                    </Button>
                </Row>
                <Row style={{ width: '100%' }}>
                    {listCVUpload}
                </Row>
            </Row>

            {/* Modal create CV */}
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

            {/* Modal Upload CV */}
            <Modal
                title='Chọn CV bạn muốn tải lên'
                open={showModalUpload}
                onOk={handleUpload}
                confirmLoading={loadingUpload}
                onCancel={() => setShowModalUpload(false)}
            >
                <Button
                    size='large'
                    style={{
                        width: '100%',
                        margin: '1rem 0',
                        padding: 0,
                        height: 'auto',
                        border: `1px dashed ${themeToken.mainColor}`
                    }}

                >
                    <label htmlFor="input-upload-cv" style={{ width: '100%', height: '100%', padding: '1rem 0', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        {imageCV ? <Typography.Text>{imageCV.name}</Typography.Text> :
                            <>
                                <AiOutlineCloudUpload style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                                <Typography.Text>Chọn 1 CV</Typography.Text>
                            </>
                        }
                    </label>
                </Button>
                <Input
                    id='input-upload-cv'
                    type="file"
                    accept=".pdf"
                    style={{
                        display: 'none'
                    }}
                    onChange={(e) => setImageCV(e.target.files[0])}
                />
                <MyFieldInput
                    size='large'
                    field='Tên CV'
                    fieldSize='1rem'
                    placeholder='e.g CV dành cho...'
                    value={cvNameUpload.value}
                    onChange={e => setCvNameUpload({
                        error: false,
                        value: e.target.value
                    })}
                    isInvalidMessage={cvNameUpload.error && 'Không được bỏ trống trường này'}
                />
            </Modal>

            {/* Modal Upload CV + Autofill */}
            <Modal
                title='Autofill CV'
                open={showModalAutoFill}
                onCancel={() => setShowModalAutoFill(false)}
                onOk={handleFillCV}
                confirmLoading={isLoadingAutoFill}
            >
                <label
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '80px',
                        outline: `1px dashed ${themeToken.mainColor}`,
                        cursor: 'pointer'
                    }}
                    htmlFor="upload-fill-cv"
                >
                    {pdfFile ? pdfFile.name : `Chọn CV tải lên (.pdf)`}
                </label>
                <input type="file" id='upload-fill-cv' hidden accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
            </Modal>
        </Row>
    )
}

export default ManageCV;