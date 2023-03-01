import { useSelector } from "react-redux";
import { Row } from "antd";
import SearchHeader from "../../components/SearchHeader";
import Jobs from "./Jobs";
import { useEffect, useState } from "react";
import axios from "axios";

export const cities = [
    {
        id: 1,
        name: 'Hà Nội'
    },
    {
        id: 2,
        name: 'Đà Nẵng'
    },
    {
        id: 3,
        name: 'Hồ Chí Minh'
    },
    {
        id: 4,
        name: 'Cần Thơ'
    },
    {
        id: 5,
        name: 'Khác'
    }
]

const HomePage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState({
        key: 0,
        data: {}
    })

    const token = useSelector(state => state.token);
    
    useEffect(() => {
        try {
            const fetching = async() => {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/post/active`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.data.status) setPosts(response.data.posts)
            }

            setIsLoading(true);
            fetching().then(() => {
                setIsLoading(false);
            })
        }catch(err) {
            setPosts([]);
        }

    },[token])

    useEffect(() => {
        try {
            const fetching = async (data, token) => {
                const searchValue = data.value === '' ? ':name' : data.value;
                const response = await axios(`${process.env.REACT_APP_API_URL}/post/all/${searchValue}?salary_start=${data.salary[0]}&salary_end=${data.salary[1]}&location=${data.location}&specializationId=${data.specialization}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            
                if (response.data.status) {
                    setPosts(response.data.posts)
                }
            }

            if (search.key !== 0) {
                setIsLoading(true);
                fetching(search.data, token).then(() => {
                    setIsLoading(false);
                })
            }
        }catch(err) {
            console.log(err);
        }
    }, [search.key, token])

    
    return (
        <Row>
            <SearchHeader
                numberOfPost={posts.length}
                cities={cities}
                search={search}
                setSearch={setSearch}
                loadingHome={isLoading}
            />
            <Jobs
                posts={posts}
                isLoading={isLoading}
            />
        </Row>
    )
}

export default HomePage