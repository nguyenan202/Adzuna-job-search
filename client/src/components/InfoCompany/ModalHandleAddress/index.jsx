import { Input, Modal, Typography, notification } from "antd";
import axios from "axios";
import { useState } from "react";
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
    
    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message
        });
    };
    

    const handleAddAddress = async () => {
        const data = {
            companyId: value.companyId,
            name: newAddress
        }

        try {
            const respone = axios.post(`${process.env.REACT_APP_API_URL}/company/address`,data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            console.log(respone.data);
        }catch(err) {

        }
    }

    const handleUpdateAddress = () => {
        console.log('update');
    }

    const handleRemoveAddress = () => {
        console.log('remove');
    }

    return (
        <>
            {contextHolder}
            <Modal
                title={<Typography.Title>{status === 1 ? 'Thêm địa chỉ' : status === 2 ? 'Sửa địa chỉ' : 'Xóa địa chỉ'}</Typography.Title>}
                open={isShow}
                onCancel={() => setIsShow(false)}
                onOk={status === 1 ? handleAddAddress : status === 2 ? handleUpdateAddress : handleRemoveAddress}
            >
                <Input
                    placeholder='Nhập địa chỉ mới'
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                />
            </Modal>
        </>
    )
}

export default ModalHandleAddress