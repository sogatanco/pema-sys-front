import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, Col } from 'reactstrap';
import FormTender from './FormTender';

const NewTender = () => {
  const [tenderUmum, setTenderUmum] = useState(true);
  const [pascaKualifikasi, setPaskaKualifikasi] = useState(true);

  return (
    <Col lg="12">
      <Card className="">
        <CardBody className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-between">
            <CardTitle tag="h4">New Tender</CardTitle>
            <Link to="projects" style={{ textDecoration: 'none' }}></Link>
          </div>
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-3">
              <Button
                type="button"
                color={`${tenderUmum ? 'dark' : 'light'}`}
                onClick={() => setTenderUmum(true)}
              >
                Tender Umum
              </Button>
              <Button
                type="button"
                color={`${tenderUmum ? 'light' : 'dark'}`}
                onClick={() => setTenderUmum(false)}
              >
                Penunjukkan Langsung
              </Button>
            </div>
            {tenderUmum && (
              <div className="d-flex gap-3">
                <Button
                  type="button"
                  color={`${pascaKualifikasi ? 'dark' : 'light'}`}
                  onClick={() => setPaskaKualifikasi(true)}
                >
                  Pasca Kualifikasi
                </Button>
                <Button
                  type="button"
                  color={`${pascaKualifikasi ? 'light' : 'dark'}`}
                  onClick={() => setPaskaKualifikasi(false)}
                >
                  Pra Kualifikasi
                </Button>
              </div>
            )}
          </div>
          <FormTender {...{ tenderUmum, pascaKualifikasi }} />
        </CardBody>
      </Card>
    </Col>
  );
};

export default NewTender;
