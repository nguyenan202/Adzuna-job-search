import {
    Avatar,
    Input,
    Modal,
    Row,
    Typography,
    theme
} from "antd"
import { useState } from "react";
import styles from './stylesModal.module.scss'
import axios from "axios";
import { useSelector } from "react-redux";


const ModalUploadAvatar = ({ isOpenModalChangeAvatar, setIsOpenModalChangeAvatar, company }) => {

    const [imageUrl, setImageUrl] = useState(null);
    const [inputKey, setInputKey] = useState(0);
    const [isLoading, setIsloading] = useState(false);

    const themeToken = theme.useToken().token;
    const token = useSelector(state => state.token);
    
    const uploadButton = (
        <Row
            className={styles.container}
        >
            <Input
                className={styles.inputImage}
                key={inputKey}
                type="file"
                accept=".png, .jpeg, .jpg"
                onChange={(e) => setImageUrl(e.target.files[0])}
            />
            <Row
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    backgroundColor: themeToken.mainColor,
                    borderRadius: '6px'
                }}
            >
                <Row
                    style={{
                        color: themeToken.textColor,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {!imageUrl ? 'Chọn 1 ảnh' : 'Chọn ảnh khác'}
                </Row>
            </Row>
        </Row>
    );

    const handleOke = async () => {
        setIsloading(true);
        const data = new FormData();
        data.append('picture', imageUrl);
        data.append('id', company.id);

        await axios.patch(`${process.env.REACT_APP_API_URL}/company/image`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        setIsloading(false);
        setIsOpenModalChangeAvatar(false);
        setImageUrl(null);
        setInputKey(inputKey + 1);
    }

    const handleCloseModal = () => {
        setIsOpenModalChangeAvatar(false);
        setImageUrl(null);
        setInputKey(inputKey + 1);
    }

    return (
        <Modal
            open={isOpenModalChangeAvatar}
            onOk={handleOke}
            onCancel={handleCloseModal}
            confirmLoading={isLoading}
            width='700px'
            style={{
                maxWidth: '90vw'
            }}
            okButtonProps={{
                disabled: imageUrl && imageUrl.size > 800000
            }}
        >
            {uploadButton}
            {imageUrl && <Row
                className={styles.container_avatar}
            >
                <Avatar
                    className={styles.avatar}
                    src={URL.createObjectURL(imageUrl)}
                />
            </Row>}
            {imageUrl && imageUrl.size > 800000 && <Typography.Paragraph
                className={styles.text}
                style={{
                    color: 'red',
                    fontWeight: 500,
                    fontSize: '1rem'
                }}
            >
                Lưu ý: Dung lượng ảnh k được vượt quá 800 KB
            </Typography.Paragraph>}
        </Modal >
    )
}

export default ModalUploadAvatar