import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import './vendor.scss';

const CompanyDetail = () => {
  return (
    <>
      <Card>
        <CardBody>
          <Row>
            <Col xs="3" sm="2">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToaZtge7ZVUPW0GSC1p0crmEHWpJFzZotUCdEULMFca_ok6uQJbWv6hzrERPSRqK9uBOc&usqp=CAU"
                className="img-rounded img-fluid"
                alt="..."
              />
            </Col>
            <Col xs="9" sm="10" className="centerText">
              <h3>PT Pembangunan Aceh</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Row>
            <Col sm="3">
              <p>
                <strong>Address</strong>
                <br />
                Jl. T Iskandar Muda, Lam Ujong Meunasah Intan Banda Aceh
              </p>
            </Col>
            <Col sm="3">
              <p>
                <strong>Email :</strong>
                <br />
                contact@ptpema.co.id
              </p>
            </Col>
            <Col sm="3">
              <p>
                <strong>Phone Number :</strong>
                <br />
                082285658594
              </p>
            </Col>
            <Col sm="3">
              <p>
                <strong>Type Of Business</strong>
                <br />
                Trade and Industry
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};
export default CompanyDetail;
