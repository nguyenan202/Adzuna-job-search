import { List, Row } from "antd"
import styles from './stylesJobs.module.scss'
import Job from './Job'

const Jobs = ({ posts, isLoading }) => {

    return (
        <Row
            className={styles.container}
        >
            <List
                className={styles.job_group}
                itemLayout="vertical"
                size="large"
                pagination={{ pageSize: 6 }}
                loading={isLoading}
                dataSource={posts}
                renderItem={(item,index) => ((index % 2 === 0) && <Job item={item} index={index} data={posts}/>)}
            />
        </Row>
    )
}

export default Jobs