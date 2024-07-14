import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  TabContent,
  TabPane,
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
} from 'reactstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import img1 from '../../assets/images/users/user1.jpg';
import img2 from '../../assets/images/users/user2.jpg';
import img3 from '../../assets/images/users/user3.jpg';
import img4 from '../../assets/images/users/user4.jpg';

import time1 from '../../assets/images/bg/bg1.jpg';
import time2 from '../../assets/images/bg/bg2.jpg';
import time3 from '../../assets/images/bg/bg3.jpg';
import time4 from '../../assets/images/bg/bg4.jpg';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

const ProfileTabContent = ({ activeTab }) => {
  const { auth, dispatch } = useAuth();
  const [employe, setEmploye] = useState();
  const [employeTemp, setEmployeTemp] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    religion: '',
    birthday: '',
  });
  const [isBInfoEdit, setIsBInfoEdit] = useState(false);
  const [isIdentityEdit, setIsIdentityEdit] = useState(false);
  const api = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      await api
        .get(`employe/${auth?.user?.employe_id}`, {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        })
        .then((res) => {
          setEmploye(res.data.data);
          setEmployeTemp(res.data.data);
        })
        .catch((e) => {
          if (e.response.status === 401) {
            dispatch({ type: 'LOGOUT' });
            navigate('/auth/login');
          }
        });
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setEmployeTemp((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleEmploSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.patch(
      `http://127.0.0.1:8000/api/employe/${auth?.user?.employe_id}`,
      employeTemp,
      {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      },
    );

    if (res.data.status === true) {
      console.log('sukses update');
    } else {
      console.log('gagal update');
    }
  };

  return (
    <TabContent activeTab={activeTab}>
      <TabPane tabId="1">
        <Row>
          <Col sm="12">
            <div className="p-4">
              <div className="steamline position-relative border-start ms-4 mt-0">
                <div className="sl-item my-3 pb-3 border-bottom">
                  <div className="sl-left float-start text-center rounded-circle text-white me-3 bg-success">
                    <img src={img2} width="40" alt="user" className="rounded-circle" />
                  </div>
                  <div className="sl-right ps-4">
                    <div>
                      <a href="/" className="text-dark fs-5 text-decoration-none">
                        John Doe
                      </a>
                      <span className="ms-2 text-muted">5 minutes ago</span>
                      <p className="text-muted">
                        assign a new task
                        <a href="/"> Design weblayout</a>
                      </p>
                      <Row className="ms-1">
                        <Col lg="3" md="6" className="mb-3">
                          <img src={time1} className="img-fluid rounded" alt="" />
                        </Col>
                        <Col lg="3" md="6" className="mb-3">
                          <img src={time2} className="img-fluid rounded" alt="" />
                        </Col>
                        <Col lg="3" md="6" className="mb-3">
                          <img src={time3} className="img-fluid rounded" alt="" />
                        </Col>
                        <Col lg="3" md="6" className="mb-3">
                          <img src={time4} className="img-fluid rounded" alt="" />
                        </Col>
                      </Row>
                      <div className="desc ms-3">
                        <a href="/" className="text-decoration-none text-dark me-2">
                          2 comment
                        </a>
                        <a href="/" className="text-decoration-none text-dark me-2">
                          <i className="bi bi-heart-fill me-2 text-danger"></i>5 Love
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sl-item my-3 pb-3 border-bottom">
                  <div className="sl-left float-start text-center rounded-circle text-white me-3 bg-success">
                    <img src={img3} width="40" alt="user" className="rounded-circle" />
                  </div>
                  <div className="sl-right ps-4">
                    <div>
                      <a href="/" className="text-dark fs-5 text-decoration-none">
                        John Doe
                      </a>
                      <span className="ms-2 text-muted">5 minutes ago</span>
                      <Row className="mt-3 ms-1">
                        <Col md="3" xs="12">
                          <img src={time1} alt="user" className="img-fluid rounded" />
                        </Col>
                        <Col md="9" xs="12">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
                            odio. Praesent libero. Sed cursus ante dapibus diam.
                          </p>
                          <a href="/" className="btn btn-success">
                            Design weblayout
                          </a>
                        </Col>
                      </Row>
                      <div className="desc ms-3 mt-3">
                        <a href="/" className="text-decoration-none text-dark me-2">
                          2 comment
                        </a>
                        <a href="/" className="text-decoration-none text-dark me-2">
                          <i className="bi bi-heart-fill me-2 text-danger"></i>5 Love
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sl-item my-3 pb-3 border-bottom">
                  <div className="sl-left float-start text-center rounded-circle text-white me-3 bg-success">
                    <img src={img4} width="40" alt="user" className="rounded-circle" />
                  </div>
                  <div className="sl-right ps-4">
                    <div>
                      <a href="/" className="text-dark fs-5 text-decoration-none">
                        John Doe
                      </a>
                      <span className="ms-2 text-muted">5 minutes ago</span>
                      <p className="mt-2 ms-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
                        Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at
                        nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec
                        tellus sed augue semper
                      </p>
                    </div>
                    <div className="desc ms-3 mt-3">
                      <a href="/" className="text-decoration-none text-dark me-2">
                        2 comment
                      </a>
                      <a href="/" className="text-decoration-none text-dark me-2">
                        <i className="bi bi-heart-fill me-2 text-danger"></i>5 Love
                      </a>
                    </div>
                  </div>
                </div>
                <div className="sl-item my-3 pb-3 border-bottom">
                  <div className="sl-left float-start text-center rounded-circle text-white me-3 bg-success">
                    <img src={img1} width="40" alt="user" className="rounded-circle" />
                  </div>
                  <div className="sl-right ps-4">
                    <div>
                      <a href="/" className="text-dark fs-5 text-decoration-none">
                        John Doe
                      </a>
                      <span className="ms-2 text-muted">5 minutes ago</span>
                      <div className="mt-2 ms-3">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </TabPane>
      <TabPane tabId="2">
        <Row>
          <Col sm="12">
            <div className="p-4">
              <div className="d-flex justify-content-between mb-0">
                <div className="d-flex flex-column mb-n2">
                  <h4 className="font-medium mb-n1">Basic Info</h4>
                  <small className="text-muted">
                    Your email address is your identity on PEMA Systems is used to log in.
                  </small>
                </div>
                {!isBInfoEdit && (
                  <div>
                    <Button
                      className="btn"
                      outline
                      size="sm"
                      color="secondary"
                      onClick={() => setIsBInfoEdit(true)}
                    >
                      edit
                    </Button>
                  </div>
                )}
              </div>
              <hr />
              {isBInfoEdit ? (
                <Form onSubmit={handleEmploSubmit}>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Firstname
                      </Label>
                      <Col sm="9">
                        <Input
                          type="text"
                          id="first_name"
                          value={employeTemp?.first_name}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Lastname
                      </Label>
                      <Col sm="9">
                        <Input
                          type="text"
                          id="last_name"
                          value={employeTemp?.last_name}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Email
                      </Label>
                      <Col sm="9">
                        <Input type="email" value={auth?.user.email} readOnly disabled />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Gender
                      </Label>
                      <Col sm="9">
                        <FormGroup>
                          <FormGroup check inline>
                            <Input
                              id="gender"
                              type="radio"
                              name="male"
                              checked={employeTemp?.gender === 'Male'}
                              value="Male"
                              onChange={handleChange}
                            />
                            <Label check>Male</Label>
                          </FormGroup>
                          <FormGroup check inline>
                            <Input
                              id="gender"
                              type="radio"
                              name="female"
                              value="Female"
                              checked={employeTemp?.gender === 'Female'}
                              onChange={handleChange}
                            />
                            <Label check>Female</Label>
                          </FormGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Religion
                      </Label>
                      <Col sm="9">
                        <Input
                          id="religion"
                          type="select"
                          name="Select Category"
                          defaultValue={employe?.religion}
                          onChange={handleChange}
                        >
                          <option>Islam</option>
                          <option>Kristen Protestan</option>
                          <option>Kristen Katolik</option>
                          <option>Hindu</option>
                          <option>Buddha</option>
                          <option>Khonghucu</option>
                        </Input>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Date of Birth
                      </Label>
                      <Col sm="9">
                        <Input
                          type="date"
                          id="birthday"
                          value={employeTemp?.birthday}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Birthday Place
                      </Label>
                      <Col sm="9">
                        <Input
                          type="text"
                          id="birthday_place"
                          value={employe?.birthday_place}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Marital Status
                      </Label>
                      <Col sm="9">
                        <Input
                          type="select"
                          id="marital_status"
                          defaultValue={employeTemp?.marital_status}
                          onChange={handleChange}
                        >
                          <option>Single</option>
                          <option>Married</option>
                          <option>Widow</option>
                          <option>Widower</option>
                        </Input>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Phone Number
                      </Label>
                      <Col sm="9">
                        <Input type="text" placeholder="0852 3000 4000" />
                      </Col>
                    </Row>
                  </FormGroup>
                  <div className="d-flex justify-content-end button-group mt-4">
                    <Button
                      color="secondary"
                      outline
                      size="sm"
                      onClick={() => setIsBInfoEdit(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" color="primary" size="sm">
                      {/* Request change data */}
                      Update
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="">
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Firstname
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>{employe?.first_name}</span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Lastname
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>{employe?.last_name}</span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Email
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>{auth?.user.email}</span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Gender
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>{employe?.gender}</span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Religion
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>{employe?.religion}</span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Date of Birth
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>{employe?.birthday}</span>
                        <Badge color="light" className="ms-3 text-muted">
                          29 years old
                        </Badge>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Birthday Place
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>{employe?.birthday_place}</span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Marital Status
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>{employe?.marital_status}</span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        <span>Phone Number</span>
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>0852 4000 5000</span>
                      </Col>
                    </Row>
                  </FormGroup>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="d-flex justify-content-between mb-0">
                <h4 className="font-medium">Identity & Address</h4>
                {!isIdentityEdit && (
                  <div>
                    <Button
                      className="btn"
                      outline
                      size="sm"
                      color="secondary"
                      onClick={() => setIsIdentityEdit(true)}
                    >
                      edit
                    </Button>
                  </div>
                )}
              </div>
              <hr />
              {isIdentityEdit ? (
                <Form>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        ID Type
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <Input type="select" name="Select ID Type">
                          <option>KTP</option>
                          <option>Passport</option>
                        </Input>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        ID Number
                      </Label>
                      <Col sm="9">
                        <Input type="text" placeholder="1110202020202020" />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Postal Code
                      </Label>
                      <Col sm="9">
                        <Input type="text" placeholder="" />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Citizen ID Address
                      </Label>
                      <Col sm="9">
                        <Input type="textarea" rows="3" />
                        <Col sm="9" className="mt-1">
                          <Input type="checkbox" id="check1" />
                          <Label check className="form-label" htmlFor="check1">
                            &nbsp; Use as residential address
                          </Label>
                        </Col>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Recidential Address
                      </Label>
                      <Col sm="9">
                        <Input type="textarea" rows="3" />
                      </Col>
                    </Row>
                  </FormGroup>
                  <div className="d-flex justify-content-end button-group mt-4">
                    <Button
                      color="secondary"
                      outline
                      size="sm"
                      onClick={() => setIsIdentityEdit(false)}
                    >
                      Cancel
                    </Button>
                    <Button color="primary" size="sm">
                      Request change data
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="">
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        ID Type
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>KTP</span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        ID Number
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>1110202020202020</span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Postal Code
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>234765</span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Citizen ID Address
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>First address</span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3" className="text-muted">
                        Recidential Address
                      </Label>
                      <Col sm="9" className="d-flex align-items-center">
                        <span>Second address</span>
                      </Col>
                    </Row>
                  </FormGroup>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </TabPane>
      <TabPane tabId="3">
        <Row>
          <Col sm="12">
            <div className="p-4">
              <div className="d-flex justify-content-between mb-0">
                <div className="d-flex flex-column mb-n2">
                  <h4 className="font-medium mb-n1">Family</h4>
                </div>
              </div>
              <hr />
            </div>
          </Col>
        </Row>
      </TabPane>
      <TabPane tabId="4">
        <Row>
          <Col sm="12">
            <div className="p-4">
              <Form>
                <FormGroup>
                  <Label>Password</Label>
                  <Input type="password" placeholder="Password" />
                </FormGroup>
                <FormGroup>
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Confirm Password" />
                </FormGroup>
                <Button color="primary">Change Password</Button>
              </Form>
            </div>
          </Col>
        </Row>
      </TabPane>
    </TabContent>
  );
};

ProfileTabContent.propTypes = {
  activeTab: PropTypes.string,
};

export default ProfileTabContent;
