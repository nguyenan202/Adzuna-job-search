import { Col, Input, Typography } from "antd"

import styles from './styles.module.scss';

const MyFieldInput = ({ field, value, isInvalidMessage, ...props }) => {

    return (
        <Col span={props.span} style={{ margin: '0.5rem 0' }}>
            <Typography.Paragraph
                className={styles.title_field}
                style={{
                    color: isInvalidMessage && 'red'
                }}
            >
                {field}
            </Typography.Paragraph>
            <Input
                style={{
                    border: isInvalidMessage && `1px solid red`
                }}
                value={value}
                {...props}
            />
            {isInvalidMessage && <Typography.Text style={{ fontSize: '0.8rem', color: 'red' }}>
                {isInvalidMessage}
            </Typography.Text>}
        </Col>
    )
}

export default MyFieldInput