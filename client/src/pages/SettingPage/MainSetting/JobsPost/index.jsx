import { Button, Col, Input, Modal, Row, Select, Spin, Typography, notification, theme } from "antd"
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { socket } from '../../../../App';

import styles from './styles.module.scss';
import useMediaQuery from "../../../../hooks/useMediaQuery";



const JobsPost = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAddJob, setIsLoadingAddJob] = useState(false);
    const [isLoadingAddSpecialization, setIsLoadingAddSpecialization] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [jobIdSelected, setJobIdSelected] = useState(null);
    const [showModalAddJob, setShowModalAddJob] = useState(false);
    const [showModalAddSpecialization, setShowModalAddSpecialization] = useState(false);
    const [valueAddJob, setValueAddJob] = useState('');
    const [valueAddSpecialization, setValueSpecialization] = useState('');
    const [api, contextHolder] = notification.useNotification();
    const [keyRerender, setKeyRerender] = useState(0);

    const token = useSelector(state => state.token);
    const themeToken = theme.useToken().token;

    const breakPointMobile = useMediaQuery('(max-width: 576px)');

    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            duration: 2
        });
    };

    useEffect(() => {
        socket.on('update-job', () => {
            setKeyRerender(keyRerender + 1);
        })
        socket.on('update-specialization', () => {
            setKeyRerender(keyRerender + 1);
        })
    }, [keyRerender])

    useEffect(() => {
        const fetchingJobs = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/job`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setJobs(response.data);
        }

        setIsLoading(true);
        fetchingJobs().then(() => {
            setIsLoading(false);
        });

    }, [token, keyRerender])

    useEffect(() => {
        const fetchingSpecializations = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/specialization/${jobIdSelected}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setSpecializations(response.data);
        }

        setIsLoading(true);
        fetchingSpecializations().then(() => {
            setIsLoading(false);
        });
    }, [jobIdSelected, token, keyRerender])

    const allJob = jobs && jobs.map(job => (
        <Select.Option
            key={job.id}
            value={job.id}
            label={job.name}
        >
            {job.name}
        </Select.Option>
    ))


    const allSpecialization = specializations && specializations.map(specialization => (
        <Select.Option
            key={specialization.id}
            value={specialization.id}
            label={specialization.name}
        >
            {specialization.name}
        </Select.Option>
    ))

    const handleAddJob = async () => {
        if (valueAddJob === '') return openNotificationWithIcon('error', 'Không thể tạo Ngành Nghề trống')

        try {
            setIsLoadingAddJob(true);
            setIsLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/job`, {
                name: valueAddJob
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.data.status) {
                openNotificationWithIcon('success', 'Thêm công việc thành công')
            }
            setIsLoadingAddJob(false);
            setValueAddJob('');
        } catch (err) {
            openNotificationWithIcon('error', err.response.data.msg);
            setIsLoadingAddJob(false);
        }
        setShowModalAddJob(false);
        setIsLoading(false);
    }

    const handleAddSpecialization = async () => {
        if (!jobIdSelected) return openNotificationWithIcon('error', 'Vui lòng chọn 1 Ngành nghề để thêm Lĩnh Vực')
        if (valueAddSpecialization === '') return openNotificationWithIcon('error', 'Không thể tạo Lĩnh Vực trống')

        try {
            setIsLoadingAddSpecialization(true);
            setIsLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/specialization`, {
                name: valueAddSpecialization,
                jobId: jobIdSelected
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.data.status) {
                openNotificationWithIcon('success', 'Thêm lĩnh vực thành công')
            }
            setValueSpecialization('');
            setIsLoadingAddSpecialization(false);
        } catch (err) {
            openNotificationWithIcon('error', err.response.data.msg);
            setIsLoadingAddSpecialization(false);
        }
        setShowModalAddSpecialization(false);
        setIsLoading(false);
    }



    return (
        <Row
            className={styles.sub_container}
            style={{
                width: '100%',
                marginTop: '1.5rem',
                backgroundColor: themeToken.componentBackground
            }}
        >
            {contextHolder}
            <Typography.Title
                style={{
                    fontSize: '1.5rem'
                }}
            >
                Ngành nghề và lĩnh vực
            </Typography.Title>

            <Row
                className={styles.full_width}
                style={{
                    justifyContent: 'space-between',
                    marginTop: '0.5rem',
                    position: 'relative',
                    opacity: isLoading && '0.5'
                }}
            >
                <Col
                    span={breakPointMobile ? 24 : 11}
                    style={{ margin: '1rem 0' }}
                >
                    <Select
                        placeholder='Ngành nghề'
                        size='large'
                        style={{
                            width: '100%'
                        }}
                        onSelect={id => setJobIdSelected(id)}
                    >
                        {allJob}
                    </Select>
                    <Button
                        size="large"
                        style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor
                        }}
                        disabled={isLoading}
                        onClick={() => setShowModalAddJob(true)}
                    >
                        Thêm ngành
                    </Button>
                </Col>
                <Col
                    span={breakPointMobile ? 24 : 11}
                    style={{ margin: '1rem 0' }}
                >
                    <Select
                        placeholder='Lĩnh vực'
                        size='large'
                        style={{
                            width: '100%'
                        }}
                        labelInValue={false}
                    >
                        {allSpecialization}
                    </Select>
                    <Button
                        size="large"
                        style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            backgroundColor: themeToken.mainColor,
                            color: themeToken.textColor
                        }}
                        disabled={isLoading}
                        onClick={() => setShowModalAddSpecialization(true)}
                    >
                        Thêm lĩnh vực
                    </Button>
                </Col>

                {isLoading &&
                    <Row
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%'
                        }}
                    >
                        <Spin />
                    </Row>
                }
            </Row>


            {/* Modal Thêm ngành nghề */}
            <Modal
                title={<Typography.Title>Thêm ngành nghề</Typography.Title>}
                open={showModalAddJob}
                onCancel={() => setShowModalAddJob(false)}
                confirmLoading={isLoadingAddJob}
                onOk={handleAddJob}
            >
                <Input
                    size="large"
                    placeholder="e.g Công nghệ thông tin"
                    value={valueAddJob}
                    onChange={e => setValueAddJob(e.target.value)}
                />
            </Modal>

            {/* Modal Thêm lĩnh vực */}
            <Modal
                title={<Typography.Title>Thêm lĩnh vực</Typography.Title>}
                open={showModalAddSpecialization}
                onCancel={() => setShowModalAddSpecialization(false)}
                confirmLoading={isLoadingAddSpecialization}
                onOk={handleAddSpecialization}
            >
                <Row style={{ marginBottom: '0.5rem' }}>
                    <Typography.Text style={{ fontSize: '1.1rem', margin: 0 }}>
                        Ngành nghề:
                    </Typography.Text>
                    <Typography.Paragraph style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0 0.5rem' }}>
                        {jobs && jobIdSelected && `${jobs.find(jobs => jobs.id === jobIdSelected).name}`}
                    </Typography.Paragraph>
                </Row>
                <Input
                    size="large"
                    placeholder="e.g Kỹ sư phần mềm"
                    value={valueAddSpecialization}
                    onChange={e => setValueSpecialization(e.target.value)}
                />
            </Modal>
        </Row>
    )
}

export default JobsPost;