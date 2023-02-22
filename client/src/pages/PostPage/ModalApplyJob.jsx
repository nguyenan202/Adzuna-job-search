import { Button, Modal, Row, Typography, theme } from "antd"
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

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const themeToken = theme.useToken().token;
    const openNotification = useSelector(state => state.notification);

    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/cv/user/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.status === 200 && response.data.status) {
                    setCvs(response.data.resums)
                }
            } catch (err) {
                setCvs([])
            }
        }

        setFetchLoading(true);
        fetching().then(() => {
            setFetchLoading(false);
        })
    }, [token, user.id])

    const handleApply = async () => {
        if (description === '') setIsEmptyDescription(true);
        if (!cvIdSelected) setIsEmptyCV(true);
        if (description === '' || !cvIdSelected) return;

        const data = {
            CVId: cvIdSelected,
            description,
            userId: user.id,
            postId: post.id
        }

        try {
            setIsLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/cv-apply`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200 && response.data.status) {
                openNotification('success', 'Ứng tuyển thành công');
                setIsShow(false);
            }
        } catch (err) {
            openNotification('error', 'Có lỗi, vui lòng thử lại sau');
        }
        setIsLoading(false);
    }

    return (fetchLoading ? <SpinLoading /> :
        <Modal
            open={isShow}
            onCancel={() => setIsShow(false)}
            confirmLoading={isLoading}
            onOk={handleApply}
        >
            <Typography.Title style={{ fontSize: '1.75rem' }}>
                Ứng tuyển
            </Typography.Title>
            <TextAreaField
                field='Thư ứng tuyển'
                fieldSize='1.2rem'
                placeholder='Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do làm việc tại công ty này. Đây là cách gây ấn tượng với nhà tuyển dụng nếu bạn có chưa có kinh nghiệm làm việc (hoặc CV không tốt).'
                rows={5}
                onChange={e => {
                    setIsEmptyDescription(false);
                    setDescription(e.target.value);
                }}
                isInvalidMessage={isEmptyDescription && 'Hãy viết một chút về bản thân để nhà tuyển dụng hiểu được về bạn'}
            />
            <SelectField
                field='CV'
                fieldSize='1.2rem'
                data={cvs}
                onSelect={(id) => {
                    setIsEmptyCV(false);
                    setCvIdSelected(id)
                }}
                isInvalidMessage={isEmptyCV && 'Hãy chọn 1 CV để có thể ứng tuyển'}
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
                >
                    Xem CV
                </a>
            </Row>}

            <Row style={{ width: '100%', margin: '1rem 0' }}>
                <Typography.Title style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontSize: '1.5rem', width: '100%' }}>
                    <AiFillWarning style={{ color: 'red' }} />
                    Lưu ý
                </Typography.Title>
                <Typography.Paragraph style={{ marginBottom: '0.5rem' }}>
                    1. Mỗi tin bạn chỉ có thể ứng tuyển tối đa 3 lần.
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginBottom: '0.5rem' }}>
                    2. Để có trải nghiệm tốt nhất, bạn nên sử dụng các trình duyệt phổ biến như Google Chrome hoặc Firefox.
                </Typography.Paragraph>
            </Row>
        </Modal>
    )
}

export default ModalApplyJob