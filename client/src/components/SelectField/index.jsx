import { Col, Select, Typography } from "antd";



const SelectField = ({ field, fieldSize, isInvalidMessage, data = [], ...props }) => {


    const listOption = data.map(dt => (
        <Select.Option key={dt.id} value={dt.id}>
            {dt.name}
        </Select.Option>
    ))

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
            <Select
                style={{
                    width: '100%',
                    border: isInvalidMessage && `1px solid red`,
                    borderRadius: '8px'
                }}
                {...props}
            >
                {listOption}
            </Select>
            {isInvalidMessage && <Typography.Text style={{ fontSize: '0.8rem', color: 'red' }}>
                {isInvalidMessage}
            </Typography.Text>}
        </Col>
    )
}

export default SelectField;