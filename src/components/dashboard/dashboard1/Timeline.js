import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
} from 'reactstrap';
import './Timeline.scss';

import img1 from '../../../assets/images/users/user1.jpg';
import img2 from '../../../assets/images/users/user2.jpg';
import img3 from '../../../assets/images/users/user3.jpg';
import img4 from '../../../assets/images/users/user4.jpg';

import time1 from '../../../assets/images/bg/bg1.jpg';
import time2 from '../../../assets/images/bg/bg2.jpg';
import time3 from '../../../assets/images/bg/bg3.jpg';
import time4 from '../../../assets/images/bg/bg4.jpg';

const Timeline = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [isBInfoEdit, setIsBInfoEdit] = useState(false);
  const [isIdentityEdit, setIsIdentityEdit] = useState(false);

  // const isBasicDataEdit = false;

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <Card>
        <Nav tabs className="profile-tab">
          <NavItem>
            <NavLink
              className={activeTab === '1' ? 'active bg-transparent' : 'cursor-pointer text-muted'}
              onClick={() => {
                toggle('1');
              }}
            >
              Activity
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === '2' ? 'active bg-transparent' : 'cursor-pointer text-muted'}
              onClick={() => {
                toggle('2');
              }}
            >
              Personal
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === '3' ? 'active bg-transparent' : 'cursor-pointer text-muted'}
              onClick={() => {
                toggle('3');
              }}
            >
              Family
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === '4' ? 'active bg-transparent' : 'cursor-pointer text-muted'}
              onClick={() => {
                toggle('4');
              }}
            >
              Account
            </NavLink>
          </NavItem>
        </Nav>
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
                            odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
                            quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
                            mauris. Fusce nec tellus sed augue semper
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
                    <Form>
                      <FormGroup>
                        <Row>
                          <Label sm="3" className="text-muted">
                            Firstname
                          </Label>
                          <Col sm="9">
                            <Input type="text" placeholder="Shaina" />
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Label sm="3" className="text-muted">
                            Lastname
                          </Label>
                          <Col sm="9">
                            <Input type="text" placeholder="Agrawal" />
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Label sm="3" className="text-muted">
                            Email
                          </Label>
                          <Col sm="9">
                            <Input type="email" placeholder="Jognsmith@cool.com" />
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
                                <Input id="male" type="radio" name="customcheck1" />
                                <Label check htmlFor="male">
                                  Male
                                </Label>
                              </FormGroup>
                              <FormGroup check inline>
                                <Input id="female" type="radio" name="customcheck1" />
                                <Label check htmlFor="female">
                                  Female
                                </Label>
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
                            <Input type="select" name="Select Category">
                              <option>Islam</option>
                              <option>Kristen Protestas</option>
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
                            <Input type="date" placeholder="DOB Here" />
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Label sm="3" className="text-muted">
                            Birthday Place
                          </Label>
                          <Col sm="9">
                            <Input type="text" placeholder="Amazon" />
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Label sm="3" className="text-muted">
                            Marital Status
                          </Label>
                          <Col sm="9">
                            <Input type="select" name="Select Category">
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
                            Firstname
                          </Label>
                          <Col sm="9" className="d-flex align-items-center">
                            <span>Shaina</span>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Label sm="3" className="text-muted">
                            Lastname
                          </Label>
                          <Col sm="9" className="d-flex align-items-center">
                            <span>Agrawal</span>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Label sm="3" className="text-muted">
                            Email
                          </Label>
                          <Col sm="9" className="d-flex align-items-center">
                            <span>Jognsmith@cool.com</span>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Label sm="3" className="text-muted">
                            Gender
                          </Label>
                          <Col sm="9" className="d-flex align-items-center">
                            <span>Male</span>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Label sm="3" className="text-muted">
                            Religion
                          </Label>
                          <Col sm="9" className="d-flex align-items-center">
                            <span>Islam</span>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Label sm="3" className="text-muted">
                            Date of Birth
                          </Label>
                          <Col sm="9" className="d-flex align-items-center">
                            <span>21 Jul 1994</span>
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
                            <span>Amazon</span>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Label sm="3" className="text-muted">
                            Marital Status
                          </Label>
                          <Col sm="9" className="d-flex align-items-center">
                            <span>Merried</span>
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
      </Card>
    </>
  );
};

export default Timeline;
