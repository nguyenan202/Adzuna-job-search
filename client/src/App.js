import { useEffect, useState } from 'react';
import './App.css';
import Login from './pages/Login';
import Home from './pages/HomePage';
import { setLogin } from './redux/store'

import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import Navbar from './components/Navbar';
import { theme } from 'antd';
import Setting from './pages/SettingPage';
import Profile from './pages/Profile';
import SpinLoading from './components/SpinLoading';
import PostPage from './pages/PostPage';

function App() {

  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const token = useSelector(state => state.token);
  const themeToken = theme.useToken().token;

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

  // console.log(token);
  return (
    <div className="App" style={{ backgroundColor: themeToken.mainBackground }}>
      {isLoading ? <SpinLoading /> : <>
        {user && <Navbar user={user} />}

        <Routes>
          <Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
          <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
          <Route path='/setting' element={user ? <Setting /> : <Navigate to='/login' />} />
          <Route path='/profile' element={user ? <Profile user={user} /> : <Navigate to='/login' />} />
          <Route path='/up-post' element={user ? <PostPage user={user}/> : <Navigate to='/login' />} />
        </Routes>
      </>}
    </div>
  );
}

export default App;
