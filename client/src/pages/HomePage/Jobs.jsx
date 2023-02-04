import { Col, List, Row } from "antd"
import styles from './stylesJobs.module.scss'
import Job from './Job'

const data = Array.from({
    length: 21,
}).map((_, i) => ({
    id: i,
    title: `Java Devs- Middle/Senior (Spring Boot, Jquery, SQL) ${i}th`,
    avatar: 'https://rubicmarketing.com/wp-content/uploads/2022/07/y-nghia-logo-fpt-lan-2.jpg',
    salary: '15000000',
    company: 'Công ty TNHH Yakult',
    location: ['Hà Nội', 'TP Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng']
}));

const Jobs = () => {

    return (
        <Row
            className={styles.container}
        >
            <List
                className={styles.job_group}
                itemLayout="vertical"
                size="large"
                pagination={{ pageSize: 4 }}
                loading={false}
                dataSource={data}
                renderItem={(item,index) => ((index % 2 === 0) && <Job item={item} index={index} data={data}/>)}
            />
        </Row>
    )
}

export default Jobs