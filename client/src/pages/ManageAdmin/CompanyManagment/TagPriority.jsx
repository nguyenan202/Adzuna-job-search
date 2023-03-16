import { Tag } from "antd"


const colors = [null, null, 'blue'];

const TagPriority = ({ id, name }) => {
    
    return(
        <Tag
            color={colors[id]}
        >
            {name}
        </Tag>
    )
}

export default TagPriority;