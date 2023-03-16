import { Button, Col, Image, Modal, Rate, Row, Typography, theme } from "antd";
import { BiWorld } from 'react-icons/bi';
import { FaHospitalUser } from 'react-icons/fa';
import { BsFillChatDotsFill } from 'react-icons/bs';

import styles from './styles.module.scss';
import useMediaQuery from "../../hooks/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import TextAreaField from "../../components/TextAreaField";
import axios from "axios";
import { addBoxChat } from "../../redux/store";

const HeaderCompanyProfile = ({ company, keyReRender, setKeyReRender }) => {

    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModalRate, setShowModalRate] = useState(false);
    const [star, setStar] = useState(0);
    const [comment, setComment] = useState({
        error: false,
        value: ''
    });

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const openNotification = useSelector(state => state.notification);
    const themeToken = theme.useToken().token;
    const dispatch = useDispatch();

    const breakpointTablet = useMediaQuery('(max-width: 762px)');
    const breakpointMobile = useMediaQuery('(max-width: 576px)');
    
    const handleRate = async () => {

        if (star === 0) return openNotification('error', 'Vui lòng đánh giá sao')
        if (comment.error) return;
        if (comment.value === '') return setComment({
            ...comment,
            error: true
        })

        try {
            setIsLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/rate`, {
                star,
                comment: comment.value,
                companyId: company.id,
                userId: user.id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.data.status && response.status === 200) {
                openNotification('success', 'Đánh giá công ty thành công');
                setIsLoading(false);
                setShowModalRate(false);
                setStar(0);
                setComment('');
                setKeyReRender(keyReRender + 1);
            }

            if (response.status === 201) {
                openNotification('warning', response.data.message);
                setIsLoading(false);
            }
        } catch (err) {
            console.log(err);
            openNotification('error', 'Có lỗi, vui lòng thử lại sau')
            setIsLoading(false);
        }
    }

    const handleAddChatBox = async () => {
        setIsLoadingChat(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/room-chat`, {
                userId1: user.id,
                userId2: company.userId
            },{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) dispatch(addBoxChat({ chat: response.data.id }))
        } catch(err) {
            openNotification('error', 'Có lỗi, vui lòng thử lại sau');
        }
        setIsLoadingChat(false);
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
                    src={`${process.env.REACT_APP_API_URL}/images/${company.picturePath}`}
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
                    <Typography.Title>
                        {company.name}
                    </Typography.Title>
                </Row>
                <Row>
                    <Col
                        span={breakpointMobile ? 24 : 12}
                    >
                        <Typography.Paragraph style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: '1rem', opacity: '0.8' }}>
                            <BiWorld style={{ marginRight: '0.5rem' }} />
                            <a href={company.url} target="_blank" rel="noreferrer">{company.url || 'đang cập nhật'}</a>
                        </Typography.Paragraph>
                    </Col>
                    <Col
                        span={breakpointMobile ? 24 : 12}
                    >
                        <Typography.Paragraph style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: '1rem', opacity: '0.8' }}>
                            <FaHospitalUser style={{ marginRight: '0.5rem' }} />
                            {company.size ? `${company.size} nhân viên` : 'đang cập nhật'}
                        </Typography.Paragraph>
                    </Col>
                </Row>
            </Col>

            <Col
                span={breakpointTablet ? 24 : 5}
                style={{
                    padding: '1rem 0'
                }}
            >
                {user.id !== company.userId &&
                    <>
                        <Button
                            size='large'
                            style={{
                                backgroundColor: themeToken.mainColor,
                                color: themeToken.textColor,
                                width: '100%'
                            }}
                            onClick={() => setShowModalRate(true)}
                        >
                            Viết đánh giá
                        </Button>
                        <Button
                            size='large'
                            style={{
                                backgroundColor: themeToken.mainColor,
                                color: themeToken.textColor,
                                width: '100%',
                                margin: '1rem 0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: isLoadingChat && 0.8
                            }}
                            onClick={handleAddChatBox}
                            disabled={isLoadingChat}
                        >
                            <BsFillChatDotsFill style={{ marginRight: '0.5rem' }}/>
                            Chat
                        </Button>
                    </>
                }
            </Col>

            {/* Modal người dùng đánh giá công ty */}
            <Modal
                title='Đánh giá công ty'
                open={showModalRate}
                onCancel={() => setShowModalRate(false)}
                onOk={handleRate}
                confirmLoading={isLoading}
            >
                <Row
                    style={{
                        width: '100%'
                    }}
                >
                    <Rate
                        allowHalf
                        onChange={s => setStar(s)}
                        value={star}
                        style={{
                            fontSize: '1.75rem'
                        }}
                    />
                </Row>
                <TextAreaField
                    field='Đánh giá của bạn'
                    fieldSize='1rem'
                    placeholder='e.g Công ty tốt,...'
                    rows={5}
                    value={comment.value}
                    isInvalidMessage={comment.error && 'Không được để trống'}
                    onChange={e => setComment({ error: false, value: e.target.value })}
                />
            </Modal>
        </Row>
    )
}

export default HeaderCompanyProfile