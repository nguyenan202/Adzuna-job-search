import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Login from './pages/Login';
import Home from './pages/HomePage';
import { setLogin, setNotification, setUser, setLogout } from './redux/store'
import { io } from 'socket.io-client';


import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import Navbar from './components/Navbar';
import { notification, theme } from 'antd';
import Setting from './pages/SettingPage';
import Profile from './pages/Profile';
import SpinLoading from './components/SpinLoading';
import UpPostPage from './pages/UpPostPage';
import ManagePostPage from './pages/ManagePostPage';
import ManagePostPageForAdmin from './pages/ManagePostPageForAdmin';
import CompanyPage from './pages/CompanyPage';
import PostPage from './pages/PostPage';
import ListCompanyPage from './pages/ListCompanyPage';
import ManageCV from './pages/ManageCV';
import CV from './pages/CvPage';
import Chat from './components/Chat';
import ManageAdmin from './pages/ManageAdmin';

export const socket = io.connect(process.env.REACT_APP_API_URL);

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const token = useSelector(state => state.token);
  const themeToken = theme.useToken().token;

  const openNotificationWithIcon = useCallback((type, message) => {
    api[type]({
      message: message,
      duration: 3
    });
  }, [api]);

  useEffect(() => {
    dispatch(setNotification({
      notification: openNotificationWithIcon
    }))
  }, [dispatch, openNotificationWithIcon])

  // Check login third
  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true)
        const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
        const { data } = await axios.get(url, { withCredentials: true });

        dispatch(setLogin({
          user: data.user,
          token: data.token
        }));
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    }

    getUser();
  }, [dispatch])

  useEffect(() => {
    user && axios.post(`${process.env.REACT_APP_API_URL}/traffic`, {
      userId: user.id
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    const fetchingUser = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      dispatch(setUser({
        user: response.data
      }))
      navigate('/');
      openNotificationWithIcon('info', 'Quyền của bạn đã được thay đổi bởi Admin');
    }

    const handleLogout = () => {
      dispatch(setLogout());
      openNotificationWithIcon('warning', 'Vui lòng đăng nhập lại');
    }

    // Listen event update role
    user && socket.on(`updated-roleId-${user.Role.id}`, fetchingUser);
    user && socket.on(`updated-permission-${user.id}`, fetchingUser);
    user && socket.on(`updated-role-userId-${user.id}`, fetchingUser);
    user && socket.on(`logout-user-${user.id}`, handleLogout);
    if (user) {
      socket.auth = { userId: user.id };
      socket.connect();
    }

    if (user) return () => {
      socket.off(`updated-roleId-${user.Role.id}`);
      socket.off(`updated-permission-${user.id}`);
      socket.off(`updated-role-userId-${user.id}`);
      socket.off(`logout-user-${user.id}`, handleLogout);
    }
  }, [user, token, dispatch, navigate, openNotificationWithIcon])

  // console.log(token);
  // console.log(user);
  return (
    <div className="App" style={{ backgroundColor: themeToken.mainBackground }}>
      {isLoading ? <SpinLoading /> : <>
        {user && <Navbar user={user} />}

        {contextHolder}

        <Routes>
          <Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
          <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
          <Route path='/setting' element={user ? <Setting /> : <Navigate to='/login' />} />
          <Route path='/profile' element={user ? <Profile user={user} /> : <Navigate to='/login' />} />
          <Route path='/up-post' element={user ? <UpPostPage user={user} /> : <Navigate to='/login' />} />
          <Route path='/manage-post' element={user ? <ManagePostPage user={user} /> : <Navigate to='/login' />} />
          <Route path='/manage-post-admin' element={user ? <ManagePostPageForAdmin user={user} /> : <Navigate to='/login' />} />
          <Route path='/company/:id' element={user ? <CompanyPage user={user} /> : <Navigate to='/login' />} />
          <Route path='/post/:id' element={user ? <PostPage /> : <Navigate to='/login' />} />
          <Route path='/list-company' element={user ? <ListCompanyPage /> : <Navigate to='/login' />} />
          <Route path='/manage-cv' element={user ? <ManageCV /> : <Navigate to='/login' />} />
          <Route path='/cv/:id' element={user ? <CV /> : <Navigate to='/login' />} />
          <Route path='/cv/:id/view-only/:viewOnly' element={user ? <CV /> : <Navigate to='/login' />} />
          <Route path='/manage' element={user ? <ManageAdmin user={user} /> : <Navigate to='/login' />} />
        </Routes>

        {user &&
          <Chat />
        }
      </>}
    </div>
  );
}

export default App;
