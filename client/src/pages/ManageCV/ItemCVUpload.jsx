import { Col, Modal, Row, Typography } from "antd";
import useMediaQuery from "../../hooks/useMediaQuery";

import styles from './styles.module.scss';
import { FaPencilAlt } from "react-icons/fa";
import { AiFillEye, AiFillWarning, AiTwotoneDelete } from "react-icons/ai";
import { shortText } from "../ManagePostPage";
import { convertDateTime } from "./ItemCV";
import { useState } from "react";
import MyFieldInput from "../../components/MyFieldInput";
import { useSelector } from "react-redux";
import axios from "axios";

const ItemCVUpload = ({ resume, keyReRender, setKeyReRender }) => {

    const [loadingChange, setLoadingChange] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [name, setName] = useState({
        error: false,
        value: ''
    })

    const openNotification = useSelector(state => state.notification);
    const token = useSelector(state => state.token);

    const breakpointTablet = useMediaQuery('(max-width: 992px)');
    const breakpointMobile = useMediaQuery('(max-width: 562px)');

    const handleChangeName = async () => {
        if (name.value === '') return setName({
            ...name,
            error: true
        })

        setLoadingChange(true);
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/cv-upload`, {
                id: resume.id,
                name: name.value
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                openNotification('success', 'Cập nhật CV thành công');
                setShowModal(false);
                setKeyReRender(keyReRender + 1);
            }
        } catch (err) {
            openNotification('error', 'Có lỗi, vui lòng thử lại sau')
        }
        setLoadingChange(false);
    }

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/cv-upload`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    id: resume.id
                }
            })

            if (response.status === 200) {
                openNotification('success', 'Xóa CV thành công');
                setShowModalDelete(false);
                setKeyReRender(keyReRender + 1);
            }
        } catch (err) {
            openNotification('error', 'Có lỗi, vui lòng thử lại sau')
        }
        setLoadingDelete(false);
    }

    return (
        <Col
            className={styles.item_resume}
            span={breakpointMobile ? 24 : breakpointTablet ? 12 : 8}
        >
            <img
                src={`${process.env.REACT_APP_API_URL}/images/schema-cv.png`}
                alt='cv'
                style={{
                    width: '100%',
                    objectFit: 'cover'
                }}
            />
            <Row
                className={styles.item_resume_setting}
            >
                <Typography.Title
                    className={styles.item_resume_setting_title}
                >
                    {shortText(resume.name, 12)}
                </Typography.Title>
                <Typography.Paragraph
                    className={styles.item_resume_setting_time}
                >
                    {`Cập nhật lần cuối ${convertDateTime(resume.updatedAt)}`}
                </Typography.Paragraph>

                <div
                    className={styles.item_resume_setting_icon_use}
                    onClick={() => setShowModal(true)}
                >
                    <FaPencilAlt
                        className={styles.item_resume_setting_icon_use_child}
                    />
                </div>

                <div
                    className={styles.item_resume_setting_icon_view}
                    onClick={() => window.open(`${process.env.REACT_APP_API_URL}/images/${resume.picturePath}`, '_blank', 'noopener,noreferrer')}
                >
                    <AiFillEye
                        className={styles.item_resume_setting_icon_view_child}
                    />
                </div>

                <div
                    className={styles.item_resume_setting_icon_delete}
                    style={{
                        top: 'unset',
                        left: 'unset',
                        bottom: '0.5rem',
                        right: '0.5rem'
                    }}
                    onClick={() => setShowModalDelete(true)}
                >
                    <AiTwotoneDelete
                        className={styles.item_resume_setting_icon_delete_child}
                    />
                </div>
            </Row>

            {/* Modal change name */}
            <Modal
                title='Đổi tên CV'
                open={showModal}
                onCancel={() => setShowModal(false)}
                onOk={handleChangeName}
                confirmLoading={loadingChange}
            >
                <MyFieldInput
                    field='Nhập tên mới'
                    fieldSize='1rem'
                    onChange={e => setName({
                        error: e.target.value === '',
                        value: e.target.value
                    })}
                    isInvalidMessage={name.error && 'Không được bỏ trống trường này'}
                />
            </Modal>

            {/* Modal Confirm delete */}
            <Modal
                title={<Typography.Title style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}>
                    <AiFillWarning style={{ color: 'red', marginRight: '0.5rem' }} />
                    Xác nhận xóa CV
                </Typography.Title>}
                open={showModalDelete}
                onCancel={() => setShowModalDelete(false)}
                onOk={handleDelete}
                confirmLoading={loadingDelete}
            >

            </Modal>
        </Col>
    )
}

export default ItemCVUpload;