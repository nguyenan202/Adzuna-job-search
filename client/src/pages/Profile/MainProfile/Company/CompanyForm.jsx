import { Button, Col, Image, Rate, Row, Typography, theme } from "antd";

import styles from './styles.module.scss';
import useMediaQuery from "../../../../hooks/useMediaQuery";
import InfoCompany from "../../../../components/InfoCompany";
import { useState } from "react";
import ModalRemoveAvatar from "./ModalRemoveAvatar";
import ModalUploadAvatar from "./ModalUploadAvatar";

const CompanyForm = ({ company }) => {

    const [isOpenModalRemoveAvatar, setIsOpenModalRemoveAvatar] = useState(false);
    const [isOpenModalChangeAvatar, setIsOpenModalChangeAvatar] = useState(false);

    const themeToken = theme.useToken().token;

    const breakPointMobile = useMediaQuery('(max-width: 576px)');

    const avatarRow = (
        <Col
            className={styles.avatar_options}
            span={''}
            style={{
                margin: breakPointMobile && 0
            }}
        >
            <Button
                className={styles.avatar_btn}
                style={{
                    backgroundColor: themeToken.mainColor,
                    color: themeToken.textColor
                }}
                onClick={() => setIsOpenModalChangeAvatar(true)}
            >
                Thay đổi ảnh
            </Button>
            <Button
                className={styles.avatar_btn}
                danger
                onClick={() => setIsOpenModalRemoveAvatar(true)}
            >
                Xóa ảnh
            </Button>
        </Col>
    )
    
    const avgRates = company.Rates.reduce((current, next) => {
        return current + next.star
    }, 0) / company.Rates.length

    return (
        <>
            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
                <Row className={styles.full_width} style={breakPointMobile ? { justifyContent: 'center' } : {}}>
                    <Typography.Title style={{ fontSize: '2rem' }}>
                        Đánh giá
                    </Typography.Title>
                </Row>

                <Row
                    className={styles.full_width}
                    style={{ alignItems: 'center' }}
                >
                    <Rate
                        allowHalf
                        disabled
                        defaultValue={avgRates}
                    />
                    <Typography.Paragraph style={{ margin: '0 0 0 0.5rem' }}>
                        {`(${avgRates})`}
                    </Typography.Paragraph>
                </Row>

                <Row 
                    className={styles.full_width}
                    style={{ marginTop: '1rem' }}
                >
                    <a>
                        Hiên có {company.Rates.length} lượt đánh giá
                    </a>
                </Row>
            </Row>
            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground,
                    marginTop: '1.5rem'
                }}
            >
                <Row className={styles.full_width} style={breakPointMobile ? { justifyContent: 'center' } : {}}>
                    <Typography.Title style={{ fontSize: '2rem' }}>
                        Ảnh công ty
                    </Typography.Title>
                </Row>
                <Row className={styles.full_width}
                    style={{
                        flexDirection: breakPointMobile ? 'column' : 'unset'
                    }}
                >
                    <Col
                        span={''}
                        style={breakPointMobile && {
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Image
                            className={styles.avatar}
                            src={company.picturePath ? `${process.env.REACT_APP_API_URL}/images/${company.picturePath}` : '/assets/images/no-image-company.jpg'}
                            alt='avatar'
                            style={breakPointMobile && {
                                width: '10rem',
                                height: '10rem',
                                margin: '1rem 0'
                            }}
                            preview={company.picturePath ? true : false}
                        />
                    </Col>
                    {avatarRow}
                </Row>
                <Row className={`${styles.full_width} ${styles.note}`}>
                    <Typography.Text>
                        Lưu ý: Dung lượng ảnh k được vượt quá 800 KB
                    </Typography.Text>
                </Row>
            </Row>

            <InfoCompany
                company={company}
                breakPointMobile={breakPointMobile}
            />

            {/* Modal confirm remove avatar */}
            <ModalRemoveAvatar
                isOpenModalRemoveAvatar={isOpenModalRemoveAvatar}
                setIsOpenModalRemoveAvatar={setIsOpenModalRemoveAvatar}
                company={company}
            />

            {/* Modal change avatar */}
            <ModalUploadAvatar
                isOpenModalChangeAvatar={isOpenModalChangeAvatar}
                setIsOpenModalChangeAvatar={setIsOpenModalChangeAvatar}
                company={company}
            />
        </>
    )
}

export default CompanyForm;