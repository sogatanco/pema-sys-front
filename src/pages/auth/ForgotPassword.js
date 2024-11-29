import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, FormGroup, Label, Row, Spinner } from 'reactstrap';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ReactComponent as LeftBg } from '../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../assets/images/bg/login-bg-right.svg';
import useAxios from '../../hooks/useAxios';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const navigate = useNavigate();
  const api = useAxios();

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
  });

  const handleSend = async (data) => {
    setLoading(true);

    await api
      .post('api/auth/forgot-password', data)
      .then(() => {
        setLoading(false);
        setIsEmailSent(true);

        setTimeout(() => {
          navigate('/auth/login');
        }, 7000);
      })
      .catch((err) => {
        setLoading(false);
        setIsError(true);
        setErrMessage(err.response.data.message);
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
              <CardBody className="p-4 m-1">
                <div className="text-center">
                  <h4>
                    {isEmailSent ? 'Email Terkirim' : isError ? errMessage : 'Lupa Password?'}
                  </h4>
                </div>
                {isEmailSent ? (
                  <p className="text-center">Silakan cek email untuk mengatur ulang kata sandi</p>
                ) : (
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(fields) => handleSend(fields)}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <FormGroup>
                          <Label htmlFor="email" className="text-center">
                            Masukkan alamat email @ptpema.co.id sistem akan mengirimkan instruksi
                            untuk mengatur ulang kata sandi.
                          </Label>
                          <Field
                            id="email"
                            name="email"
                            type="text"
                            autoComplete="on"
                            className={`form-control${
                              errors.email && touched.email ? ' is-invalid' : ''
                            } rounded-3`}
                          />
                          <ErrorMessage name="email" component="div" className="invalid-feedback" />
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
                                'Send'
                              )}
                            </Button>
                          </div>
                        </FormGroup>
                      </Form>
                    )}
                  </Formik>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
