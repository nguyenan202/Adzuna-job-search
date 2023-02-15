import { Input, Modal, Typography, notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

/**
 *  status === 1 -> Add
 *  status === 2 -> Update
 *  status === 3 -> Delete
 */
const ModalHandleAddress = ({ isShow, setIsShow, status, value, company }) => {

    const [newAddress, setNewAddress] = useState(value ? value.name : '')
    const [isLoading, setIsLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const token = useSelector(state => state.token);

    // Refresh Component
    useEffect(() => {
        value && setNewAddress(value.name);
    }, [value])

    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            duration: 2
        });
    };


    const handleAddAddress = async () => {
        const data = {
            companyId: company.id,
            name: newAddress
        }

        try {
            setIsLoading(true);
            const respone = await axios.post(`${process.env.REACT_APP_API_URL}/company/address`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (respone.data.status) {
                openNotificationWithIcon('success', 'Thêm địa chỉ thành công.')
            }

            setIsLoading(false);
        } catch (err) {
            openNotificationWithIcon('error', 'Có lỗi, vui lòng thử lại sau.')
            setIsLoading(false);
        }

        setIsShow(false);
        setNewAddress('');
    }

    const handleUpdateAddress = async () => {

        const data = {
            companyId: company.id,
            name: newAddress,
            id: value.id
        }

        try {
            setIsLoading(true);
            const respone = await axios.patch(`${process.env.REACT_APP_API_URL}/company/address`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (respone.data.status) {
                openNotificationWithIcon('success', 'Cập nhật địa chỉ thành công.')
            }

            setIsLoading(false);
        } catch (err) {
            openNotificationWithIcon('error', 'Có lỗi, vui lòng thử lại sau.')
            setIsLoading(false);
        }

        setIsShow(false);
        setNewAddress('');
    }

    const handleRemoveAddress = async () => {
        const data = {
            companyId: company.id,
            id: value.id
        }

        try {
            setIsLoading(true);
            const respone = await axios.delete(`${process.env.REACT_APP_API_URL}/company/address`,{
                data: data,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (respone.data.status) {
                openNotificationWithIcon('success', 'Xóa địa chỉ thành công.')
            }

            setIsLoading(false);
        } catch (err) {
            openNotificationWithIcon('error', 'Có lỗi, vui lòng thử lại sau.')
            setIsLoading(false);
        }

        setIsShow(false);
        setNewAddress('');
    }

    return (
        <>
            {contextHolder}
            <Modal
                title={<Typography.Title>{status === 1 ? 'Thêm địa chỉ' : status === 2 ? 'Sửa địa chỉ' : 'Xóa địa chỉ'}</Typography.Title>}
                open={isShow}
                onCancel={() => setIsShow(false)}
                onOk={status === 1 ? handleAddAddress : status === 2 ? handleUpdateAddress : handleRemoveAddress}
                confirmLoading={isLoading}
            >
                <Input
                    placeholder='Nhập địa chỉ mới'
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    disabled={status === 3}
                />
            </Modal>
        </>
    )
}

export default ModalHandleAddress