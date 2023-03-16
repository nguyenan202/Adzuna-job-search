import { Row } from "antd"

import styles from './styles.module.scss';
import { BsArrowLeft } from "react-icons/bs";

const InfoCompany = ({ company, setSelected }) => {


    return(
        <Row
            className={styles.container_info}
        >
            <BsArrowLeft
                className={styles.back_icon}
                onClick={() => setSelected(null)}
            />
        </Row>
    )
}

export default InfoCompany