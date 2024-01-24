import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Collapse,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import MaterialIcon from '@material/react-material-icon';
import useAxios from '../../../hooks/useAxios';
import formatDate from '../../../utils/formatDate';
import rupiah from '../../../utils/rupiah';
import { alert } from '../../../components/atoms/Toast';
import getBase64 from '../../../utils/generateFile';

const TenderCollapse = ({ tender, action }) => {
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredList, setRegisteredList] = useState([]);
  const [submittedList, setSubmittedList] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTender, setSelectedTender] = useState();
  const [secondPhaseList, setSecondPhaseList] = useState([]);
  const [phaseTwoSelected, setPhaseTwoSelected] = useState([]);
  const [phaseTwoCandidate, setPhaseTwoCandidate] = useState();
  const [submittingPhaseTwo, setSubmittingPhaseTwo] = useState(false);
  const [winningCandidate, setWinningCandidat] = useState([]);
  const [winnerSelected, setWinnerSelected] = useState();
  const [submittingTheWinner, setSubmittingTheWinner] = useState(false);
  const [pemenang, setPemenang] = useState();
  const [isUploadingBa, setIsUploadingBa] = useState(false);
  const [baKey, setBaKey] = useState();

  const api = useAxios();

  const toggle2 = () => {
    setModal2(!modal2);
  };

  const toggle3 = () => {
    setModal3(!modal3);
  };

  const toggle = () => setCollapse(!collapse);

  const fetch = async () => {
    setIsLoading(true);
    await api
      .get(`dapi/vendor/tender/${tender.id_tender}`)
      .then((res) => {
        setRegisteredList(res.data.data.perusahaan_yang_ikut);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  useEffect(() => {
    const submitFiltered = registeredList?.filter((per) => {
      return per.status !== 'register';
    });

    const secondPhaseFiltered = registeredList?.filter((pt) => {
      return pt.status === 'lulus_tahap_1' || pt.status === 'pemenang';
    });

    const pemenangSet = registeredList?.filter((pt) => {
      return pt.status === 'pemenang';
    });

    setSubmittedList(submitFiltered);
    setSecondPhaseList(secondPhaseFiltered);

    setPhaseTwoCandidate(submitFiltered);
    setWinningCandidat(
      tender.sistem_kualifikasi === 'pasca kualifikasi' ? submitFiltered : secondPhaseFiltered,
    );
    setPemenang(pemenangSet);
  }, [registeredList]);

  const handleToggle = async () => {
    setCollapse(true);
    fetch();
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    await api
      .post(`dapi/vendor/tender/delete/${id}`)
      .then(() => {
        alert('success', 'Tender berhasil dihapus');
        action();
      })
      .catch(() => alert('error', 'Something went wrong'));
    setIsDeleting(false);
  };

  const submitPesertTahapII = async () => {
    setSubmittingPhaseTwo(true);
    const masuk = [];
    phaseTwoSelected.map((m) => masuk.push(m.value));

    await api
      .post(`dapi/vendor/tender/tahapdua/${tender.id_tender}`, { list_peserta: masuk })
      .then(() => {
        fetch();
        alert('success', 'Peserta Tahap II berhasil dipilih');
      })
      .catch(() => {
        alert('error', 'Something went wrong');
      });
    setModal2(false);
    setSubmittingPhaseTwo(false);
  };

  const submitTheWinner = async () => {
    setSubmittingTheWinner(true);
    await api
      .post(`dapi/vendor/tender/pemenang/${tender.id_tender}`, {
        list_peserta: winnerSelected.value,
      })
      .then(() => {
        alert('success', 'Pemenang Tender telah ditetapkan');
        fetch();
      })
      .catch(() => alert('error', 'Something went wrong'));
    setModal3(false);
    setSubmittingTheWinner(false);
  };

  const uploadBa = async (file, key) => {
    setBaKey(key);
    setIsUploadingBa(true);

    const base64 = await getBase64(file)
      .then((res) => {
        return res.split(',')[1];
      })
      .catch((err) => console.log(err));

    await api
      .post(`dapi/vendor/tender/ba/${tender.id_tender}`, {
        base64,
        key,
      })
      .then(() => {
        alert('success', 'Berita Acara Penetapan Berhasil didupload');
        fetch();
      })
      .catch(() => alert('error', 'Something went wrong'));
    setBaKey();
    setIsUploadingBa(false);
  };

  return (
    <Col title="Collapse">
      {collapse ? (
        <Button
          type="button"
          color="primary"
          outline
          size="sm"
          onClick={toggle.bind(null)}
          style={{ marginBottom: '1rem' }}
        >
          Close
        </Button>
      ) : (
        <Button
          type="button"
          color="primary"
          outline
          size="sm"
          onClick={handleToggle}
          style={{ marginBottom: '1rem' }}
        >
          Details
        </Button>
      )}
      <Collapse isOpen={collapse}>
        <Card className="border rounded-3" style={{ fontSize: '14px' }}>
          {isLoading ? (
            <div className="d-flex justify-content-center py-4">Loading..</div>
          ) : (
            <CardBody>
              <Row>
                <Col md="6">
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td>Lokasi Pengerjaan</td>
                        <td>:</td>
                        <td>{tender.lokasi}</td>
                      </tr>
                      <tr>
                        <td>Waktu Pendaftaran</td>
                        <td>:</td>
                        <td>
                          {tender.tgl_pendaftaran} s/d {tender.batas_pendaftaran}
                        </td>
                      </tr>
                      <tr>
                        <td>Jenis Pengadaan</td>
                        <td>:</td>
                        <td>{tender.jenis_pengadaan}</td>
                      </tr>
                      <tr>
                        <td>HPS</td>
                        <td>:</td>
                        <td>{rupiah(tender.hps)}</td>
                      </tr>
                      <tr>
                        <td>Nomor KBLI</td>
                        <td>:</td>
                        <td>
                          <div className="d-flex gap 1">
                            {Array.isArray(JSON.parse(tender.kbli))
                              ? JSON.parse(tender.kbli).map((element, i) => {
                                  return (
                                    <span key={element}>
                                      {element}{' '}
                                      {i + 1 === JSON.parse(tender.kbli).length ? '' : '|'} &nbsp;
                                    </span>
                                  );
                                })
                              : 'null'}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Sistem Kualifikasi</td>
                        <td>:</td>
                        <td>{tender.sistem_kualifikasi}</td>
                      </tr>
                    </tbody>
                  </table>
                  <Col className="mt-3">
                    <table className="w-100">
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
                        <tr>
                          <td colSpan="2">&nbsp;</td>
                        </tr>
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
                    </table>
                  </Col>
                </Col>
                <Col md="6">
                  <table className="w-100">
                    {tender.sistem_kualifikasi === 'pra kualifikasi' && (
                      <>
                        <thead>
                          <tr>
                            <th>Tahap I</th>
                            <th>Dokumen Penawaran</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submittedList?.length > 0 ? (
                            submittedList?.map((p, i) => (
                              <>
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
                              </>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="2">No data.</td>
                            </tr>
                          )}
                          <tr>
                            <td colSpan="2">&nbsp;</td>
                          </tr>
                        </tbody>
                        <thead>
                          <tr>
                            <th>Tahap II</th>
                            <th>Dokumen Penawaran</th>
                          </tr>
                        </thead>
                        <tbody>
                          {secondPhaseList?.length > 0 ? (
                            secondPhaseList?.map((p, i) => (
                              <>
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
                                {i + 1 === submittedList?.length && (
                                  <tr>
                                    <td className="fw-bold">Berita Acara</td>
                                    {tender?.upload_ba_seleksi !== null ? (
                                      <td>
                                        <Link>Preview</Link>
                                      </td>
                                    ) : (
                                      <td>
                                        {isUploadingBa && baKey === 'upload_ba_seleksi' ? (
                                          'Uploding..'
                                        ) : (
                                          <>
                                            <Label
                                              htmlFor={`uploadBaSeleksi${tender.id_tender}`}
                                              className="btn btn-outline-info btn-sm outline"
                                            >
                                              Upload Berita Acara
                                            </Label>
                                            <Input
                                              hidden
                                              id={`uploadBaSeleksi${tender.id_tender}`}
                                              type="file"
                                              onChange={(e) => {
                                                uploadBa(e.target.files[0], 'upload_ba_seleksi');
                                              }}
                                            ></Input>
                                          </>
                                        )}
                                      </td>
                                    )}
                                  </tr>
                                )}
                              </>
                            ))
                          ) : (
                            <tr>
                              <td>
                                <Button
                                  type="button"
                                  size="sm"
                                  color="info"
                                  onClick={toggle2.bind(null)}
                                >
                                  Pilih Peserta
                                </Button>
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td colSpan="2">&nbsp;</td>
                          </tr>
                        </tbody>
                        <Modal isOpen={modal2} toggle={toggle2.bind(null)} centered size="lg">
                          <ModalHeader toggle={toggle2.bind(null)}>
                            Pilih Peserta Tahap II
                          </ModalHeader>
                          <ModalBody>
                            <Select
                              closeMenuOnSelect
                              options={phaseTwoCandidate}
                              onChange={(choice) => setPhaseTwoSelected(choice)}
                              isMulti
                            />
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              color="primary"
                              onClick={submitPesertTahapII}
                              disabled={submittingPhaseTwo}
                            >
                              {submittingPhaseTwo ? 'Menyimpan..' : 'Simpan'}
                            </Button>
                            <Button color="secondary" onClick={toggle2.bind(null)}>
                              Cancel
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </>
                    )}
                    <thead>
                      <tr>
                        <th>Penetapan Pemenang</th>
                        <th>Dokumen Penetapan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pemenang?.length > 0 ? (
                        <>
                          <tr>
                            <td>
                              {pemenang[0].detail.bentuk_usaha} {pemenang[0].detail.nama_perusahaan}
                            </td>
                            {tender?.upload_ba_pemenang !== null ? (
                              <td>
                                <Link>Preview</Link>
                              </td>
                            ) : (
                              <td>
                                {isUploadingBa && baKey === 'upload_ba_pemenang' ? (
                                  'Uploding..'
                                ) : (
                                  <>
                                    <Label
                                      htmlFor={`uploadBa${tender.id_tender}`}
                                      className="btn btn-outline-info btn-sm outline"
                                    >
                                      Upload Penetapan
                                    </Label>
                                    <Input
                                      hidden
                                      id={`uploadBa${tender.id_tender}`}
                                      type="file"
                                      onChange={(e) => {
                                        uploadBa(e.target.files[0], 'upload_ba_pemenang');
                                      }}
                                    ></Input>
                                  </>
                                )}
                              </td>
                            )}
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td>
                              <Button
                                type="button"
                                size="sm"
                                color="info"
                                onClick={toggle3.bind(null)}
                              >
                                Piih Pemenang
                              </Button>
                            </td>
                            <td>
                              <Button type="button" size="sm" color="info" outline disabled>
                                Upload Penetapan
                              </Button>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                    <Modal isOpen={modal3} toggle={toggle3.bind(null)} centered size="lg">
                      <ModalHeader toggle={toggle3.bind(null)}>Pilih Pemenang</ModalHeader>
                      <ModalBody>
                        <Select
                          closeMenuOnSelect
                          options={winningCandidate}
                          onChange={(choice) => setWinnerSelected(choice)}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="primary"
                          onClick={submitTheWinner}
                          disabled={submittingTheWinner}
                        >
                          {submittingTheWinner ? 'Menyimpan..' : 'Simpan'}
                        </Button>
                        <Button color="secondary" onClick={toggle3.bind(null)}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </table>
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <abbr title="Hapus Tender">
                  <Button
                    type="button"
                    size="sm"
                    color="danger"
                    outline
                    onClick={() => {
                      handleDelete(tender.id_tender);
                      setSelectedTender(tender.id_tender);
                    }}
                  >
                    {isDeleting && selectedTender === tender.id_tender ? (
                      'Deleting..'
                    ) : (
                      <MaterialIcon icon="delete" />
                    )}
                  </Button>
                </abbr>
              </div>
            </CardBody>
          )}
        </Card>
      </Collapse>
    </Col>
  );
};

TenderCollapse.propTypes = {
  tender: PropTypes.object,
  action: PropTypes.func,
};

export default TenderCollapse;
