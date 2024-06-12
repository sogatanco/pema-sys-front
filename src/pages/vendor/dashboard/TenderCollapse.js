/* eslint-disable react/no-this-in-sfc */
import React, { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Collapse,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Form,
  Badge,
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
import CheckDocument from './CheckDocument';

const API_URL = process.env.REACT_APP_BASEURL;

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
  const [modal4, setModal4] = useState(false);
  const [modal5, setModal5] = useState(false);
  const [modal6, setModal6] = useState(false);
  const [modal7, setModal7] = useState(false);
  const [updateStatusValues, setUpdateStatusValues] = useState();
  const [updateStatusFile, setUpdateStatusFile] = useState();
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [selectedCompanyData, setSelectedCompanyData] = useState(undefined);
  const [selectedNote, setSelectedNote] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

  const api = useAxios();

  const toggle2 = () => {
    setModal2(!modal2);
  };

  const toggle3 = () => {
    setModal3(!modal3);
  };

  const toggle6 = () => {
    setModal6(!modal6);
  };

  const deleteConfirmation = (id) => {
    setModal4(!modal4);
    setSelectedTender(id);
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
      tender.sistem_kualifikasi === 'pra kualifikasi' ? secondPhaseFiltered : submitFiltered,
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
        file: base64,
        key,
      })
      .then(() => {
        alert('success', 'Berita Acara Penetapan Berhasil didupload');
        action();
        fetch();
      })
      .catch(() => alert('error', 'Something went wrong'));
    setBaKey();
    setIsUploadingBa(false);
  };

  const handleStatusChange = (e) => {
    setUpdateStatusValues((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setUpdateStatusFile((prev) => ({
      ...prev,
      [e.target.id]: e.target.files[0],
    }));
  };

  const showNote = () => {
    setModal7(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setIsStatusUpdating(true);

    const values = {
      status_tender: updateStatusValues?.status_tender,
      file_document: updateStatusFile?.status_dokumen,
    };

    await api
      .post(`dapi/vendor/tender/status-update/${tender.id_tender}`, values, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        action();
        setModal5(false);
        setIsStatusUpdating(false);
        alert('success', 'Tender status updated successfully');
      })
      .catch(() => {
        setModal5(false);
        setIsStatusUpdating(false);
        alert('error', 'Action failed.');
      });
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
                        <td className="fw-bold">{tender.lokasi}</td>
                      </tr>
                      <tr>
                        <td>Waktu Pendaftaran</td>
                        <td>:</td>
                        <td className="fw-bold">
                          {tender.tgl_pendaftaran} s/d {tender.batas_pendaftaran}
                        </td>
                      </tr>
                      <tr>
                        <td>Jenis Pengadaan</td>
                        <td>:</td>
                        <td className="fw-bold" style={{ textTransform: 'capitalize' }}>
                          {tender.jenis_pengadaan}
                        </td>
                      </tr>
                      <tr>
                        <td>HPS</td>
                        <td>:</td>
                        <td className="fw-bold">{rupiah(tender.hps)}</td>
                      </tr>
                      <tr>
                        <td>Nomor KBLI</td>
                        <td>:</td>
                        <td className="fw-bold">
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
                        <td className="fw-bold" style={{ textTransform: 'capitalize' }}>
                          {tender.sistem_kualifikasi}
                        </td>
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
                                  {((tender.owner === 'umum' &&
                                    p.detail.status_verifikasi_umum !== 'terverifikasi') ||
                                    (tender.owner === 'scm' &&
                                      p.detail.status_verifikasi_scm !== 'terverifikasi')) && (
                                    <Link
                                      to={`/vendor/requests/check/${p.perusahaan_id}`}
                                      target="blank"
                                    >
                                      <Badge className="bg-light-danger text-danger" outline>
                                        Need Approval
                                      </Badge>
                                    </Link>
                                  )}
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
                      {(tender.sistem_kualifikasi === null ||
                        tender.sistem_kualifikasi === 'pasca kualifikasi') && (
                        <>
                          <thead>
                            <tr>
                              <th>Perusahaan Yang Input Dokumen</th>
                              <th>Aksi</th>
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
                                    <Link
                                      onClick={() => {
                                        setModal6(true);
                                        setSelectedCompanyName(
                                          `${p.detail.bentuk_usaha} ${p.detail.nama_perusahaan}`,
                                        );
                                        setSelectedCompanyData(p);
                                        setSelectedStage('');
                                      }}
                                      style={{
                                        textDecoration: 'none',
                                      }}
                                    >
                                      Cek Dokumen
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="2">No data.</td>
                              </tr>
                            )}
                          </tbody>
                        </>
                      )}
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
                              <Fragment key={p.id_peserta}>
                                <tr key={p.id_peserta}>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <span>{i + 1}.</span>
                                      {p.detail.bentuk_usaha} {p.detail.nama_perusahaan}
                                    </div>
                                  </td>
                                  <td>
                                    <Link
                                      onClick={() => {
                                        setModal6(true);
                                        setSelectedCompanyName(
                                          `${p.detail.bentuk_usaha} ${p.detail.nama_perusahaan}`,
                                        );
                                        setSelectedCompanyData(p);
                                        setSelectedStage('Tahap I');
                                      }}
                                      style={{
                                        textDecoration: 'none',
                                      }}
                                    >
                                      Cek Dokumen
                                    </Link>
                                  </td>
                                </tr>
                              </Fragment>
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
                              <Fragment key={p.id_peserta}>
                                <tr key={p.id_peserta}>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <span>{i + 1}.</span>
                                      {p.detail.bentuk_usaha} {p.detail.nama_perusahaan}
                                    </div>
                                  </td>
                                  <td>
                                    <Link
                                      onClick={() => {
                                        setModal6(true);
                                        setSelectedCompanyName(
                                          `${p.detail.bentuk_usaha} ${p.detail.nama_perusahaan}`,
                                        );
                                        setSelectedCompanyData(p);
                                        setSelectedStage('Tahap II');
                                      }}
                                      style={{
                                        textDecoration: 'none',
                                      }}
                                    >
                                      Cek Dokumen
                                    </Link>
                                  </td>
                                </tr>
                                {i + 1 === submittedList?.length && (
                                  <>
                                    <tr>
                                      <th>Status</th>
                                      <th className="fw-bold">Berita Acara</th>
                                    </tr>
                                    {tender?.upload_ba_seleksi !== null ? (
                                      <tr>
                                        <td>
                                          {tender?.status_approval === 'submit_tahap_2' ? (
                                            <Badge color="warning">Under Review</Badge>
                                          ) : tender?.status_approval === 'revisi_tahap_2' ? (
                                            <Badge color="danger">
                                              <button
                                                type="button"
                                                style={{
                                                  background: 'none',
                                                  border: 'none',
                                                  color: 'white',
                                                }}
                                                onClick={() => {
                                                  showNote();
                                                  setSelectedNote(tender.catatan);
                                                }}
                                              >
                                                Revisi
                                              </button>
                                            </Badge>
                                          ) : (
                                            <Badge color="success">Approved</Badge>
                                          )}
                                        </td>
                                        <td>
                                          {tender?.upload_ba_seleksi !== null ? (
                                            <>
                                              {tender?.status_approval === 'submit_pemenang' ||
                                              tender?.status_approval === 'submit_tahap_2' ? (
                                                <Link
                                                  to={`${API_URL}vendor_file/${tender.upload_ba_seleksi}`}
                                                  target="blank"
                                                >
                                                  Download
                                                </Link>
                                              ) : tender?.status_approval === 'revisi_tahap_2' ? (
                                                isUploadingBa && baKey === 'upload_ba_seleksi' ? (
                                                  'Uploding..'
                                                ) : (
                                                  <>
                                                    <Label
                                                      htmlFor={`uploadBa${tender.id_tender}`}
                                                      className="btn btn-outline-info btn-sm outline"
                                                    >
                                                      Upload
                                                    </Label>
                                                    <Input
                                                      hidden
                                                      id={`uploadBa${tender.id_tender}`}
                                                      type="file"
                                                      onChange={(e) => {
                                                        uploadBa(
                                                          e.target.files[0],
                                                          'upload_ba_seleksi',
                                                        );
                                                      }}
                                                    ></Input>
                                                  </>
                                                )
                                              ) : (
                                                <Link
                                                  to={`${API_URL}vendor_file/${tender.upload_ba_seleksi}`}
                                                  target="blank"
                                                >
                                                  Download
                                                </Link>
                                              )}
                                            </>
                                          ) : (
                                            <td>
                                              {isUploadingBa && baKey === 'upload_ba_seleksi' ? (
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
                                                      uploadBa(
                                                        e.target.files[0],
                                                        'upload_ba_seleksi',
                                                      );
                                                    }}
                                                  ></Input>
                                                </>
                                              )}
                                            </td>
                                          )}
                                        </td>
                                      </tr>
                                    ) : (
                                      <>
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
                                      </>
                                    )}
                                  </>
                                )}
                              </Fragment>
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
                            {phaseTwoCandidate?.length === 0 ? (
                              <div className="text-center">
                                Belum ada perusahaan yang submit dokumen.
                              </div>
                            ) : (
                              <Select
                                closeMenuOnSelect
                                options={phaseTwoCandidate}
                                onChange={(choice) => setPhaseTwoSelected(choice)}
                                isMulti
                              />
                            )}
                          </ModalBody>
                          <ModalFooter>
                            {phaseTwoCandidate?.length === 0 ? (
                              <Button
                                color="secondary"
                                size="sm"
                                outline
                                onClick={toggle2.bind(null)}
                              >
                                Tutup
                              </Button>
                            ) : (
                              <>
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
                              </>
                            )}
                          </ModalFooter>
                        </Modal>
                      </>
                    )}
                    <thead>
                      <tr>
                        <th>Penetapan Pemenang</th>
                        <th>Status</th>
                        <th>Berita Acara</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pemenang?.length > 0 ? (
                        <>
                          <tr>
                            <td>
                              {pemenang[0].detail.bentuk_usaha} {pemenang[0].detail.nama_perusahaan}
                            </td>
                            <td>
                              {tender?.status_approval === 'submit_pemenang' ? (
                                <Badge color="warning">Under Review</Badge>
                              ) : tender?.status_approval === 'revisi_pemenang' ? (
                                <Badge color="danger">
                                  <button
                                    type="button"
                                    style={{ background: 'none', border: 'none', color: 'white' }}
                                    onClick={() => {
                                      showNote();
                                      setSelectedNote(tender.catatan);
                                    }}
                                  >
                                    Revisi
                                  </button>
                                </Badge>
                              ) : tender?.status_approval === 'approved_pemenang' ? (
                                <Badge color="success">Approved</Badge>
                              ) : (
                                '-'
                              )}
                            </td>
                            {tender?.upload_ba_pemenang !== null ? (
                              <td>
                                {tender?.status_approval === 'submit_pemenang' ||
                                tender?.status_approval === 'submit_tahap_2' ? (
                                  <Link
                                    to={`${API_URL}vendor_file/${tender.upload_ba_pemenang}`}
                                    target="blank"
                                  >
                                    Download
                                  </Link>
                                ) : tender?.status_approval === 'revisi_pemenang' ||
                                  tender?.status_approval === 'revisi_tahap_2' ? (
                                  isUploadingBa && baKey === 'upload_ba_pemenang' ? (
                                    'Uploding..'
                                  ) : (
                                    <>
                                      <Label
                                        htmlFor={`uploadBa${tender.id_tender}`}
                                        className="btn btn-outline-info btn-sm outline"
                                      >
                                        Upload
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
                                  )
                                ) : (
                                  <Link
                                    to={`${API_URL}vendor_file/${tender.upload_ba_pemenang}`}
                                    target="blank"
                                  >
                                    Download
                                  </Link>
                                )}
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
                                Pilih Pemenang
                              </Button>
                            </td>
                            <td> - </td>
                            <td>
                              <div>
                                <Button type="button" size="sm" color="info" outline disabled>
                                  Upload Penetapan
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                    <Modal isOpen={modal3} toggle={toggle3.bind(null)} centered size="lg">
                      <ModalHeader toggle={toggle3.bind(null)}>Pilih Pemenang</ModalHeader>
                      <ModalBody>
                        {winningCandidate?.length === 0 ? (
                          <div className="text-center">Belum ada list kandidat pemenang.</div>
                        ) : (
                          <Select
                            closeMenuOnSelect
                            options={winningCandidate}
                            onChange={(choice) => setWinnerSelected(choice)}
                          />
                        )}
                      </ModalBody>
                      <ModalFooter>
                        {submittedList?.length === 0 ? (
                          <Button color="secondary" size="sm" outline onClick={toggle3.bind(null)}>
                            Tutup
                          </Button>
                        ) : (
                          <>
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
                          </>
                        )}
                      </ModalFooter>
                    </Modal>
                  </table>
                </Col>
              </Row>
              <div className="d-flex justify-content-end bg-light-secondary rounded-3 p-2 mt-4">
                <div className="d-flex gap-3 ">
                  <abbr title="Edit Status">
                    <Button
                      type="button"
                      size="sm"
                      color="primary"
                      outline
                      onClick={() => setModal5(true)}
                    >
                      Edit Status
                    </Button>
                  </abbr>
                  <abbr title="Hapus Tender">
                    <Button
                      type="button"
                      size="sm"
                      color="danger"
                      outline
                      onClick={() => {
                        // handleDelete(tender.id_tender);
                        deleteConfirmation(tender.id_tender);
                      }}
                    >
                      {isDeleting && selectedTender === tender.id_tender ? (
                        'Deleting..'
                      ) : (
                        <MaterialIcon icon="delete" style={{ fontSize: '14px' }} />
                      )}
                    </Button>
                  </abbr>
                </div>
              </div>
              {/* delete confirmation modal */}
              <Modal isOpen={modal4} centered>
                <ModalHeader>Konfirmasi</ModalHeader>
                <ModalBody>
                  <div className="d-flex flex-row gap-2">
                    Apakah Anda yakin akan menghapus data pengadaan ini?
                  </div>
                </ModalBody>
                <ModalFooter>
                  {isDeleting ? (
                    <Button type="button" color="success" disabled>
                      <div className="d-flex align-items-center gap-2">
                        <Spinner size="sm" />
                        Deleting..
                      </div>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      color="danger"
                      onClick={() => handleDelete(tender.id_tender)}
                      disabled={isDeleting}
                      size="sm"
                    >
                      Ya
                    </Button>
                  )}
                  <Button color="secondary" size="sm" outline onClick={() => setModal4(false)}>
                    Batal
                  </Button>
                </ModalFooter>
              </Modal>
              {/* delete confirmation modal */}

              {/* note modal */}
              <Modal isOpen={modal7} centered fade={false}>
                <ModalHeader>Catatan Revisi</ModalHeader>
                <ModalBody>
                  <p>{selectedNote}</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" size="sm" outline onClick={() => setModal7(false)}>
                    Tutup
                  </Button>
                </ModalFooter>
              </Modal>
              {/* note modal */}

              {/* edit status modal */}
              <Modal isOpen={modal5} centered>
                <ModalHeader>Status Tender</ModalHeader>
                <Form onSubmit={handleStatusSubmit}>
                  <ModalBody>
                    <FormGroup>
                      <Label for="status_tender">Status</Label>
                      <Input
                        type="select"
                        id="status_tender"
                        name="status_tender"
                        onChange={(e) => handleStatusChange(e)}
                        defaultValue={tender?.status_tender}
                      >
                        <option value="buka">Buka</option>
                        <option value="tutup">Tutup</option>
                        <option value="batal">Batal</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="status_dokumen">Upload Dokumen</Label>
                      <Input
                        type="file"
                        id="status_dokumen"
                        name="status_dokumen"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e)}
                      />
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">File format .pdf (max. 10mb)</small>
                        <small className="text-muted">
                          <i>Opsional</i>
                        </small>
                      </div>
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button type="submit" color="primary" size="sm" disabled={isStatusUpdating}>
                      {isStatusUpdating ? 'Menyimpan..' : 'Submit'}
                    </Button>
                    <Button color="secondary" size="sm" outline onClick={() => setModal5(false)}>
                      Batal
                    </Button>
                  </ModalFooter>
                </Form>
              </Modal>
              {/* edit status modal */}

              {/* check document modal */}
              <CheckDocument
                {...{
                  modal6,
                  toggle6,
                  tender,
                  selectedCompanyName,
                  selectedCompanyData,
                  selectedStage,
                }}
              />
              {/* check document modal */}
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
