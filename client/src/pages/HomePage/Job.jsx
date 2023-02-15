import { Row, Col, Image, theme, Typography } from "antd"
import { AiOutlineDollarCircle } from 'react-icons/ai'

import { cities } from "./index";
import styles from './stylesJobs.module.scss';
import { useNavigate } from "react-router-dom";


const Location = ({ name }) => (
    <Col
        style={{
            padding: '0.2rem 0.5rem',
            border: '1px solid #ccc',
            margin: '0.25rem',
            height: '30px'
        }}
    >
        {name}
    </Col>
)

const JobItem = ({ item, backgroundColor, cities }) => {

    const navigate = useNavigate();

    const listAddress = item.PostAddresses.map(address => address.Address.name);

    const citiesShow = cities.filter(city => listAddress.join(' ').includes(city.name));

    const timeLeft = Math.floor((new Date(item.endAt) - new Date())/ (1000 * 60 * 60 * 24))+1;

    return (
        <Col
            lg={{ span: 12 }}
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.5rem 1rem'
            }}
            onClick={() => navigate(`post/${item.id}`)}
        >
            <Row
                className={styles.item}
                style={{
                    backgroundColor: backgroundColor
                }}
            >
                <Row style={{ maxWidth: '5rem' }}>
                    <Col
                        span={24}
                    >
                        <Image
                            src={`${process.env.REACT_APP_API_URL}/images/${item.Conpany.picturePath}`}
                            width='5rem'
                            height='5rem'
                            preview={false}
                            style={{
                                border: '1px solid #ccc',
                                objectFit: 'contain'
                            }}
                        />
                    </Col>
                    <Col
                        span={24}
                    >
                        <Typography.Paragraph style={{ margin: 0, fontWeight: 500, opacity: 0.7, fontSize: '0.75rem' }}>
                            Còn {timeLeft} ngày
                        </Typography.Paragraph>
                    </Col>
                </Row>
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
                        {`${item.salary.toString()}000000`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' VNĐ'}
                    </Row>
                    <Row
                        style={{
                            width: '100%',
                            alignItems: 'flex-end'
                        }}
                    >
                        {
                            citiesShow.map(city => (<Location key={city.id} name={city.name} />))
                        }
                    </Row>
                </Row>
            </Row>
        </Col>
    )
}

const Job = ({ item, data }) => {

    const nextItem = data.find(itemm => itemm.id === item.id + 1);
    const themeToken = theme.useToken().token;

    return (
        <Row>
            <JobItem item={item} backgroundColor={themeToken.componentBackground} cities={cities} />
            {nextItem && <JobItem item={nextItem} backgroundColor={themeToken.componentBackground} cities={cities} />}
        </Row>
    )
}

export default Job;