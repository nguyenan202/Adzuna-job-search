import { Button, Col, Image, Modal, Row, Tag, Typography, theme } from "antd";
import { BiPaperPlane, BiTimeFive } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import useMediaQuery from "../../hooks/useMediaQuery";

import styles from './styles.module.scss';
import DatePickField from "../../components/DatePickField";
import axios from "axios";
import { useSelector } from "react-redux";
import ModalApplyJob from "./ModalApplyJob";
import { useState } from "react";

const HeaderPost = ({ post, user, keyReRender, setKeyReRender, applies }) => {

    const [showModalUpdateDate, setShowModalUpdateDate] = useState(false);
    const [date, setDate] = useState({
        error: false,
        value: null
    })
    const [loadingChangeDate, setLoadingChangeDate] = useState(false);
    const [showModalApply, setShowModalApply] = useState(false);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);
    const openNotificationWithIcon = useSelector(state => state.notification);

    const breakpointTablet = useMediaQuery('(max-width: 762px)');
    const breakpointMobile = useMediaQuery('(max-width: 576px)');

    // Kiểm tra xem có phải chủ bài đăng k
    const isPostUpper = user.id === post.Conpany.userId;
    // Kiểm tra xem bài đăng đã quá hạn chưa
    const isOutDate = Math.floor((new Date(post.endAt) - new Date()) / (1000 * 60 * 60 * 24)) + 1 <= 0;

    const handleSelectDate = (d) => {
        const dateSelect = d.toISOString().slice(0, 10);

        // Ngày gia hạn phải lớn hơn ngày hiện tại
        const isValidDate = Math.floor(new Date(dateSelect) - new Date()) / (1000 * 60 * 60 * 24) > 0;

        if (!isValidDate) return setDate({
            error: true,
            value: dateSelect
        })

        setDate({
            error: false,
            value: dateSelect
        })
    }

    const handleChangeDate = async () => {
        if (date.error || !date.value) return setDate({ error: true, value: null });

        setLoadingChangeDate(true);
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/post`, {
                id: post.id,
                endAt: date.value
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.data.status) {
                openNotificationWithIcon('success', 'Cập nhật thành công');
                setLoadingChangeDate(false);
                setShowModalUpdateDate(false);
                setKeyReRender(keyReRender + 1);
            }
        } catch (err) {
            openNotificationWithIcon('error', 'Có lỗi, vui lòng thử lại sau');
            setLoadingChangeDate(false);
        }

    }

    return (
        <Row
            className={styles.header}
            style={{
                backgroundColor: themeToken.componentBackground
            }}
        >
            <Col span={breakpointTablet ? 24 : 5}>
                <Image
                    src={`${process.env.REACT_APP_API_URL}/images/${post.Conpany.picturePath}`}
                    preview={false}
                    style={{
                        width: '10rem',
                        height: '10rem',
                        objectFit: 'contain',
                        padding: '0.2rem',
                        border: '1px solid #ccc'
                    }}
                />
            </Col>

            <Col
                className={styles.company_info}
                span={breakpointTablet ? 24 : 14}
            >
                <Row>
                    <Typography.Title style={{ color: themeToken.mainColor, marginBottom: '1rem' }}>
                        {post.title}
                    </Typography.Title>
                </Row>
                <Row>
                    <Typography.Title style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                        {post.Conpany.name}
                    </Typography.Title>
                </Row>
                <Row>
                    <Col
                        span={breakpointMobile ? 24 : 12}
                    >
                        <Typography.Paragraph style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: '1rem', opacity: '0.8' }}>
                            <BiTimeFive style={{ marginRight: '0.5rem' }} />
                            {`Hạn nộp hồ sơ ${post.endAt}`}
                        </Typography.Paragraph>
                    </Col>
                </Row>
                {applies.length > 0 && <Row>
                    <Col
                        span={24}
                    >
                        <Typography.Paragraph style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                            {`Bạn đã ứng tuyển công việc này lần cuối ${applies[applies.length - 1].createdAt.slice(0, 10)}`}
                        </Typography.Paragraph>
                    </Col>
                </Row>}
            </Col>

            <Col
                span={breakpointTablet ? 24 : 5}
                style={{
                    padding: '1rem 0'
                }}
            >
                <Row style={{
                    width: '100%',
                    height: '40px'
                }}>
                    {isOutDate ?
                        <Tag color="red" style={{ width: '100%', fontSize: '1rem', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Đã hết hạn</Tag>
                        :
                        (
                            post.status === 1 ?
                                <Tag color="green" style={{ width: '100%', fontSize: '1rem', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Có thể ứng tuyển</Tag>
                                :
                                <Tag color="red" style={{ width: '100%', fontSize: '1rem', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Hiện chưa thể ứng tuyển</Tag>
                        )
                    }
                </Row>
                {isPostUpper ?
                    <Button
                        size='large'
                        style={{
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor,
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '0.5rem'
                        }}
                        disabled={!isOutDate}
                        onClick={() => setShowModalUpdateDate(true)}
                    >
                        <FiSettings style={{ marginRight: '0.5rem' }} />
                        Gia hạn
                    </Button>
                    :
                    <Button
                        size='large'
                        style={{
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor,
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '0.5rem'
                        }}
                        disabled={isOutDate || applies.length >= 3 || post.status !== 1}
                        onClick={() => setShowModalApply(true)}
                    >
                        <BiPaperPlane style={{ marginRight: '0.5rem' }} />
                        Ứng tuyển ngay
                    </Button>
                }
            </Col>


            {/* Modal gia hạn đơn */}
            <Modal
                title='Gia hạn bài đăng'
                open={showModalUpdateDate}
                onCancel={() => {
                    setShowModalUpdateDate(false)
                }}
                onOk={handleChangeDate}
                confirmLoading={loadingChangeDate}
            >
                <DatePickField
                    field='Chọn ngày gia hạn'
                    fieldSize='1.2rem'
                    onSelect={handleSelectDate}
                    isInvalidMessage={date.error && 'Ngày gia hạn phải lớn hơn ngày hiện tại'}
                />
            </Modal>

            {/* Modal apply job */}
            <ModalApplyJob
                post={post}
                isShow={showModalApply}
                setIsShow={setShowModalApply}
            />
        </Row>
    )
}

export default HeaderPost;