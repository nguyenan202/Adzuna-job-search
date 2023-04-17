import { Button, Image, Row } from "antd"
import { BsArrowLeft } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';

import styles from './styles.module.scss';
import MyFieldInput from '../../../components/MyFieldInput';
import SelectField from '../../../components/SelectField';
import SpinLoading from '../../../components/SpinLoading';
import TextAreaField from '../../../components/TextAreaField';

const getObject = (value, error = false, message = '') => ({ value, error, message });

const InfoCompany = ({ company, setSelected, setKeyReRender, keyReRender }) => {

    const [showSave, setShowSave] = useState(false);
    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [piorities, setPiorities] = useState([]);
    const [data, setData] = useState({
        name: getObject(company.name),
        url: getObject(company.url),
        size: getObject(company.size),
        description: getObject(company.description),
        priorityId: getObject(company.priorityId),
    })

    const token = useSelector(state => state.token);
    const openNotification = useSelector(state => state.notification);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_API_URL}/piority`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(value => setPiorities(value.data))
            .finally(() => {
                setIsLoading(false);
            })
    }, [])
    
    
    const handleSave = async () => {
        const objArr = Object.entries(data);
        let hasError = false;
        const check_1 = objArr.some(([_,value]) => value.error || value.message);

        objArr.forEach(([key,value]) => {
            if (value.value === '') {
                value.error = true;
                value.message = 'Không được bỏ trống trường này'
                if (!hasError) hasError = true;
            }

            if (key === 'url' && !/^(ftp|http|https):\/\/[^ "]+$/.test(value.value)) {
                value.error = true;
                value.message = 'URL không hợp lệ'
                if (!hasError) hasError = true;
            }

            if (key === 'size' && parseInt(value.value) <= 0) {
                value.error = true;
                value.message = 'Trường này phải > 0'
                if (!hasError) hasError = true;
            }
        })

        if (hasError || check_1) return setData(
            Object.assign(...objArr.map(([key,value]) => ({ [key]: value })))
        )
        
        // without error
        try {
            const dataUpdate = {
                id: company.id,
                ...Object.assign(...objArr.map(([key,value]) => ({[key]: key === 'size' ? parseInt(value.value) : value.value})))
            }

            setIsLoadingSave(true);
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/company/infomation`, dataUpdate, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                setIsLoadingSave(false);
                openNotification('success', response.data.message);
                setKeyReRender(keyReRender+1);
            }
        } catch(err) {
            console.log(err);
            setIsLoadingSave(false);
            openNotification('error', 'Có lỗi, vui lòng thử lại sau');
        }
    }

    return (isLoading ? <SpinLoading height='calc(100vh - 67px - 12rem)' /> :
        <Row
            className={styles.container_info}
        >
            <BsArrowLeft
                className={styles.back_icon}
                onClick={() => setSelected(null)}
            />
            <Row
                className={styles.header}
            >
                <Image
                    className={styles.avatar}
                    src={`${process.env.REACT_APP_API_URL}/images/${company.picturePath}`}
                    alt={company.name}
                />
            </Row>
            <Row
                className={styles.body}
            >
                <MyFieldInput
                    field='ID'
                    fieldSize='1.2rem'
                    value={company.id}
                    span={11}
                    disabled
                />
                <SelectField
                    field='Loại'
                    fieldSize='1.2rem'
                    data={piorities}
                    span={11}
                    defaultValue={data.priorityId.value}
                    onSelect={id => {
                        setData({
                            ...data,
                            priorityId: getObject(id, false, '')
                        })
                        !showSave && setShowSave(true);
                    }}
                    isInvalidMessage={data.priorityId.error && data.priorityId.message}
                />
                <MyFieldInput
                    field='Ngày tạo'
                    fieldSize='1.2rem'
                    value={company.createdAt.slice(0, 10)}
                    span={11}
                    disabled
                />
                <MyFieldInput
                    field='Lần cập nhật cuối'
                    fieldSize='1.2rem'
                    value={company.updatedAt.slice(0, 10)}
                    span={11}
                    disabled
                />
                <MyFieldInput
                    field='Tên công ty'
                    fieldSize='1.2rem'
                    value={data.name.value}
                    span={24}
                    isInvalidMessage={data.name.error && data.name.message}
                    onChange={e => {
                        setData({
                            ...data,
                            name: getObject(e.target.value, false, '')
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <MyFieldInput
                    field='Số lượng nhân viên'
                    fieldSize='1.2rem'
                    value={data.size.value}
                    span={11}
                    type='number'
                    min='1'
                    isInvalidMessage={data.size.error && data.size.message}
                    onChange={e => {
                        setData({
                            ...data,
                            size: getObject(e.target.value, false, '')
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <MyFieldInput
                    field='URL'
                    fieldSize='1.2rem'
                    value={data.url.value}
                    span={11}
                    isInvalidMessage={data.url.error && data.url.message}
                    onChange={e => {
                        setData({
                            ...data,
                            url: getObject(e.target.value, false, '')
                        })
                        !showSave && setShowSave(true);
                    }}
                />
                <TextAreaField
                    field='Mô tả công ty'
                    fieldSize='1.2rem'
                    value={data.description.value}
                    span={24}
                    isInvalidMessage={data.description.error && data.description.message}
                    onChange={e => {
                        setData({
                            ...data,
                            description: getObject(e.target.value, false, '')
                        })
                        !showSave && setShowSave(true);
                    }}
                    rows={15}
                    spellCheck={false}
                />

                {showSave &&
                    <Row
                        style={{
                            width: '100%',
                            margin: '1rem 0',
                            justifyContent: 'center'
                        }}
                    >
                        <Button
                            size="large"
                            type="primary"
                            style={{
                                width: 200,
                                cursor: isLoadingSave ? 'wait' : 'pointer',
                            }}
                            disabled={isLoadingSave}
                            onClick={handleSave}
                        >
                            Lưu lại
                        </Button>
                    </Row>
                }
            </Row>
        </Row>
    )
}

export default InfoCompany