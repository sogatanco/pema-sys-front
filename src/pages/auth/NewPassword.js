import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Container, FormGroup, Label, Row, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ReactComponent as LeftBg } from '../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../assets/images/bg/login-bg-right.svg';
import useAxios from '../../hooks/useAxios';

const NewPassword = () => {
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [tokenIsValid, setTokenIsValid] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const api = useAxios();

  const params = new URLSearchParams(window.location.search);
  const token = params.get('key');

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      api
        .get(`api/auth/forgot-password/${token}`)
        .then(() => {
          setIsFetching(false);
          setTokenIsValid(true);
        })
        .catch(() => {
          setIsFetching(false);
          setTokenIsValid(false);
        });
    }
    fetchData();
  }, [token]);

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password baru harus diisi')
      .min(8, 'Password harus berisi min. 8 karakter')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Harus Berisi 8 Karakter, Satu Huruf Besar, Satu Huruf Kecil, Satu Angka, dan Satu Karakter Khusus',
      ),
    confirmPassword: Yup.string()
      .required('Konfirmasi password harus diisi')
      .oneOf([Yup.ref('password'), null], 'Password harus cocok'),
  });

  const handleSend = async (data) => {
    setLoading(true);
    data.token = token;
    await api
      .post(`api/auth/new-password`, data)
      .then(() => {
        setIsSuccess(true);
        setIsFailed(false);
        setLoading(false);
        setAlertMessage('Password berhasil diubah. Silakan login kembali.');
        document.getElementById('form-pass').reset();
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 5000);
      })
      .catch(() => {
        setIsSuccess(false);
        setLoading(false);
        setIsFailed(true);
        setAlertMessage('Gagal mengirim data. Silakan coba lagi');
      });
  };

  return (
    <div className="loginBox">
      <LeftBg className="position-absolute left bottom-0" />
      <RightBg className="position-absolute end-0 top" />
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="12" className="loginContainer">
            <Card className="rounded-4">
              {isFetching ? (
                <CardBody className="p-4 m-1">
                  <p className="text-center">Loading..</p>
                </CardBody>
              ) : (
                <CardBody className="p-4 m-1">
                  {!tokenIsValid ? (
                    <div className="text-center">
                      <h4>
                        Link tidak valid atau expired. <br />
                        <i>
                          {' '}
                          <Link to="/auth/forgot-password">Kirim ulang link</Link>
                        </i>
                      </h4>
                    </div>
                  ) : (
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={(fields) => handleSend(fields)}
                    >
                      {({ errors, touched }) => (
                        <>
                          {isFailed ||
                            (!isSuccess && <h4 className="text-center">{alertMessage}</h4>)}
                          <Form id="form-pass">
                            <FormGroup>
                              <Label htmlFor="password" className="text-center">
                                Password Baru
                              </Label>
                              <Field
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="on"
                                className={`form-control${
                                  errors.password && touched.password ? ' is-invalid' : ''
                                } rounded-3`}
                              />
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                            <FormGroup>
                              <Label htmlFor="confirmPassword" className="text-center">
                                Konfirmasi Password Baru
                              </Label>
                              <Field
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="on"
                                className={`form-control${
                                  errors.confirmPassword && touched.confirmPassword
                                    ? ' is-invalid'
                                    : ''
                                } rounded-3`}
                              />
                              <ErrorMessage
                                name="confirmPassword"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                            <FormGroup>
                              <div className="d-grid gap-2">
                                <Button
                                  type="submit"
                                  color="primary"
                                  className="btn btn-primary btn-block mb-1 rounded-3"
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <Spinner className="me-2" size="sm" color="light" />
                                      loading ..
                                    </>
                                  ) : (
                                    'Submit'
                                  )}
                                </Button>
                              </div>
                            </FormGroup>
                          </Form>
                        </>
                      )}
                    </Formik>
                  )}
                </CardBody>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NewPassword;
