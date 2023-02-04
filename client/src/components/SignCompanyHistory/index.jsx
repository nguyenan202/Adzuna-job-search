import { Button, Row, Table, Tag } from "antd";

import styles from './styles.module.scss';

const shortText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const tagscolor = ['default','success','error']
const tagsText = ['Đang chờ', 'Đã duyệt', 'Bị từ chối']

const SignCompanyHistory = ({ data }) => {


    const colums = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Tên công ty',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            fixed: 'right',
            render: (data) => (
                <Tag color={tagscolor[data]}>
                    {tagsText[data]}
                </Tag>
            )
        },
        {
            title: 'Chi tiết',
            key: 'detail',
            fixed: 'right',
            render: () => (
                <Button>
                    Xem
                </Button>
            )
        }
    ]

    const rows = data.map(info => {

        const date = new Date(info.createdAt);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        return {
            key: info.id,
            title: shortText(info.title, 20),
            name: shortText(info.name, 15),
            date: formattedDate,
            status: info.status
        }
    })

    return (
        <Row
            className={styles.container}
        >
            <Table
                columns={colums}
                dataSource={rows}
                scroll={{
                    x: 500
                }}
                style={{
                    width: '100%'
                }}
            />
        </Row>
    )
}

export default SignCompanyHistory;