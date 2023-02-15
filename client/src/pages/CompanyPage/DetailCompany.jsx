import { Button, Col, Divider, List, Rate, Row, Typography, theme } from "antd"

import styles from './styles.module.scss';
import TextArea from "antd/es/input/TextArea";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useState } from "react";

export const MyTitle = ({ text, color }) => {

    return (
        <Row
            style={{
                width: '100%'
            }}
        >
            <div
                style={{
                    width: '0.4rem',
                    height: '100%',
                    backgroundColor: color,
                    marginRight: '0.5rem'
                }}
            >
            </div>
            <Typography.Title style={{ margin: 0, fontSize: '1.75rem' }}>
                {text}
            </Typography.Title>
        </Row>
    )
}

const DetailCompany = ({ company }) => {

    const [count, setCount] = useState(3);
    const [rates, setRates] = useState(company.Rates.filter((_, index) => index < count));

    const themeToken = theme.useToken().token;

    const breakpointTablet = useMediaQuery('(max-width: 762px)');

    const avgStar = company.Rates.reduce((cur, next) => cur + next.star, 0) / company.Rates.length;

    const handleShowMore = () => {
        setRates([...rates, ...company.Rates.slice(count, count + 3)]);
        setCount(count + 3);
    }

    const listRate = rates.map(rate => (
        <Row key={rate.id}>
            <Rate
                allowHalf
                disabled
                defaultValue={rate.star}
                style={{
                    fontSize: '1rem',
                    marginBottom: '0.25rem'
                }}
            />
            <Row style={{ width: '100%' }}>
                <Typography.Paragraph style={{ margin: 0 }}>
                    {rate.comment}
                </Typography.Paragraph>
            </Row>
            <Divider style={{ margin: '1rem' }}></Divider>
        </Row>
    ))

    return (
        <Row
            className={styles.detail_company}
            justify='space-between'
        >
            <Col
                className={styles.detail_company_left}
                span={breakpointTablet ? 24 : 16}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
                <Row style={{ padding: '1rem' }}>
                    <MyTitle
                        color={themeToken.mainColor}
                        text='Giới thiệu công ty'
                    />
                </Row>
                <Row
                    className={styles.description_company}
                >
                    {
                        company.description.split('\n').map((line, i) => <Typography.Paragraph key={i}>{line}</Typography.Paragraph>)
                    }
                </Row>
            </Col>
            <Col
                className={styles.rate_company}
                span={breakpointTablet ? 24 : 7}
            >
                <Row
                    style={{
                        backgroundColor: themeToken.componentBackground,
                        marginTop: breakpointTablet && '1.5rem',
                        padding: '1rem'
                    }}
                >
                    <Row style={{ width: '100%' }}>
                        <Typography.Title style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>
                            Đánh giá
                        </Typography.Title>
                    </Row>
                    <Row style={{ alignItems: 'center' }}>
                        <Rate
                            allowHalf
                            disabled
                            defaultValue={avgStar}
                        />
                        <Typography.Paragraph style={{ margin: '0 0 0 0.5rem' }}>
                            {`(${avgStar || 0})`}
                        </Typography.Paragraph>
                    </Row>
                </Row>

                <Row
                    style={{
                        backgroundColor: themeToken.componentBackground,
                        marginTop: breakpointTablet && '1.5rem',
                        padding: '1rem',
                        marginTop: '1.5rem'
                    }}
                >
                    <Row style={{ width: '100%' }}>
                        <Typography.Title style={{ margin: '0.5rem 0 1rem 0', fontSize: '1.75rem' }}>
                            Đánh giá của người dùng
                        </Typography.Title>

                        {listRate}
                        {company.Rates.length > count && <Row
                            style={{
                                width: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            <Button
                                style={{
                                    backgroundColor: themeToken.mainColor,
                                    color: themeToken.textColor
                                }}
                                onClick={handleShowMore}
                            >
                                Hiển thị thêm
                            </Button>
                        </Row>}
                    </Row>
                </Row>
            </Col>
        </Row>
    )
}

export default DetailCompany;