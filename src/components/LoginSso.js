import React, { useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useAxios from '../hooks/useAxios';

// const SYS_URL = process.env.REACT_APP_SYS_URL;

const LoginSso = () => {
  const { dispatch } = useContext(AuthContext);
  const params = new URLSearchParams(window.location.search);

  const api = useAxios();
  const navigate = useNavigate();

  const token = params.get('token') || '';

  const handleLoginSso = async (email) => {
    dispatch({ type: 'LOGIN_START' });

    await api
      .post(
        `auth/api/login`,
        { email },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        navigate('/');
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.auth });
      })
      .catch((err) => {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: err.response?.data.message || 'Something went wrong.',
        });
      });
  };

  useEffect(() => {
    if (token !== '') {
      const tokenDecode = jwtDecode(token);
      handleLoginSso(tokenDecode.email);
      // const isExpired = jwtDecode(token).exp < Date.now() / 1000;

      // if (isExpired) {
      //   window.location.href = `${SYS_URL}/auth/login`;
      // } else {

      // }
    }
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* loading usign SSO */}
      <div className="d-flex gap-3 align-items-center">
        <Spinner />
        <div>Proses otentikasi via PEMA SSO</div>
      </div>
    </div>
  );
};

export default LoginSso;
