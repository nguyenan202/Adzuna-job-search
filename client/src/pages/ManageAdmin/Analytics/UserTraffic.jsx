import { Col, Row, Spin, Statistic } from "antd";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';
import axios from 'axios';

import styles from './styles.module.scss';
import { useEffect, useState } from "react";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        // title: {
        //     display: true,
        //     text: 'Lưu lượng truy cập',
        // },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const datas = {
    labels,
    datasets: [
        {
            label: 'Data',
            data: [0, 125, 200, 300, 426],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
    ],
};

const formatter = (value) => <CountUp end={value} separator="," />;

const UserTraffic = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

    const token = useSelector(state => state.token);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_API_URL}/traffic`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resp => setData(resp.data))
            .finally(() => {
                setIsLoading(false);
            })
    }, [token])

    const handleData = (data) => {
        const dataFilter = data.filter(d => d.createdAt.slice(0, 4) === '2023');
        let dataNew = {};

        dataFilter.forEach(d => {
            const dataObj = new Date(d.createdAt);
            const month = dataObj.getUTCMonth();

            dataNew = {
                ...dataNew,
                [labels[month]]: dataNew[labels[month]] ? dataNew[labels[month]] + 1 : 1
            }
        })

        return Object.entries(dataNew).map(([key, value]) => value)
    }

    const getDataCurrentMonth = (data) => {
        const dataObj = new Date();
        const month = (dataObj.getUTCMonth()+1).toString().length === 1 ? `0${dataObj.getUTCMonth()+1}` : dataObj.getUTCMonth()+1;
        const year = dataObj.getUTCFullYear();

        const newData = data.filter(d => d.createdAt.slice(0,7) === `${year}-${month}`);

        return newData
    }

    const getDataCurrentDay = (data) => {
        const dataObj = new Date();
        const month = (dataObj.getUTCMonth()+1).toString().length === 1 ? `0${dataObj.getUTCMonth()+1}` : dataObj.getUTCMonth()+1;
        const year = dataObj.getUTCFullYear();
        const date = dataObj.getUTCDate();
        console.log(`${year}-${month}-${date}`);
        const newData = data.filter(d => d.createdAt.slice(0,10) === `${year}-${month}-${date}`);

        return newData;
    }

    return (
        <Row
            className={styles.container}
        >
            {isLoading && <Row className={styles.loading}>
                <Spin />
            </Row>}
            <Col
                className={styles.container_left}
                span={9}
            >
                <Row
                    className={styles.card}
                >
                    <Statistic
                        title='Lượng truy cập trong ngày'
                        value={getDataCurrentDay(data).length}
                        formatter={formatter}
                    />
                </Row>
                <Row
                    className={styles.card}
                >
                    <Statistic
                        title='Lượng truy cập trong tháng'
                        value={getDataCurrentMonth(data).length}
                        formatter={formatter}
                    />
                </Row>
            </Col>
            <Col span={14}>
                <Line
                    options={options}
                    data={{
                        labels,
                        datasets: [
                            {
                                label: 'Data',
                                data: handleData(data),
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            }
                        ],
                    }}
                />
            </Col>
        </Row>
    )
}

export default UserTraffic;