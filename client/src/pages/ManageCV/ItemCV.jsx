import { Col, Modal, Row, Typography } from "antd"

import styles from './styles.module.scss';
import { shortText } from "../ManagePostPage";
import { FaPencilAlt } from "react-icons/fa";
import useMediaQuery from "../../hooks/useMediaQuery";
import { AiTwotoneDelete } from "react-icons/ai";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const convertDateTime = (dateTime) => {
    const date = new Date(dateTime);

    return `${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()} ${("0" + (date.getHours() % 12 || 12)).slice(-2)}:${("0" + date.getMinutes()).slice(-2)} ${date.getHours() >= 12 ? "PM" : "AM"}`;
}

const ItemCV = ({ resume, keyReRender, setKeyReRender }) => {

    const [isLoading, setIsLoading]= useState(false);
    const [showModal, setShowModal] = useState(false);

    const token = useSelector(state => state.token);
    const openNotification = useSelector(state => state.notification);
    const navigate = useNavigate();

    const breakpointTablet = useMediaQuery('(max-width: 992px)');
    const breakpointMobile = useMediaQuery('(max-width: 562px)');


    const handleDelete = async () => {
        try {
            setIsLoading(true);
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/cv`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    id: resume.id
                }
            })

            if (response.status === 200 && response.data.status) {
                setIsLoading(false);
                setShowModal(false);
                setKeyReRender(keyReRender+1);
                openNotification('success', 'Xóa CV thành công')
            }
        }catch(err) {
            console.log(err);
            setIsLoading(false);
            openNotification('error', 'Có lỗi, vui lòng thử lại sau')
        }
    }


    return (
        <Col
            className={styles.item_resume}
            span={breakpointMobile ? 24 : breakpointTablet ? 12 : 8}
        >
            <img
                src={resume.picturePath ? `${process.env.REACT_APP_API_URL}/images/${resume.picturePath}` : `${process.env.REACT_APP_CURRENT_URL}/assets/images/no_avatar.png`}
                alt='cv'
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
            <Row
                className={styles.item_resume_setting}
            >
                <Typography.Title
                    className={styles.item_resume_setting_title}
                >
                    {shortText(resume.name, 10)}
                </Typography.Title>
                <Typography.Paragraph
                    className={styles.item_resume_setting_time}
                >
                    {`Cập nhật lần cuối ${convertDateTime(resume.updatedAt)}`}
                </Typography.Paragraph>

                <div
                    className={styles.item_resume_setting_icon_use}
                    onClick={() => navigate(`/cv/${resume.id}`)}
                >
                    <FaPencilAlt
                        className={styles.item_resume_setting_icon_use_child}
                    />
                </div>

                <div
                    className={styles.item_resume_setting_icon_delete}
                    onClick={() => setShowModal(true)}
                >
                    <AiTwotoneDelete
                        className={styles.item_resume_setting_icon_delete_child}
                    />
                </div>
            </Row>

            {/* Modal Confirm Delete CV */}
            <Modal
                title='Xác nhận xóa cv'
                open={showModal}
                onCancel={() => setShowModal(false)}
                onOk={handleDelete}
                confirmLoading={isLoading}
            >

            </Modal>
        </Col>
    )
}

export default ItemCV