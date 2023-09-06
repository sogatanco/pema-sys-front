import React, { useEffect, useContext, useState } from 'react';
import {
  Alert,
  Button,
  Label,
  FormGroup,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
} from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLogo from '../../layouts/logo/AuthLogo';
import { ReactComponent as LeftBg } from '../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../assets/images/bg/login-bg-right.svg';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const { loading, error, dispatch } = useContext(AuthContext);
  const [errStatus, setErrStatus] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleLogin = async (data) => {
    dispatch({ type: 'LOGIN_START' });

    const res = await axios.post('http://127.0.0.1:8000/api/auth/login', data);
    if (res.data.status) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.auth });
      navigate('/');
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: res.data.message });
      setErrStatus(true);
      navigate('/auth/login');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setErrStatus(false);
    }, 5000);
  }, [errStatus]);

  return (
    <div className="loginBox">
      <LeftBg className="position-absolute left bottom-0" />
      <RightBg className="position-absolute end-0 top" />
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="12" className="loginContainer">
            <AuthLogo />
            <Card>
              <CardBody className="p-4 m-1">
                <h4 className="mb-0 fw-bold mb-4 text-center">Login</h4>
                {/* <small className="pb-4 d-block">
                  Do not have an account? <Link to="/auth/registerformik">Sign Up</Link>
                </small> */}
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(fields) => handleLogin(fields)}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Field
                          name="email"
                          type="text"
                          className={`form-control${
                            errors.email && touched.email ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Field
                          name="password"
                          type="password"
                          className={`form-control${
                            errors.password && touched.password ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </FormGroup>
                      <FormGroup className="form-check d-flex" inline>
                        <Label check>
                          <Input type="checkbox" />
                          Remember me
                        </Label>
                        <Link className="ms-auto text-decoration-none" to="/auth/forgotPwd">
                          <small>Forgot Pwd?</small>
                        </Link>
                      </FormGroup>
                      <FormGroup>
                        <div className="d-grid gap-2">
                          <Button
                            type="submit"
                            color="primary"
                            className="btn btn-primary btn-block"
                          >
                            {loading ? 'Loading..' : 'Login'}
                          </Button>
                        </div>
                      </FormGroup>
                    </Form>
                  )}
                </Formik>
                {errStatus && <Alert color="danger">{error}</Alert>}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
