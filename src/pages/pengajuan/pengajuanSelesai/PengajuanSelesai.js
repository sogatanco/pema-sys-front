import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Spinner,
  Button,
  Row,
  Col,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { useQuery } from '@tanstack/react-query';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import useAxios from '../../../hooks/useAxios';

// Explicitly set the virtual file system for pdfMake
if (pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
  console.error('Failed to load pdfmake fonts. Ensure pdfmake is properly installed.');
}

const PengajuanSelesai = () => {
  const api = useAxios();
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterMonth, setFilterMonth] = useState(''); // Tambah state filter bulan
  const [modalContent, setModalContent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['pengajuanSelesai'],
    queryFn: () =>
      api.get('/api/pengajuan-selesai').then((res) => {
        console.log(res);
        return res.data.data;
      }),
  });

  useEffect(() => {
    setDataPengajuan(data || []);
  }, [data]);

  useEffect(() => {
    let filtered = data;
    if (searchText) {
      filtered = filtered?.filter((item) =>
        item.sub_pengajuan[0].nama_item.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
    if (filterMonth) {
      filtered = filtered?.filter((item) => {
        const date = new Date(item.created_at);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return filterMonth === `${year}-${month}`;
      });
    }
    setDataPengajuan(filtered);
  }, [searchText, filterMonth, data]);

  const generatePDF = (row) => {
    const docDefinition = {
      content: [
        { text: 'Detail Pengajuan', style: 'header' },
        { text: `Jenis Permohonan: ${row.pengajuan}`, margin: [0, 10, 0, 5] },
        { text: `No Dokumen: ${row.no_dokumen}`, margin: [0, 0, 0, 5] },
        {
          text: `Tanggal Pengajuan: ${new Date(row.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          margin: [0, 0, 0, 10],
        },
        { text: 'Lampiran:', margin: [0, 0, 0, 5] },
        {
          text: `${api.defaults.baseURL}/pengajuan/${row.lampiran}`,
          link: `${api.defaults.baseURL}/pengajuan/${row.lampiran}`,
          color: 'blue',
          margin: [0, 0, 0, 10],
        },
        { text: 'Diapprove oleh:', style: 'subheader', margin: [0, 10, 0, 5] },
        ...row.approvals.map((item) => ({
          text: `${item.full_name} (${item.position_name}) - Approved At: ${new Date(
            item.updated_at,
          ).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          margin: [0, 0, 0, 5],
        })),
        { text: 'Detail Barang/Jasa:', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', '*'],
            body: [
              [
                { text: 'No', bold: true },
                { text: 'Nama Barang/Jasa', bold: true },
                { text: 'Jumlah', bold: true },
                { text: 'Satuan', bold: true },
                { text: 'Biaya Satuan', bold: true },
                { text: 'Total Biaya', bold: true },
                { text: 'Keterangan', bold: true },
              ],
              ...row.sub_pengajuan.map((item, index) => [
                index + 1,
                item.nama_item,
                item.jumlah,
                item.satuan,
                new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                  item.biaya_satuan,
                ),
                new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                  item.total_biaya,
                ),
                item.keterangan || '-',
              ]),
              [
                { text: 'Total Biaya Keseluruhan', colSpan: 5, alignment: 'right' },
                {},
                {},
                {},
                {},
                new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                  row.sub_pengajuan.reduce((total, item) => total + item.total_biaya, 0),
                ),
                {},
              ],
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 14, bold: true },
      },
      defaultStyle: {
        font: 'Helvetica',
      },
    };

    pdfMake.createPdf(docDefinition).open();
  };

  const handleDetailClick = (row) => {
    setModalContent({
      row,
      title: 'Detail Pengajuan',
      body: (
        <>
          <div className="d-flex justify-content-end">
            <Button color="primary" onClick={() => generatePDF(row)}>
              Print PDF
            </Button>
          </div>
          <Row className="mb-4">
            <Col md={6}>
              <p className="fw-bold">Jenis Permohonan:</p>
              <p>{row.pengajuan}</p>
            </Col>
            <Col md={6}>
              <p className="fw-bold">No Dokumen:</p>
              <p>{row.no_dokumen}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <p className="fw-bold">Tanggal Pengajuan:</p>
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
              <p className="fw-bold">Lampiran:</p>
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

          {/* Diapprove oleh dalam 1 baris 3 kolom */}
          <Row className="mb-4">
            <p className="fw-bold">Diapprove oleh:</p>
            {row?.approvals?.map((item) => (
              <Col key={item.id} md={4} className="mb-3">
                <div className="shadow-sm p-3 bg-light rounded">
                  <h5 className="mb-1">{item?.full_name}</h5>
                  <p className="mb-1 text-muted">{item.position_name}</p>
                  <small className="text-muted">
                    <strong>Approved At: </strong>
                    {new Date(item.updated_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </small>
                </div>
              </Col>
            ))}
          </Row>

          <Row>
            <Col>
              <div className="table-responsive">
                <Table bordered responsive hover>
                  <thead className="">
                    <tr>
                      <th className="text-center" style={{ width: '50px' }}>
                        No
                      </th>
                      <th>Nama Barang/Jasa</th>
                      <th>Jumlah</th>
                      <th>Satuan</th>
                      <th>Biaya Satuan</th>
                      <th>Total Biaya</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {row.sub_pengajuan.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-center">{index + 1}</td>
                        <td>{item.nama_item}</td>
                        <td>{item.jumlah}</td>
                        <td>{item.satuan}</td>
                        <td>
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(item.biaya_satuan)}
                        </td>
                        <td>
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(item.total_biaya)}
                        </td>
                        <td>{item.keterangan || '-'}</td>
                      </tr>
                    ))}
                    <tr className="fw-bold">
                      <td colSpan={5} className="text-end">
                        Total Biaya Keseluruhan
                      </td>
                      <td colSpan={2}>
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        }).format(
                          row.sub_pengajuan.reduce((total, item) => total + item.total_biaya, 0),
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
      name: 'No',
      selector: (row, index) => index + 1,
      width: '50px',
    },
    {
      name: 'Aksi',
      selector: (row) => (
        <div className="d-flex justify-content-center">
          <Button outline color="info" size="sm" onClick={() => handleDetailClick(row)}>
            Detail
          </Button>
        </div>
      ),
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
    <>
      <Card>
        <CardBody>
          <div className="mb-3 d-flex align-items-center justify-content-end gap-2">
            <input
              type="text"
              className="form-control w-25"
              placeholder="Cari..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <input
              type="month"
              className="form-control w-auto"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              style={{ minWidth: 180 }}
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

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} size="xl">
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Detail Pengajuan</ModalHeader>
        <ModalBody>{modalContent?.body}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Tutup
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PengajuanSelesai;
