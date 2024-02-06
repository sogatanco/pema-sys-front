import React, { useState } from 'react';
import { Card, CardBody, FormGroup, Input, Label, Form, Row, Col, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { alert } from '../../components/atoms/Toast';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const ChangePassword = () => {
  const { dispatch } = useAuth();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const api = useAxios();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!data?.password) {
      alert('error', 'New password cannot be empty');
    } else if (!data?.confirmpassword) {
      alert('error', 'Confirm New password cannot be empty');
    }
    if (data?.password !== data?.confirmpassword) {
      alert('error', 'Confirm password does not match');
    } else {
      await api
        .post('api/auth/change-pas', { newpas: data?.password })
        .then(() => {
          alert('success', 'Password changed successfully');
          document.getElementById('form-pass').reset();

          setTimeout(() => {
            dispatch({ type: 'LOGOUT' });
            navigate('/auth/login');
          }, 2000);
        })
        .catch(() => alert('error', 'Something went wrong'));
    }
    setLoading(false);
  };

  return (
    <Row className="justify-content-center">
      <Col lg="8">
        <Card className="rounded-4">
          <CardBody>
            <Form onSubmit={handleSubmit} id="form-pass">
              {/* <FormGroup>
                <Label>Password Lama</Label>
                <Input type="password"></Input>
              </FormGroup> */}
              <FormGroup>
                <Label>New Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => handleChange(e)}
                  required
                  minLength="8"
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  name="confirmpassword"
                  id="confirmpassword"
                  onChange={(e) => handleChange(e)}
                  required
                  minLength="8"
                ></Input>
              </FormGroup>
              <FormGroup>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Loading..' : 'Save'}
                </Button>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ChangePassword;
