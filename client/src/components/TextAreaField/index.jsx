import { Col, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";



const TextAreaField = ({ field, fieldSize, isInvalidMessage, value, ...props }) => {


    return (
        <Col span={props.span} style={{ margin: '0.5rem 0' }}>
            <Typography.Paragraph
                style={{
                    marginBottom: '0.5rem',
                    fontSize: fieldSize,
                    fontWeight: 500,
                    color: isInvalidMessage && 'red'
                }}
            >
                {field}
            </Typography.Paragraph>
            <TextArea
                style={{
                    width: '100%',
                    border: isInvalidMessage && `1px solid red`
                }}
                value={value}
                {...props}
            >
            </TextArea>
            {isInvalidMessage && <Typography.Text style={{ fontSize: '0.8rem', color: 'red' }}>
                {isInvalidMessage}
            </Typography.Text>}
        </Col>
    )
}

export default TextAreaField;