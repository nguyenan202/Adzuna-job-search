import { Button, Col, Input, Modal, Row, Select, Spin, Typography, notification, theme } from "antd"
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import styles from './styles.module.scss';
import useMediaQuery from "../../../../hooks/useMediaQuery";
import { socket } from '../../../../App';


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
        if (valueAddJob === '') return openNotificationWithIcon('error', 'Kh??ng th??? t???o Ng??nh Ngh??? tr???ng')

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
                openNotificationWithIcon('success', 'Th??m c??ng vi???c th??nh c??ng')
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
        if (!jobIdSelected) return openNotificationWithIcon('error', 'Vui l??ng ch???n 1 Ng??nh ngh??? ????? th??m L??nh V???c')
        if (valueAddSpecialization === '') return openNotificationWithIcon('error', 'Kh??ng th??? t???o L??nh V???c tr???ng')

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
                openNotificationWithIcon('success', 'Th??m l??nh v???c th??nh c??ng')
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
                Ng??nh ngh??? v?? l??nh v???c
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
                        placeholder='Ng??nh ngh???'
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
                        Th??m ng??nh
                    </Button>
                </Col>
                <Col
                    span={breakPointMobile ? 24 : 11}
                    style={{ margin: '1rem 0' }}
                >
                    <Select
                        placeholder='L??nh v???c'
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
                        Th??m l??nh v???c
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


            {/* Modal Th??m ng??nh ngh??? */}
            <Modal
                title={<Typography.Title>Th??m ng??nh ngh???</Typography.Title>}
                open={showModalAddJob}
                onCancel={() => setShowModalAddJob(false)}
                confirmLoading={isLoadingAddJob}
                onOk={handleAddJob}
            >
                <Input
                    size="large"
                    placeholder="e.g C??ng ngh??? th??ng tin"
                    value={valueAddJob}
                    onChange={e => setValueAddJob(e.target.value)}
                />
            </Modal>

            {/* Modal Th??m l??nh v???c */}
            <Modal
                title={<Typography.Title>Th??m l??nh v???c</Typography.Title>}
                open={showModalAddSpecialization}
                onCancel={() => setShowModalAddSpecialization(false)}
                confirmLoading={isLoadingAddSpecialization}
                onOk={handleAddSpecialization}
            >
                <Row style={{ marginBottom: '0.5rem' }}>
                    <Typography.Text style={{ fontSize: '1.1rem', margin: 0 }}>
                        Ng??nh ngh???:
                    </Typography.Text>
                    <Typography.Paragraph style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0 0.5rem' }}>
                        {jobs && jobIdSelected && `${jobs.find(jobs => jobs.id === jobIdSelected).name}`}
                    </Typography.Paragraph>
                </Row>
                <Input
                    size="large"
                    placeholder="e.g K??? s?? ph???n m???m"
                    value={valueAddSpecialization}
                    onChange={e => setValueSpecialization(e.target.value)}
                />
            </Modal>
        </Row>
    )
}

export default JobsPost;