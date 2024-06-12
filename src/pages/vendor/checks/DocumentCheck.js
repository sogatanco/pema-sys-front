import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import TabMui from '../../../components/tabmui/TabMui';
import TabGeneral from './TabGeneral';
import TabOfficial from './TabOfficial';
import TabDocument from './TabDocument';
import TabPortfolio from './TabPortfolio';
import TabBusinessField from './TabBusinessField';
import useAxios from '../../../hooks/useAxios';
import { alert } from '../../../components/atoms/Toast';

const tabItems = [
  {
    id: 1,
    title: 'Data Umum',
  },
  {
    id: 2,
    title: 'Data Jajaran/Komisaris',
  },
  {
    id: 3,
    title: 'Dokumen Perusahaan',
  },
  {
    id: 4,
    title: 'Portofolio',
  },
  {
    id: 5,
    title: 'Bidang Usaha',
  },
];

const DocumentCheck = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { id } = useParams();
  const [comment, setComment] = useState();
  const [isApproving, setIsApproving] = useState(false);
  const [selectedName, setSelectedName] = useState();
  const [modal, setModal] = useState(false);
  const [modal4, setModal4] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const api = useAxios();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['status-verifikasi'],
    queryFn: () =>
      api.get(`dapi/vendor/company-verify-status/${id}`).then((res) => {
        return res.data.data;
      }),
  });

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleRevisi = async () => {
    setIsApproving(true);
    await api
      .post(`dapi/vendor/verifikasi/${id}`, { status: 'revisi', komentar: comment })
      .then(() => {
        refetch();
        alert('success', `Informasi revisi telah dikirim`);
      })
      .catch(() => {
        alert('error', 'Gagal mengirim data');
      });
    setModal(false);
    setIsApproving(false);
  };

  const toggle4 = () => {
    setModal4(!modal4);
  };

  const handleConfirmation = (name) => {
    setModal4(true);
    setSelectedName(name);
  };

  const handleApprove = async () => {
    setIsApproving(true);
    await api
      .post(`dapi/vendor/verifikasi/${id}`, { status: 'terverifikasi' })
      .then(() => {
        refetch();
        alert('success', `Data Perusahaan ${selectedName} telah terverifikasi.`);
      })
      .catch(() => {
        alert('error', 'Gagal mengirim data');
      });
    setModal4(false);
    setIsApproving(false);
  };

  return (
    <>
      <TabMui items={tabItems} panels={tabItems} {...{ activeTab, setActiveTab }}>
        <>
          {activeTab === 1 && <TabGeneral companyId={id} {...{ setSelectedName }} />}
          {activeTab === 2 && <TabOfficial companyId={id} />}
          {activeTab === 3 && <TabDocument companyId={id} />}
          {activeTab === 4 && <TabPortfolio companyId={id} />}
          {activeTab === 5 && <TabBusinessField companyId={id} />}
        </>
      </TabMui>
      <Card className="rounded-3">
        <CardBody className="d-flex gap-3 justify-content-between">
          <div className="d-flex gap-1 flex-column">
            {isLoading ? (
              'Loading...'
            ) : error ? (
              'Something went wrong.'
            ) : (
              <table>
                <tbody>
                  <tr>
                    <td width="150">Admin Umum</td>
                    <td>:</td>
                    <td>
                      {(data?.status_verifikasi_umum === 'review_submit' ||
                        data?.status_verifikasi_umum === 'review_update') && (
                        <Badge color="warning" style={{ textTransform: 'capitalize' }}>
                          Permintaan review dari vendor
                        </Badge>
                      )}
                      {data?.status_verifikasi_umum === 'revisi' && (
                        <Badge color="danger" style={{ textTransform: 'capitalize' }}>
                          Revisi data oleh Admin
                        </Badge>
                      )}
                      {data?.status_verifikasi_umum === 'terverifikasi' && (
                        <Badge color="success" style={{ textTransform: 'capitalize' }}>
                          Terverifikasi
                        </Badge>
                      )}{' '}
                      <small>{data?.umum_updated_at ? `at ${data?.umum_updated_at}` : ''}</small>
                    </td>
                  </tr>
                  <tr>
                    <td width="150">Admin SCM</td>
                    <td>:</td>

                    <td>
                      {data?.status_verifikasi_scm === 'register' && (
                        <Badge color="success" style={{ textTransform: 'capitalize' }}>
                          Registered
                        </Badge>
                      )}
                      {(data?.status_verifikasi_scm === 'review_submit' ||
                        data?.status_verifikasi_scm === 'review_update') && (
                        <Badge color="warning" style={{ textTransform: 'capitalize' }}>
                          Permintaan review dari vendor
                        </Badge>
                      )}
                      {data?.status_verifikasi_scm === 'revisi' && (
                        <Badge color="danger" style={{ textTransform: 'capitalize' }}>
                          Revisi data oleh Admin
                        </Badge>
                      )}
                      {data?.status_verifikasi_scm === 'terverifikasi' && (
                        <Badge color="success" style={{ textTransform: 'capitalize' }}>
                          Terverifikasi
                        </Badge>
                      )}
                      <small> {data?.scm_updated_at ? `at ${data?.scm_updated_at}` : ''}</small>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          <div className="d-flex gap-3 align-items-center">
            <div>
              <Button type="button" color="warning" outline onClick={toggle.bind(null)}>
                Revisi
              </Button>
            </div>
            <div>
              <Button color="secondary" onClick={() => handleConfirmation(selectedName)}>
                Approve
              </Button>
            </div>
          </div>
        </CardBody>

        {/* Modal Revisi */}
        <Modal isOpen={modal} toggle={toggle.bind(null)} centered>
          <ModalHeader toggle={toggle.bind(null)}>Revisi Data Perusahaan Vendor</ModalHeader>
          <ModalBody>
            <div className="d-flex flex-column ">
              <Label htmlFor="comment">Catatan</Label>
              <Input
                type="textarea"
                id="comment"
                rows="10"
                name="comment"
                onChange={(e) => handleComment(e)}
                placeholder="Masukkan catatan revisi"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                handleRevisi();
              }}
            >
              {isApproving ? (
                <div className="d-flex align-items-center gap-2">
                  <Spinner size="sm" />
                  Mengirim..
                </div>
              ) : (
                'Kirim'
              )}
            </Button>
            <Button color="secondary" outline onClick={toggle.bind(null)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Revisi */}

        {/* Modal Approve */}
        <Modal isOpen={modal4} toggle={toggle4.bind(null)} centered>
          <ModalHeader toggle={toggle4.bind(null)}>Konfirmasi</ModalHeader>
          <ModalBody>
            <div className="d-flex text-center">
              <p>
                {' '}
                Data perusahaan <strong>{selectedName}</strong> akan diubah menjadi terverifikasi
                dan akan mendapatkan informasi data pengadaan. Lanjutkan?
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            {isApproving ? (
              <Button type="button" color="primary" disabled>
                <div className="d-flex align-items-center gap-2">
                  <Spinner size="sm" />
                  Loading..
                </div>
              </Button>
            ) : (
              <Button type="button" color="primary" onClick={handleApprove}>
                Ya
              </Button>
            )}
            <Button color="secondary" onClick={toggle4.bind(null)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Approve */}
      </Card>
    </>
  );
};

export default DocumentCheck;
