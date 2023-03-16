import { Col, Input, Typography } from "antd"

import styles from './styles.module.scss';

const MyFieldInput = ({ field, fieldSize, value, isInvalidMessage, ...props }) => {

    return (
        <Col span={props.span} style={{ margin: '0.5rem 0' }}>
            <Typography.Paragraph
                className={styles.title_field}
                style={{
                    color: isInvalidMessage && 'red',
                    fontSize: fieldSize
                }}
            >
                {field}
            </Typography.Paragraph>
            <Input
                value={value}
                {...props}
                spellCheck={false}
                style={{
                    border: isInvalidMessage && `1px solid red`,
                    borderRadius: '8px'
                }}
            />
            {isInvalidMessage && <Typography.Text style={{ fontSize: '0.8rem', color: 'red' }}>
                {isInvalidMessage}
            </Typography.Text>}
        </Col>
    )
}

export default MyFieldInput