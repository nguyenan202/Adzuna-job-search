import { Col, Row, theme } from "antd"
import styles from './styles.module.scss'
import { useSelector } from "react-redux";

const NavProfile = ({ currentOptionIndex, setCurrentOptionIndex, layout, options }) => {

    const themeToken = theme.useToken().token;
    const user = useSelector(state => state.user);

    const listOption = options.map((option, index) => (
        <Row
            key={option.id}
            className={styles.setting}
            style={currentOptionIndex === index ? {
                backgroundColor: '#ccc'
            } : {}}
            onClick={() => setCurrentOptionIndex(index)}
        >
            {option.name}
        </Row>
    ))

    return (
        <Col
            className={styles.container}
            span={layout}
        >
            <Row
                className={styles.sub_container}
                style={{
                    backgroundColor: themeToken.componentBackground
                }}
            >
               {listOption}
            </Row>
        </Col>
    )
}

export default NavProfile