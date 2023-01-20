import { Row, Card, Col } from "antd"
import styles from './stylesTopCompanies.module.scss'
import styled from 'styled-components'

const { Meta } = Card

const MyMeta = styled(Meta)`
    &&& {
        .ant-card-meta-title {
            font-size: 1.5rem;
        }

        .ant-card-meta-description {
            font-size: 1.2rem;
            text-align: center;
        }
    }
`

const TopCompanies = () => {


    return(
        <Row className={styles.container}>
            <Row
                className={styles.title}
            >
                Top Employers
            </Row>

            <Row
                className={styles.item_group}
            >
                <Col
                    className={styles.item}
                    lg={{ span: 5 }}
                    md={{ span: 11 }}
                    sm={{ span: 24 }}
                >
                    <Card
                        hoverable
                        cover={<div style={{ padding: '2rem' }}><img src='assets/images/logo.png' alt='logo' style={{ width: '100%' }}/></div>}
                    >
                        <MyMeta
                            title='Cong ty A'
                            description='con 4 job'
                        />
                    </Card>
                </Col>
                <Col
                    className={styles.item}
                    lg={{ span: 5 }}
                    md={{ span: 11 }}
                    sm={{ span: 24 }}
                >
                    <Card
                        hoverable
                        cover={<div style={{ padding: '2rem' }}><img src='assets/images/logo.png' alt='logo' style={{ width: '100%' }}/></div>}
                    >
                        <MyMeta
                            title='Cong ty A'
                            description='con 4 job'
                        />
                    </Card>
                </Col>
                <Col
                    className={styles.item}
                    lg={{ span: 5 }}
                    md={{ span: 11 }}
                    sm={{ span: 24 }}
                >
                    <Card
                        hoverable
                        cover={<div style={{ padding: '2rem' }}><img src='assets/images/logo.png' alt='logo' style={{ width: '100%' }}/></div>}
                    >
                        <MyMeta
                            title='Cong ty A'
                            description='con 4 job'
                        />
                    </Card>
                </Col>
                <Col
                    className={styles.item}
                    lg={{ span: 5 }}
                    md={{ span: 11 }}
                    sm={{ span: 24 }}
                >
                    <Card
                        hoverable
                        cover={<div style={{ padding: '2rem' }}><img src='assets/images/logo.png' alt='logo' style={{ width: '100%' }}/></div>}
                    >
                        <MyMeta
                            title='Cong ty A'
                            description='con 4 job'
                        />
                    </Card>
                </Col>
            </Row>
        </Row>
    )
}

export default TopCompanies