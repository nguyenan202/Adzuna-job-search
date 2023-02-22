import { Col, Row, theme } from "antd"

import styles from './styles.module.scss';
import { AiOutlinePlusCircle } from "react-icons/ai";
import useMediaQuery from "../../hooks/useMediaQuery";

const ItemCreateNewCV = ({ setShowModal }) => {

    const themeToken = theme.useToken().token;

    const breakpointTablet = useMediaQuery('(max-width: 992px)');
    const breakpointMobile= useMediaQuery('(max-width: 562px)');

    return(
        <Col
            span={breakpointMobile ? 24 : breakpointTablet ? 12 : 8}
            className={styles.item_create_new}
            >
            <Row
                className={styles.item_create_new_container}
                style={{
                    border: `1px dashed ${themeToken.mainColor}`
                }}
                onClick={() => setShowModal(true)}
            >
                <AiOutlinePlusCircle
                className={styles.item_create_new_container_icon}
                    style={{
                        color: themeToken.mainColor
                    }}
                />
            </Row>
        </Col>
    )
}

export default ItemCreateNewCV