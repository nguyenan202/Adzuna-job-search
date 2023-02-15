
import { Button, Col, Row, Select, Typography, theme } from "antd"

import styles from './styles.module.scss';


const FieldPostSetting = ({ title, placeholder, data, onSelect, onClickBtn }) => {

    const themeToken = theme.useToken().token;

    const listOption = data.map(d => (
        <Select.Option key={d.id} value={d.id} label={d.name}>
            {d.name}
        </Select.Option>
    ))

    return (
        <Row
            className={styles.full_width}
        >
            <Typography.Title
                style={{
                    fontSize: '1.5rem'
                }}
            >
                {title}
            </Typography.Title>

            <Row
                className={styles.full_width}
                justify='space-between'
                style={{ margin: '0.5rem 0 1rem 0' }}
            >
                <Col span={18}>
                    <Select
                        className={styles.full_width}
                        size="large"
                        placeholder={placeholder}
                        onSelect={onSelect}
                    >
                        {listOption}
                    </Select>
                </Col>
                <Col span={5}>
                    <Button
                        className={styles.full_width}
                        size="large"
                        style={{
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor
                        }}
                        onClick={onClickBtn}
                    >
                        Thêm
                    </Button>
                </Col>
            </Row>
        </Row>
    )
}

export default FieldPostSetting;