import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Label,
  Table,
  Row,
  Col,
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import useAxios from '../../../hooks/useAxios';
// import previewPdf from '../../../utils/previewPdf';
import { alert } from '../../../components/atoms/Toast';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ApprovalPengajuan = ({ setBadgeCount }) => {
  const api = useAxios();
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [alasanReject, setAlasanReject] = useState('');
  const [showAlasanInput, setShowAlasanInput] = useState(false);
  const [searchText, setSearchText] = useState('');
  const queryClient = useQueryClient();

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setAlasanReject('');
    setShowAlasanInput(false);
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['approval-pengajuan-all'],
    queryFn: () => api.get(`api/pengajuan-approval`).then((res) => res.data.data),
  });

  useEffect(() => {
    setDataPengajuan(data || []);
    // Kirim jumlah data ke komponen Pengajuan
    if (data) {
      setBadgeCount(data.length); // Update badge count di Pengajuan
      queryClient.invalidateQueries(['dashboard-pengajuan']);
    }
  }, [data, setBadgeCount]);

  useEffect(() => {
    if (searchText) {
      setDataPengajuan(
        data?.filter((item) =>
          item.sub_pengajuan[0].nama_item.toLowerCase().includes(searchText.toLowerCase()),
        ),
      );
    } else {
      setDataPengajuan(data);
    }
  }, [searchText]);

  const handleApprove = async () => {
    if (!modalContent?.row) return;

    setLoading(true);
    const dataApprove = {
      id: modalContent.row.id,
      status: 'approve',
    };
    try {
      await api.post(`api/pengajuan-approval/approve`, dataApprove);
      refetch();
      setModalOpen(false);
      alert('success', 'Pengajuan berhasil diapprove');
    } catch (err) {
      console.error(err);
      alert('error', 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!modalContent?.row) return;

    if (!alasanReject.trim()) {
      alert('error', 'Silakan isi alasan penolakan');
      return;
    }

    setLoadingReject(true);
    const dataReject = {
      id: modalContent.row.id,
      status: 'reject',
      alasan: alasanReject,
    };
    try {
      await api.post(`api/pengajuan-approval/reject`, dataReject);
      refetch();
      setModalOpen(false);
      setAlasanReject('');
      setShowAlasanInput(false);
      alert('success', 'Pengajuan Ditolak');
    } catch (err) {
      console.error(err);
      alert('error', 'Terjadi kesalahan');
    } finally {
      setLoadingReject(false);
    }
  };

  // Helper untuk format rupiah tanpa koma
  const formatRupiahNoComma = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    })
      .format(value)
      .replace(/,/g, '');
  };

  const handlePendingApprovalClick = (row) => {
    setModalContent({
      row,
      title: 'Detail Pengajuan',
      body: (
        <>
          <Row>
            <Col md={6}>
              <p className="fw-bold">Jenis Permohonan : </p>
              <p>{row.pengajuan}</p>
            </Col>
            <Col md={6}>
              <p className="fw-bold">No Dokumen : </p>
              <p>{row.no_dokumen}</p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p className="fw-bold">Tanggal Pengajuan : </p>
              <p>
                {new Date(row.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </Col>
            <Col md={6}>
              <p className="fw-bold">Lampiran : </p>
              <p>
                <a
                  href={`${api.defaults.baseURL}/pengajuan/${row.lampiran}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-info btn-sm"
                >
                  Lihat Lampiran
                </a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="table-responsive">
                <Table bordered responsive hover>
                  <thead>
                    <tr>
                      <th className="text-center" style={{ width: '50px' }}>
                        No
                      </th>
                      <th>Nama Barang/Jasa</th>
                      <th>Jumlah</th>
                      <th>Satuan</th>
                      <th>Biaya Satuan</th>
                      <th>Pajak</th>
                      <th>Total Biaya</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {row.sub_pengajuan.map((item, index) => {
                      // Pajak array, support pajak di field pajak atau taxes
                      const pajakArr = item.pajak || item.taxes || [];
                      const hargaSatuan = item.biaya_satuan;
                      const pajakDetail = [];
                      let hargaSetelahPajak = hargaSatuan;

                      pajakArr.forEach((pajak) => {
                        const persentase = Number(pajak.persentase || pajak.percentage || 0);
                        const tipe = pajak.calculation || pajak.type;
                        const nama = pajak.nama_pajak || pajak.name || '';
                        if (persentase > 0) {
                          // Pajak dihitung dari harga satuan * persentase * jumlah
                          const nilaiPajak = ((hargaSatuan * persentase) / 100) * item.jumlah;
                          const nilaiPajakStr = formatRupiahNoComma(nilaiPajak);
                          if (tipe === 'increase' || tipe === 'increment') {
                            hargaSetelahPajak += (hargaSatuan * persentase) / 100;
                            pajakDetail.push(
                              <div key={`${nama}_inc`}>
                                {`+ ${nama} (${persentase}%) : `}
                                {nilaiPajakStr}
                              </div>,
                            );
                          } else if (tipe === 'decrease' || tipe === 'decrement') {
                            hargaSetelahPajak -= (hargaSatuan * persentase) / 100;
                            pajakDetail.push(
                              <div key={`${nama}_dec`}>
                                {`- ${nama} (${persentase}%) : `}
                                {nilaiPajakStr}
                              </div>,
                            );
                          }
                        }
                      });

                      // Total biaya = harga satuan setelah pajak * jumlah
                      const totalBiaya = hargaSetelahPajak * item.jumlah;

                      return (
                        <tr key={item.id}>
                          <td className="text-center">{index + 1}</td>
                          <td style={{ whiteSpace: 'pre-wrap' }}>{item.nama_item}</td>
                          <td>{item.jumlah}</td>
                          <td>{item.satuan}</td>
                          <td>{formatRupiahNoComma(item.biaya_satuan)}</td>
                          <td>{pajakArr.length > 0 ? pajakDetail : <span>-</span>}</td>
                          <td>{formatRupiahNoComma(totalBiaya)}</td>
                          <td>{item.keterangan || '-'}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={6} className="text-end fw-bold">
                        Total Biaya Keseluruhan
                      </td>
                      <td colSpan={2}>
                        {formatRupiahNoComma(
                          row.sub_pengajuan.reduce((total, item) => {
                            const pajakArr = item.pajak || item.taxes || [];
                            const hargaSatuan = item.biaya_satuan;
                            let hargaSetelahPajak = hargaSatuan;
                            pajakArr.forEach((pajak) => {
                              const persentase = Number(pajak.persentase || pajak.percentage || 0);
                              const tipe = pajak.calculation || pajak.type;
                              if (persentase > 0) {
                                const nilaiPajak = (hargaSatuan * persentase) / 100;
                                if (tipe === 'increase' || tipe === 'increment') {
                                  hargaSetelahPajak += nilaiPajak;
                                } else if (tipe === 'decrease' || tipe === 'decrement') {
                                  hargaSetelahPajak -= nilaiPajak;
                                }
                              }
                            });
                            return total + hargaSetelahPajak * item.jumlah;
                          }, 0),
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </>
      ),
    });
    setModalOpen(true);
  };

  const columns = [
    {
      name: 'Aksi',
      selector: (row) => (
        <Button
          color="primary"
          outline
          size="sm"
          className="me-2"
          onClick={() => handlePendingApprovalClick(row)}
        >
          Pending Approval
        </Button>
      ),
      width: '200px',
    },
    {
      name: 'Tanggal Pengajuan',
      selector: (row) =>
        new Date(row.created_at).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      width: '200px',
    },
    {
      name: 'Jenis Permohonan',
      selector: (row) => row.pengajuan,
      width: '250px',
    },
    {
      name: 'No Dokumen',
      selector: (row) => row.no_dokumen,
      width: '200px',
    },
    {
      name: 'Nama Barang/Jasa',
      selector: (row) => row.sub_pengajuan[0].nama_item,
    },
    {
      name: 'Jumlah Barang/Jasa',
      selector: (row) => row.sub_pengajuan[0].jumlah,
    },
    {
      name: 'Satuan',
      selector: (row) => row.sub_pengajuan[0].satuan,
    },
    {
      name: 'Biaya Satuan',
      selector: (row) => (
        <div>
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
            row.sub_pengajuan[0].biaya_satuan,
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <CardBody className="p-4">
          <div className="mb-3 d-flex align-items-center justify-content-end">
            <input
              type="text"
              className="form-control w-25"
              placeholder="Cari..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner color="primary" size="sm" className="me-2" /> Sedang Mengambil Data
            </div>
          ) : error ? (
            <div className="text-center">Something went wrong</div>
          ) : (
            <DataTable columns={columns} data={dataPengajuan} pagination highlightOnHover />
          )}
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModal} size="xl">
        <ModalHeader toggle={toggleModal}>{modalContent?.title || 'Detail'}</ModalHeader>
        <ModalBody>
          {modalContent?.body}
          {showAlasanInput && (
            <div className="mt-3">
              <Label>
                <strong>Alasan Penolakan:</strong>
              </Label>
              <textarea
                className="form-control"
                rows="3"
                value={alasanReject}
                onChange={(e) => setAlasanReject(e.target.value)}
                placeholder="Masukkan alasan penolakan"
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Tutup
          </Button>
          {!showAlasanInput ? (
            <Button color="danger" onClick={() => setShowAlasanInput(true)}>
              Reject
            </Button>
          ) : (
            <Button color="danger" onClick={handleReject} disabled={loadingReject}>
              {loadingReject ? (
                <>
                  <Spinner size="sm" color="light" className="me-2" /> Loading
                </>
              ) : (
                'Submit Reject'
              )}
            </Button>
          )}
          <Button color="primary" onClick={handleApprove} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" color="light" className="me-2" /> Loading
              </>
            ) : (
              'Approve'
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

ApprovalPengajuan.propTypes = {
  setBadgeCount: PropTypes.func.isRequired,
};

export default ApprovalPengajuan;
