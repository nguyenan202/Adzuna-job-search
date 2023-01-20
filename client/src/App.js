import { useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Home from './pages/HomePage';
import { setLogin, setLogout } from './redux/store'

import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import Navbar from './components/Navbar';
import { theme } from 'antd';

function App() {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const themeToken = theme.useToken().token;

  useEffect(() => {

    const getUser = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
        const { data } = await axios.get(url, { withCredentials: true });

        dispatch(setLogin({
          user: data.user,
          token: data.token
        }));

      } catch (err) {

      }
    }

    getUser();
  }, [dispatch])


  return (
    <div className="App" style={{ backgroundColor: themeToken.mainBackground }}>

      {user && <Navbar user={user}/>}
      
      <Routes>
        <Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
        <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
      </Routes>
    </div>
  );
}

export default App;
