import { Row } from "antd"
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import styles from './styles.module.scss';
import SpinLoading from "../../components/SpinLoading";
import PageMessage from '../../components/PageMessage';
import ToolBar from "./ToolBar";
import Resume from "./Resume";
import reducer from "./reducer";

const initState = {
    name: null,
    title: null,
    picturePath: null,
    fullName: null,
    gender: null,
    dob: null,
    phone: null,
    email: null,
    address: null,
    pictureChange: null
}

const CV = () => {

    const { id, viewOnly } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [state, dispatch] = useReducer(reducer, initState);
    
    const token = useSelector(state => state.token);
    const user = useSelector(state => state.user);

    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/cv/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.status === 200 && response.data.status && (response.data.cv.userId === user.id || viewOnly)) {
                    dispatch({
                        type: 'set_state',
                        payload: response.data.cv
                    })
                } else {
                    dispatch({ type: 'set_null' })
                }
            } catch (err) {
                dispatch({ type: 'set_null' })
            }
        }

        setIsLoading(true);
        fetching().then(() => {
            setIsLoading(false);
        })
    }, [id, token, user.id])
    
    return (isLoading ? <SpinLoading height='calc(100vh - 66px)' /> :
        (state && state.id ?
            <Row
                className={styles.container}
            >
                {!viewOnly && <ToolBar
                    state={state}
                    dispatch={dispatch}
                    cv={state}
                />}
                <Row
                    className={styles.resume}
                >
                    <Resume
                        cv={state}
                        dispatch={dispatch}
                        viewOnly={viewOnly}
                    />
                </Row>
            </Row>
            :
            <PageMessage
                message='403 Không có quyền truy cập'
            />
        )
    )
}

export default CV;