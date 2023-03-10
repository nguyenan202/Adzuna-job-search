import { Button, Modal, Radio, Row, Typography, theme } from "antd"
import TextAreaField from "../../components/TextAreaField"
import { useEffect, useState } from "react"
import axios from "axios";
import { useSelector } from "react-redux";
import SpinLoading from "../../components/SpinLoading";
import SelectField from "../../components/SelectField";
import { AiFillWarning } from "react-icons/ai";


const ModalApplyJob = ({ post, isShow, setIsShow }) => {

    const [fetchLoading, setFetchLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cvs, setCvs] = useState([]);
    const [cvIdSelected, setCvIdSelected] = useState(null);
    const [description, setDescription] = useState('');
    const [isEmptyCV, setIsEmptyCV] = useState(false);
    const [isEmptyDescription, setIsEmptyDescription] = useState(false);
    const [typeCV, setTypeCV] = useState(0);

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const themeToken = theme.useToken().token;
    const openNotification = useSelector(state => state.notification);
    
    useEffect(() => {
        const fetching = async () => {
            const typeCVFetching = typeCV === 0 ? 'cv' : 'cv-upload'
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/${typeCVFetching}/user/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.status === 200) {
                    setCvs(response.data.resums || response.data.allCvUpload)
                }
            } catch (err) {
                setCvs([])
            }
        }

        setFetchLoading(true);
        setCvs([]);
        fetching().then(() => {
            setFetchLoading(false);
        })
    }, [token, user.id, typeCV])

    const handleApply = async () => {
        if (description === '') setIsEmptyDescription(true);
        if (!cvIdSelected) setIsEmptyCV(true);
        if (description === '' || !cvIdSelected) return;

        let data = {
            description,
            userId: user.id,
            postId: post.id
        }

        if (typeCV === 0) {
            data = {
                ...data,
                CVId: cvIdSelected
            }
        } else if (typeCV === 1) {
            data = {
                ...data,
                picturePath: cvs.find(cv => cv.id === cvIdSelected).picturePath
            }
        }

        try {
            setIsLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/cv-apply`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200 && response.data.status) {
                openNotification('success', '???ng tuy???n th??nh c??ng');
                setIsShow(false);
            }
        } catch (err) {
            openNotification('error', 'C?? l???i, vui l??ng th??? l???i sau');
        }
        setIsLoading(false);
    }

    const handleOpenCVPDF = (e) => {
        e.preventDefault();
        const cvSelected = cvs.find(cv => cv.id === cvIdSelected);
        window.open(`${process.env.REACT_APP_API_URL}/images/${cvSelected.picturePath}`, '_blank', 'noopener,noreferrer')
    }
    
    return (
        <Modal
            open={isShow}
            onCancel={() => setIsShow(false)}
            confirmLoading={isLoading}
            onOk={handleApply}
        >
            <Typography.Title style={{ fontSize: '1.75rem' }}>
                ???ng tuy???n
            </Typography.Title>
            <TextAreaField
                field='Th?? ???ng tuy???n'
                fieldSize='1.2rem'
                placeholder='Vi???t gi???i thi???u ng???n g???n v??? b???n th??n (??i???m m???nh, ??i???m y???u) v?? n??u r?? mong mu???n, l?? do l??m vi???c t???i c??ng ty n??y. ????y l?? c??ch g??y ???n t?????ng v???i nh?? tuy???n d???ng n???u b???n c?? ch??a c?? kinh nghi???m l??m vi???c (ho???c CV kh??ng t???t).'
                rows={5}
                onChange={e => {
                    setIsEmptyDescription(false);
                    setDescription(e.target.value);
                }}
                isInvalidMessage={isEmptyDescription && 'H??y vi???t m???t ch??t v??? b???n th??n ????? nh?? tuy???n d???ng hi???u ???????c v??? b???n'}
            />
            <Radio.Group
                defaultValue={typeCV}
                buttonStyle="solid"
                onChange={e => {
                    setCvIdSelected(null);
                    setTypeCV(e.target.value);
                }}
            >
                <Radio.Button value={0}>CV Adzuna</Radio.Button>
                <Radio.Button value={1}>CV t???i l??n</Radio.Button>
            </Radio.Group>
            <SelectField
                field='CV'
                fieldSize='1.2rem'
                data={cvs}
                onSelect={(id) => {
                    setIsEmptyCV(false);
                    setCvIdSelected(id)
                }}
                notFoundContent={fetchLoading ? <SpinLoading height='auto'/> : 'Kh??ng c?? d??? li???u'}
                isInvalidMessage={isEmptyCV && 'H??y ch???n 1 CV ????? c?? th??? ???ng tuy???n'}
            />
            {cvIdSelected && <Row
                style={{
                    width: '100%'
                }}
            >
                <a
                    style={{
                        backgroundColor: themeToken.mainColor,
                        color: themeToken.textColor,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        borderRadius: '6px'
                    }}
                    href={`/cv/${cvIdSelected}/view-only/${user.id}`}
                    target="_blank"
                    rel='noreferrer'
                    onClick={typeCV === 1 ? handleOpenCVPDF : () => {}}
                >
                    Xem CV
                </a>
            </Row>}

            <Row style={{ width: '100%', margin: '1rem 0' }}>
                <Typography.Title style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontSize: '1.5rem', width: '100%' }}>
                    <AiFillWarning style={{ color: 'red' }} />
                    L??u ??
                </Typography.Title>
                <Typography.Paragraph style={{ marginBottom: '0.5rem' }}>
                    1. M???i tin b???n ch??? c?? th??? ???ng tuy???n t???i ??a 3 l???n.
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginBottom: '0.5rem' }}>
                    2. ????? c?? tr???i nghi???m t???t nh???t, b???n n??n s??? d???ng c??c tr??nh duy???t ph??? bi???n nh?? Google Chrome ho???c Firefox.
                </Typography.Paragraph>
            </Row>
        </Modal>
    )
}

export default ModalApplyJob