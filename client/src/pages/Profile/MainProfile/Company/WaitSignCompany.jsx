import { Image, Row, Typography, theme } from "antd"

import styles from './stylesWaitSign.module.scss';

const WaitSignCompany = () => {

    const themeToken = theme.useToken().token;

    return(
        <Row
            className={styles.container}
            style={{
                backgroundColor: themeToken.componentBackground
            }}
            justify='center'
        >
            <Typography.Paragraph
                style={{
                    fontSize: '1.75rem',
                    fontWeight: 500
                }}
            >
                Đơn của bạn đang được duyệt vui lòng chờ
            </Typography.Paragraph>
            <Image
                width='80%'
                src='/assets/images/waiting-image.png'
                alt='waitingImage'
                preview={false}
            />
        </Row>
    )
}

export default WaitSignCompany