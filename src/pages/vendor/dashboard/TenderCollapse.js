import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Collapse, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import formatDate from '../../../utils/formatDate';

const TenderCollapse = ({ tender }) => {
  const [registeredList, setRegisteredList] = useState([]);
  const [submittedList, setSubmittedList] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const api = useAxios();

  const toggle = () => setCollapse(!collapse);

  const fetch = async () => {
    setIsLoading(true);
    await api.get(`dapi/vendor/tender/${tender}`).then((res) => {
      setRegisteredList(res.data.data.perusahaan_yang_ikut);
    });
    setIsLoading(false);
  };

  const handleToggle = async () => {
    setCollapse(true);
    fetch();
  };

  useEffect(() => {
    const submitFiltered = registeredList?.filter((per) => {
      return per.status === 'submit_dokumen';
    });

    setSubmittedList(submitFiltered);
  }, [registeredList]);

  return (
    <Col title="Collapse">
      {collapse ? (
        <Button
          color="primary"
          size="sm"
          onClick={toggle.bind(null)}
          style={{ marginBottom: '1rem' }}
        >
          Close
        </Button>
      ) : (
        <Button color="primary" size="sm" onClick={handleToggle} style={{ marginBottom: '1rem' }}>
          Details
        </Button>
      )}
      <Collapse isOpen={collapse}>
        <Card className="border rounded-3">
          {isLoading ? (
            <div className="d-flex justify-content-center py-5">Loading..</div>
          ) : (
            <CardBody>
              <Col>
                <Table hover>
                  <thead>
                    <tr>
                      <th>Perusahaan Yang Mendaftar</th>
                      <th>Tanggal Mendaftar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredList?.length > 0 ? (
                      registeredList?.map((p, i) => (
                        <tr key={p.id_peserta}>
                          <td>
                            <div className="d-flex gap-2">
                              <span>{i + 1}.</span>
                              {p.detail.bentuk_usaha} {p.detail.nama_perusahaan}
                            </div>
                          </td>
                          <td>{formatDate(p.detail.created_at)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No data.</td>
                      </tr>
                    )}
                  </tbody>
                  <thead>
                    <tr>
                      <th>Perusahaan Yang Input Dokumen</th>
                      <th>Dokumen Penawaran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedList?.length > 0 ? (
                      submittedList?.map((p, i) => (
                        <tr key={p.id_peserta}>
                          <td>
                            <div className="d-flex gap-2">
                              <span>{i + 1}.</span>
                              {p.detail.bentuk_usaha} {p.detail.nama_perusahaan}
                            </div>
                          </td>
                          <td>
                            <Link to="">Download</Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No data.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
            </CardBody>
          )}
        </Card>
      </Collapse>
    </Col>
  );
};

TenderCollapse.propTypes = {
  tender: PropTypes.number,
};

export default TenderCollapse;
