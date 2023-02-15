import { Col, DatePicker, Typography } from "antd"
import dayjs from 'dayjs';

const DatePickField = ({ field, fieldSize, isInvalidMessage, value, ...props }) => {

    return (
        <Col span={props.span} style={{ margin: '0.5rem 0' }}>
            <Typography.Paragraph
                style={{
                    marginBottom: '0.5rem',
                    fontSize: fieldSize,
                    fontWeight: 500,
                    color: isInvalidMessage && 'red',
                }}
            >
                {field}
            </Typography.Paragraph>
            <DatePicker
                style={{ width: '100%', border: isInvalidMessage && `1px solid red` }}
                defaultValue={value && dayjs(`${value}`, 'DD/MM/YYYY')}
                format={'YYYY-MM-DD'}
                {...props}
            />
            {isInvalidMessage && <Typography.Text style={{ fontSize: '0.8rem', color: 'red' }}>
                {isInvalidMessage}
            </Typography.Text>}
        </Col>
    )
}

export default DatePickField;