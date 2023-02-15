import { Avatar, Col, Row, Select, Spin, Typography, theme } from "antd"
import axios from "axios";
import { debounce } from 'lodash'
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import InfoPermission from "../../../components/InfoPermission";
import useMediaQuery from "../../../hooks/useMediaQuery";
import styles from './styles.module.scss';

const DebounceSelect = ({ user, fetchFunction, debounceTime = 300, setUserChoose, setIsLoading, token, ...props }) => {

    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([])
            setFetching(true)

            fetchFunction(value, token).then(newOptions => {
                setOptions(newOptions)
                setFetching(false)
            })
        }

        return debounce(loadOptions, debounceTime)
    }, [debounceTime, fetchFunction, token])

    const handleSelect = async (id) => {
        setIsLoading(true);
        const userResponse = await fetchUser(id, token);
        setUserChoose(userResponse);
    }

    const spinLoad = (
        <Row
            style={{
                width: '100%',
                justifyContent: 'center',
                margin: '1rem 0'
            }}
        >
            <Spin />
        </Row>
    )

    return (
        <Select
            showSearch
            size="large"
            style={{
                width: '100%',
            }}
            placeholder="Search User"
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? spinLoad : null}
            onSelect={handleSelect}
            {...props}
        >
            {options.filter(u => u.id !== user.id).map(option => (
                <Select.Option key={option.id} value={option.id} >
                    <Row
                        style={{
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Col>
                            <Avatar
                                src={option.externalId ? option.picturePath : `${process.env.REACT_APP_API_URL}/images/${option.picturePath}`}
                                alt='avatar'
                                style={{
                                    marginRight: '1rem'
                                }}
                            />
                            {`${option.lastName} ${option.firstName}`}
                        </Col>
                        <Col
                            style={{
                                color: 'green'
                            }}
                        >
                            #{option.id}
                        </Col>
                    </Row>
                </Select.Option>
            ))
            }
        </Select>
    )
}

const fetchFunction = async (value, token) => {
    if (value === '') return [];
    const resp = await axios(`${process.env.REACT_APP_API_URL}/user/name/${value}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return resp.data;
}

const fetchUser = async (id, token) => {
    if (!id) return;
    const resp = await axios(`${process.env.REACT_APP_API_URL}/user/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return resp.data;
}

const PermissionsSetting = () => {

    const [userChoose, setUserChoose] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);

    const themeToken = theme.useToken().token;

    const breakPointTablet = useMediaQuery('(min-width: 572px)');

    return (
        <Row
            className={styles.sub_container}
            style={{
                width: '100%',
                backgroundColor: themeToken.componentBackground
            }}
        >
            <Row
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
            >
                <Typography.Title>
                    Chỉnh sửa quyền người dùng
                </Typography.Title>
            </Row>
            <Row
                justify='center'
                style={{
                    width: '100%',
                    padding: breakPointTablet ? '1rem' : '1rem 0'
                }}
            >
                <DebounceSelect
                    user={user}
                    fetchFunction={fetchFunction}
                    debounceTime={500}
                    setUserChoose={setUserChoose}
                    setIsLoading={setIsLoading}
                    token={token}
                />
            </Row>
            {isLoading && (
                <Row
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        margin: '1rem 0'
                    }}
                >
                    <Spin />
                </Row>)}

            {userChoose && <InfoPermission
                user={userChoose}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />}

        </Row>
    )
}

export default PermissionsSetting