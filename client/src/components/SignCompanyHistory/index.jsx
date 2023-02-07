import { Button, Modal, Row, Table, Tag, Typography } from "antd";

import styles from './styles.module.scss';
import { useState } from "react";
import MyFieldInput from "../MyFieldInput";
import TextArea from "antd/es/input/TextArea";

const shortText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const tagscolor = ['default', 'success', 'error']
const tagsText = ['Đang chờ', 'Đã duyệt', 'Bị từ chối']

const SignCompanyHistory = ({ data }) => {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [signChoose, setSignChoose] = useState(null);

    const handleShowDetail = (data) => {
        setSignChoose(data.detail)
        setIsOpenModal(true)
    }

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
            render: (data) => (
                <Button
                    onClick={() => handleShowDetail(data)}
                >
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
            status: info.status,
            detail: info
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

            {/* Modal detail sign */}
            {signChoose && <Modal
                title={<Typography.Title style={{ fontSize: '2rem' }}>{signChoose.title}</Typography.Title>}
                open={isOpenModal}
                onCancel={() => setIsOpenModal(false)}
                onOk={() => setIsOpenModal(false)}
            >
                <Row justify='center' >
                    <Tag style={{ padding: '0.25rem 1rem' }} color={tagscolor[signChoose.status]}>
                        {tagsText[signChoose.status]}
                    </Tag>
                </Row>
                <MyFieldInput
                    field='Tên công ty'
                    value={signChoose.name}
                    readOnly
                />
                <MyFieldInput
                    field='Website'
                    value={signChoose.url}
                    readOnly
                />

                <Typography.Paragraph
                    className={styles.title_field}
                >
                    Nội dung
                </Typography.Paragraph>
                <TextArea
                    rows={3}
                    style={{ resize: 'none' }}
                    value={signChoose.reason}
                    readOnly
                ></TextArea>

                <MyFieldInput
                    field='Ngày gửi'
                    value={new Date(signChoose.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                    readOnly
                />

                {signChoose.status === 2 &&
                    <>
                        <Typography.Paragraph
                            className={styles.title_field}
                        >
                            Lý do
                        </Typography.Paragraph>
                        <TextArea
                            rows={3}
                            style={{ resize: 'none' }}
                            value={signChoose.comment}
                            readOnly
                        ></TextArea>
                    </>
                }
            </Modal>}
        </Row>
    )
}

export default SignCompanyHistory;