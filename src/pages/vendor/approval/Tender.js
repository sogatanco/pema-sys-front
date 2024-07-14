import { useQuery } from '@tanstack/react-query';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Form,
  Card,
  CardBody,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from 'reactstrap';
import useAxios from '../../../hooks/useAxios';
import { alert } from '../../../components/atoms/Toast';

const API_URL = process.env.REACT_APP_BASEURL;

const Tender = () => {
  const api = useAxios();
  const [isApproving, setIsApproving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [selectedId, setSelectedId] = useState(undefined);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [revisiNote, setRevisiNote] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['approval-tender'],
    queryFn: () =>
      api.get(`dapi/vendor/tender/approval/ba`).then((res) => {
        return res.data.data;
      }),
  });

  const toggle = () => {
    setModal(!modal);
  };

  const toggle2 = () => {
    setModal2(!modal2);
  };

  const approveConfirmation = (id) => {
    setModal(true);
    setSelectedId(id);
  };

  const revisiConfirmation = (id) => {
    setModal2(true);
    setSelectedId(id);
  };

  const handleApprove = async () => {
    setIsApproving(true);

    await api
      .post(`dapi/vendor/tender/approval-ba/ba/${selectedId}`, {
        status_approval: approvalStatus,
      })
      .then(() => {
        alert('success', 'Tender Berhasil diapprove');
        setIsApproving(false);
        setModal(false);
        refetch();
      })
      .catch(() => {
        alert('error', 'Something went wrong');
        setIsApproving(false);
        setModal(false);
      });
  };

  const handleRevisi = async (e) => {
    e.preventDefault();
    setIsSending(true);

    await api
      .post(`dapi/vendor/tender/approval-ba/ba/${selectedId}`, {
        status_approval: approvalStatus,
        catatan: revisiNote,
      })
      .then(() => {
        alert('success', 'Revisi bershasil dikirim');
        setIsSending(false);
        refetch();
        setModal2(false);
      })
      .catch(() => {
        alert('error', 'Something went wrong');
        setIsSending(false);
        setModal2(false);
      });
  };

  return isLoading ? (
    <Card className="rounded-3">
      <CardBody>
        <div className="d-flec text-center">
          <span>Loading..</span>
        </div>
      </CardBody>
    </Card>
  ) : data?.length > 0 ? (
    data.map((t, i) => (
      <Fragment key={t.id_tender}>
        <Card className="rounded-3" key={t.id_tender}>
          <CardBody>
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between">
                <div className="d-flex flex-column">
                  <span>
                    Approval{' '}
                    {t.status_approval === 'submit_pemenang' ? 'Pemenang' : 'Peserta Tahap II'}
                    Tender
                  </span>
                  <div className="d-flex flex-column mt-2">
                    <h4 className="fw-bold">{t.nama_tender}</h4>
                    <small style={{ textTransform: 'capitalize', marginTop: '-10px' }}>
                      {t.sistem_kualifikasi}
                    </small>
                  </div>
                </div>
                <div>
                  <Badge color="primary"># {i + 1}</Badge>
                </div>
              </div>
              <Table bordered className="mt-3">
                <thead>
                  <tr>
                    <th colSpan="2">Peserta Tender</th>
                  </tr>
                </thead>
                <tbody>
                  {t.peserta.map((p, idx) => (
                    <tr key={p.nama_perusahaan}>
                      <td width="40">{idx + 1}</td>
                      <td>
                        {p.bentuk_usaha} {p.nama_perusahaan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {t.status_approval === 'submit_tahap_2' && (
                <Table bordered className="mt-3">
                  <thead>
                    <tr>
                      <th colSpan="2">Peserta Tahap II</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.lulus_tahap_1.map((lt1, idx3) => (
                      <tr key={lt1.nama_perusahaan}>
                        <td width="40">{idx3 + 1}</td>
                        <td>
                          {lt1.bentuk_usaha} {lt1.nama_perusahaan}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="2" style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        <Link to={`${API_URL}vendor_file/${t.upload_ba_seleksi}`} target="blank">
                          <Button color="secondary" outline size="sm">
                            Download Berita Acara
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}

              {t.status_approval === 'submit_pemenang' && (
                <>
                  {t.sistem_kualifikasi === 'pra kualifikasi' && (
                    <Table bordered className="mt-3">
                      <thead>
                        <tr>
                          <th colSpan="2">Peserta Tahap II</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.lulus_tahap_1.map((t2, idx2) => (
                          <tr>
                            <td width="40">{idx2 + 1}</td>
                            <td>
                              {t2.bentuk_usaha} {t2.nama_perusahaan}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                  <Table hover bordered className="mt-3">
                    <thead>
                      <tr>
                        <th colSpan="2">Pemenang</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {t.pemenang[0].bentuk_usaha} {t.pemenang[0].nama_perusahaan}
                        </td>
                        <td className="text-center">
                          <Link to={`${API_URL}vendor_file/${t.upload_ba_pemenang}`} target="blank">
                            <Button color="secondary" outline size="sm">
                              Download Berita Acara
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              )}

              <div className="d-flex justify-content-end">
                <div className="d-flex gap-3">
                  <Button
                    color="warning"
                    outline
                    onClick={() => {
                      revisiConfirmation(t.id_tender);
                      setApprovalStatus(
                        t.status_approval === 'submit_pemenang'
                          ? 'revisi_pemenang'
                          : 'revisi_tahap_2',
                      );
                    }}
                  >
                    Revisi
                  </Button>
                  <Button
                    color="success"
                    onClick={() => {
                      approveConfirmation(t.id_tender);
                      setApprovalStatus(
                        t.status_approval === 'submit_pemenang'
                          ? 'approved_pemenang'
                          : 'approved_tahap_2',
                      );
                    }}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Modal Approve */}
        <Modal isOpen={modal} toggle={toggle.bind(null)} centered>
          <ModalHeader toggle={toggle.bind(null)}>Konfirmasi</ModalHeader>
          <ModalBody>
            <div className="d-flex justify-content-center">
              <span> Apakah anda yakin ingin menyetujui Berita Acara ini ?</span>
            </div>
          </ModalBody>
          <ModalFooter>
            {isApproving ? (
              <Button type="button" color="primary" disabled>
                <div className="d-flex align-items-center gap-2">
                  <Spinner size="sm" />
                  Menyimpan..
                </div>
              </Button>
            ) : (
              <Button type="button" color="success" onClick={handleApprove}>
                Ya
              </Button>
            )}
            <Button color="secondary" onClick={toggle.bind(null)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Approve */}

        {/* Modal Revisi */}
        <Modal isOpen={modal2} toggle={toggle2.bind(null)} centered>
          <ModalHeader toggle={toggle2.bind(null)}>Revisi</ModalHeader>
          <Form onSubmit={(e) => handleRevisi(e)}>
            <ModalBody>
              <FormGroup>
                <Label htmlFor="note">Catatan</Label>
                <Input
                  type="textarea"
                  name="note"
                  cols="30"
                  rows="10"
                  placeholder="Masukkan catatan disini"
                  onChange={(e) => setRevisiNote(e.target.value)}
                  required
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              {isSending ? (
                <Button type="button" color="warning" disabled>
                  <div className="d-flex align-items-center gap-2">
                    <Spinner size="sm" />
                    Mengirim..
                  </div>
                </Button>
              ) : (
                <Button type="submit" color="warning">
                  Kirim
                </Button>
              )}
              <Button color="secondary" onClick={toggle2.bind(null)}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
        {/* Modal Revisi */}
      </Fragment>
    ))
  ) : (
    <Card className="rounded-3">
      <CardBody>
        <div className="d-flec text-center">
          <span>Tidak ada permintaan approval.</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default Tender;
