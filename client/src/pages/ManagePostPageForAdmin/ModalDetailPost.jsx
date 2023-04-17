import { Button, Col, Modal, Row, Typography, theme } from "antd"
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";

import MyFieldInput from "../../components/MyFieldInput";
import { genders } from "../UpPostPage/UpPost";
import TextAreaField from "../../components/TextAreaField";
import SpinLoadingButton from '../../components/SpinLoadingButton';
import TextArea from "antd/es/input/TextArea";


const ModalDetailPost = ({ post, isShow, setIsShow, openNotificationWithIcon, keyReRender, setKeyReRender, ...props }) => {

    const [isLoadingAccepted, setIsLoadingAccepted] = useState(false);
    const [isLoadingRejected, setIsLoadingRejected] = useState(false);
    const [showModalReject, setShowModalReject] = useState(false);
    const [reason, setReason] = useState('');

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);

    const addresses = post.PostAddresses.reduce((cur, next) => {
        return `${cur}• ${next.Address.name}\n`
    }, '')

    const handleAccept = async () => {

        setIsLoadingAccepted(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/post/status`, {
                companyId: post.companyId,
                postId: post.id,
                status: 1
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.data.status) {
                openNotificationWithIcon('success', 'Duyệt đơn thành công');
                setIsShow(false);
                setKeyReRender(keyReRender + 1);
            }

        } catch (err) {
            openNotificationWithIcon('error', 'Có lỗi, vui lòng thử lại sau');
        }
        setIsLoadingAccepted(false);
    }

    const handleReject = async () => {

        setIsLoadingRejected(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/post/status`, {
                companyId: post.companyId,
                postId: post.id,
                status: 2,
                reason: reason
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.data.status) {
                openNotificationWithIcon('success', 'Từ chối đơn thành công');
                setShowModalReject(false);
                setIsShow(false);
                setReason('');
                setTimeout(() => {
                    setKeyReRender(keyReRender + 1);
                }, 1500)
            }

        } catch (err) {
            openNotificationWithIcon('error', 'Có lỗi, vui lòng thử lại sau');
        }
        setIsLoadingRejected(false);
    }

    return (
        <Modal
            open={isShow}
            onCancel={() => setIsShow(false)}
            onOk={() => setIsShow(false)}
            footer={null}
            {...props}
        >
            <Row>
                <Typography.Title>
                    {post.title}
                </Typography.Title>
            </Row>

            <Row>
                <MyFieldInput
                    field='Ngày tạo'
                    value={post.startAt}
                    readOnly
                    span={24}
                />
                <MyFieldInput
                    field='Ngày kết thúc'
                    value={post.endAt}
                    readOnly
                    span={24}
                />
                <MyFieldInput
                    field='Mức lương'
                    value={`${post.salary} VNĐ`}
                    readOnly
                    span={24}
                />
                <MyFieldInput
                    field='Số lượng cần tuyển'
                    value={post.quantity}
                    readOnly
                    span={24}
                />
                <MyFieldInput
                    field='Giới tính'
                    value={genders.find(gender => gender.id === post.gender).name}
                    readOnly
                    span={24}
                />
                <MyFieldInput
                    field='Lĩnh vực'
                    value={post.Specialization.name}
                    readOnly
                    span={24}
                />
                <MyFieldInput
                    field='Hình thức làm việc'
                    value={post.WorkingTime.name}
                    readOnly
                    span={24}
                />
                <MyFieldInput
                    field='Cấp độ'
                    value={post.Level.name}
                    readOnly
                    span={24}
                />
                <MyFieldInput
                    field='Kinh nghiệm'
                    value={post.ExperiencePost.name}
                    readOnly
                    span={24}
                />
                <TextAreaField
                    field='Địa điểm làm việc'
                    value={addresses}
                    readOnly
                    rows={post.PostAddresses.length + 1}
                    span={24}
                />
                <TextAreaField
                    field='Mô tả công việc'
                    value={post.description}
                    readOnly
                    rows={5}
                    span={24}
                />
                <TextAreaField
                    field='Yêu cầu ứng viên'
                    value={post.requirments}
                    readOnly
                    rows={5}
                    span={24}
                />
                <TextAreaField
                    field='Quyền lợi'
                    value={post.benefits}
                    readOnly
                    rows={5}
                    span={24}
                />
            </Row>

            <Row justify='space-between'>
                <Col
                    span={11}
                >
                    <Button
                        size="large"
                        style={{
                            margin: '1rem 0',
                            width: '100%',
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor,
                            opacity: (isLoadingAccepted || isLoadingRejected) && '0.8'
                        }}
                        onClick={handleAccept}
                        disabled={isLoadingAccepted || isLoadingRejected}
                    >
                        {isLoadingAccepted && <SpinLoadingButton />}Chấp nhận
                    </Button>
                </Col>
                <Col
                    span={11}
                >
                    <Button
                        size="large"
                        style={{
                            margin: '1rem 0',
                            width: '100%',
                            backgroundColor: 'red',
                            color: '#fff',
                            opacity: (isLoadingAccepted || isLoadingRejected) && '0.8'
                        }}
                        onClick={() => setShowModalReject(true)}
                        disabled={isLoadingAccepted || isLoadingRejected}
                    >
                        Từ chối
                    </Button>
                </Col>
            </Row>

            {/* Modal Reason Reject */}
            <Modal
                title='Nhập lý do từ chối đăng bài'
                open={showModalReject}
                onCancel={() => setShowModalReject(false)}
                onOk={handleReject}
                confirmLoading={isLoadingRejected}
            >
                <TextArea
                    placeholder='e.g Mô tả yêu cầu công việc chưa thực tế,...'
                    rows={5}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                ></TextArea>
            </Modal>
        </Modal>
    )
}

export default ModalDetailPost;