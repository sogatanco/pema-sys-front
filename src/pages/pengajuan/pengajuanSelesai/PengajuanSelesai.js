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
import htmlToPdfmake from 'html-to-pdfmake';
import useAxios from '../../../hooks/useAxios';

const pdfFonts = require('../../../assets/vfs_fonts');

// Explicitly set the virtual file system for pdfMake
if (pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
  console.error('Failed to load pdfmake fonts. Using default font as fallback.');
  pdfMake.vfs = {}; // Set an empty virtual file system to avoid crashes
}

const fonts = {
  Archivo: {
    normal: 'Archivo-Regular.ttf',
    bold: 'Archivo-SemiBold.ttf',
    italics: 'Archivo-Italic.ttf',
    bolditalics: 'Archivo-SemiBoldItalic.ttf',
  },
};

const PengajuanSelesai = () => {
  const api = useAxios();
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [searchText, setSearchText] = useState('');
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

  const generatePDF = (row) => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = fonts;

    const html = `
    <div>
      <h3 style="text-align: center;">Detail Pengajuan</h3>
      <div style="text-align: left;">
      <table style="border: none; border-collapse: collapse; width: 100%;">
        <tr>
          <td style="border: none; padding: 4px;"><strong>Jenis Permohonan</strong></td>
          <td style="border: none; padding: 4px;">: ${row.pengajuan}</td>
        </tr>
        <tr>
          <td style="border: none; padding: 4px;"><strong>No Dokumen</strong></td>
          <td style="border: none; padding: 4px;">: ${row.no_dokumen}</td>
        </tr>
        <tr>
          <td style="border: none; padding: 4px;"><strong>Tanggal Pengajuan</strong></td>
          <td style="border: none; padding: 4px;">
            : ${new Date(row.created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </td>
        </tr>
        <tr>
          <td style="border: none; padding: 4px;"><strong>Lampiran</strong></td>
          <td style="border: none; padding: 4px;">
            : <a href="${api.defaults.baseURL}/pengajuan/${row.lampiran}" target="_blank">${
      api.defaults.baseURL
    }/pengajuan/${row.lampiran}</a>
          </td>
        </tr>
        <tr>
          <td style="border: none; padding: 4px;"><strong>Diapprove oleh</strong></td>
          <td style="border: none; padding: 4px;">:
            <ol style="margin-left: 20px;">
              ${row.approvals
                .map(
                  (item) =>
                    `<li style="margin-bottom: 10px;">${item.full_name} (${
                      item.position_name
                    }) <br/>Approved At: ${new Date(item.updated_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</li>`,
                )
                .join('')}
            </ol>
          </td>
        </tr>
        <tr>
          <td style="border: none; padding: 4px;"><strong>Detail Pengajuan</strong></td>
          <td style="border: none; padding: 4px;">:</td>
        </tr>
        <tr>
          <td colspan="2" style="border: none; padding: 4px;">
                  <table style="width: 100%; border-collapse: collapse;" border="1">
                    <thead>
                      <tr style="text-align: center;">
                        <th>No</th>
                        <th>Nama Barang/Jasa</th>
                        <th>Jumlah</th>
                        <th>Satuan</th>
                        <th>Biaya Satuan</th>
                        <th>Total Biaya</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${row.sub_pengajuan
                        .map(
                          (item, index) => `
                        <tr>
                          <td>${index + 1}</td>
                          <td>${item.nama_item}</td>
                          <td>${item.jumlah}</td>
                          <td>${item.satuan}</td>
                          <td>${new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(item.biaya_satuan)}</td>
                          <td>${new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(item.total_biaya)}</td>
                          <td>${item.keterangan || '-'}</td>
                        </tr>`,
                        )
                        .join('')}
                      <tr>
                        <td colspan="5" style="text-align: right;"><strong>Total Biaya Keseluruhan</strong></td>
                        <td colspan="2">${new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        }).format(
                          row.sub_pengajuan.reduce((total, item) => total + item.total_biaya, 0),
                        )}</td>
                      </tr>
                    </tbody>
                  </table>
          </td>
        </tr>
      </table>
      </div>

      </div>
    `;

    const pdfContent = htmlToPdfmake(html, {
      defaultStyles: {
        table: { margin: [0, 5, 0, 15] },
        th: { bold: true, fillColor: '#eeeeee' },
      },
    });

    const docDefinition = {
      content: [pdfContent],
      defaultStyle: {
        font: 'Archivo',
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
            <table style={{ border: 'none', borderCollapse: 'collapse', marginLeft: '10px' }}>
              <tbody>
                <tr style={{ border: 'none' }}>
                  <td style={{ border: 'none', width: '200px' }}>
                    <strong>Jenis Permohonan</strong>
                  </td>
                  <td style={{ border: 'none' }}>
                    <td style={{ border: 'none' }}>: {row.pengajuan}</td>
                  </td>
                </tr>
                <tr style={{ border: 'none' }}>
                  <td style={{ border: 'none', width: '200px' }}>
                    <strong>No Dokumen</strong>
                  </td>
                  <td style={{ border: 'none' }}>
                    <td style={{ border: 'none' }}>: {row.no_dokumen}</td>
                  </td>
                </tr>
                <tr style={{ border: 'none' }}>
                  <td style={{ border: 'none', width: '200px' }}>
                    <strong>Tanggal Pengajuan</strong>
                  </td>
                  <td style={{ border: 'none' }}>
                    <td style={{ border: 'none' }}>
                      :{' '}
                      {new Date(row.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </td>
                </tr>
                <tr style={{ border: 'none' }}>
                  <td style={{ border: 'none', width: '200px' }}>
                    <strong>Diapprove oleh</strong>
                  </td>
                  <td style={{ border: 'none' }}>
                    <td style={{ border: 'none' }}>:</td>
                  </td>
                </tr>
              </tbody>
            </table>
          </Row>

          {/* Diapprove oleh dalam 1 baris 3 kolom */}
          <Row className="mb-4">
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
                        <td style={{ whiteSpace: 'pre-wrap' }}>{item.nama_item}</td>
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
