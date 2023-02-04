import { Avatar, Button, Col, Image, Popover, Row, Typography, theme } from "antd";

import styles from './styles.module.scss';
import useMediaQuery from "../../../../hooks/useMediaQuery";

const CompanyForm = ({ company }) => {


    const themeToken = theme.useToken().token;

    const breakPointMobile = useMediaQuery('(max-width: 576px)');


    const handleChangeAvatar = () => {
        console.log('change');
    }

    const handleRemoveAvatar = () => {
        console.log('remove');
    }

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
                onClick={handleChangeAvatar}
            >
                Thay đổi ảnh
            </Button>
            <Button
                className={styles.avatar_btn}
                danger
                onClick={handleRemoveAvatar}
            >
                Xóa ảnh
            </Button>
        </Col>
    )

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

            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground,
                    marginTop: '1.5rem'
                }}
            >
                <Row className={styles.full_width} style={breakPointMobile ? { justifyContent: 'center' } : {}}>
                    <Typography.Title style={{ fontSize: '2rem' }}>
                        Thông tin công ty
                    </Typography.Title>
                </Row>
            </Row>
        </>
    )
}

export default CompanyForm;