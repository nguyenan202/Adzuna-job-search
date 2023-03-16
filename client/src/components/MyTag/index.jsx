import { Tag } from "antd"

const roleColor = ['none','blue','gold','green'];

const MyTag = ({ color, myColor, name, ...props }) => {

    return(
        <Tag
            color={roleColor[color] || myColor}
            {...props}
        >
            {name}
        </Tag>
    )
}

export default MyTag;