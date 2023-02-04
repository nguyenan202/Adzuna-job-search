import { Row, Col, Image, theme } from "antd"
import { AiOutlineDollarCircle } from 'react-icons/ai'


const Job = ({ item, index, data }) => {

    const nextItem = data.find(itemm => itemm.id === item.id + 1);
    const themeToken = theme.useToken().token;

    const Location = ({ name }) => (
        <Col
            style={{
                padding: '0.2rem 0.5rem',
                border: '1px solid #ccc',
                margin: '0.25rem'
            }}
        >
            {name}
        </Col>
    )

    const JobItem = ({ item }) => (
        <Col
            lg={{ span: 12 }}

            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.5rem 1rem'
            }}
        >
            <Row
                style={{
                    width: '100%',
                    border: '1px solid #ccc',
                    padding: '1rem',
                    backgroundColor: themeToken.componentBackground,
                    boxShadow: '0 0 6px 0 #c4c7cc',
                    cursor: 'pointer'
                }}
            >
                <Image
                    src={item.avatar}
                    width='5rem'
                    height='5rem'
                    preview={false}
                    style={{
                        border: '1px solid #ccc'
                    }}
                />
                <Row
                    style={{
                        marginLeft: '1.5rem',
                        maxWidth: 'calc(100% - 7rem)'
                    }}
                >
                    <Row
                        style={{
                            fontSize: '1.2rem',
                            fontWeight: 500,
                            width: '100%'
                        }}
                    >
                        {item.title}
                    </Row>
                    <Row
                        style={{
                            fontSize: '1rem',
                            alignItems: 'center',
                            color: 'green',
                            width: '100%',
                            margin: '0.5rem 0'
                        }}
                    >
                        <AiOutlineDollarCircle
                            style={{
                                marginRight: '0.5rem',
                            }}
                        />
                        5,000,000 VNĐ
                    </Row>
                    <Row
                        style={{
                            width: '100%'
                        }}
                    >
                        <Location name={'Hà Nội'}/>
                        <Location name={'TP Hồ Chí Minh'}/>
                        <Location name={'Đà Nẵng'}/>
                        <Location name={'Hải Phòng'}/>
                        <Location name={'Ninh Bình'}/>
                    </Row>
                </Row>
            </Row>
        </Col>
    )

    return (
        <Row>
            <JobItem item={item} />
            {nextItem && <JobItem item={nextItem} />}
        </Row>
    )
}

export default Job;