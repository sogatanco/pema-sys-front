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

  const generatePDF = (row) => {
    // Tidak perlu deklarasi formatPajak & totalPajakKeseluruhan terpisah, langsung di dalam map saja

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
            widths: [
              'auto', // No
              '*', // Nama Barang/Jasa
              'auto', // Jumlah
              'auto', // Satuan
              'auto', // Biaya Satuan
              'auto', // Pajak
              'auto', // Total Biaya
              '*', // Keterangan
            ],
            body: [
              [
                { text: 'No', bold: true, alignment: 'center' },
                { text: 'Nama Barang/Jasa', bold: true },
                { text: 'Jumlah', bold: true },
                { text: 'Satuan', bold: true },
                { text: 'Biaya Satuan', bold: true },
                { text: 'Pajak', bold: true },
                { text: 'Total Biaya', bold: true },
                { text: 'Keterangan', bold: true },
              ],
              ...row.sub_pengajuan.map((item, index) => {
                const pajakArr = item.pajak || item.taxes || [];
                const hargaSatuan = item.biaya_satuan;
                let hargaSetelahPajak = hargaSatuan;
                const pajakDetail = pajakArr.map((pajak) => {
                  const persentase = Number(pajak.persentase || pajak.percentage || 0);
                  const tipe = pajak.calculation || pajak.type;
                  const nama = pajak.nama_pajak || pajak.name || '';
                  const nilaiPajak = ((hargaSatuan * persentase) / 100) * item.jumlah;
                  const nilaiPajakStr = formatRupiahNoComma(nilaiPajak);
                  if (tipe === 'increase' || tipe === 'increment') {
                    hargaSetelahPajak += (hargaSatuan * persentase) / 100;
                    return `+ ${nama}\n(${persentase}%) :\n ${nilaiPajakStr}`;
                  }
                  if (tipe === 'decrease' || tipe === 'decrement') {
                    hargaSetelahPajak -= (hargaSatuan * persentase) / 100;
                    return `- ${nama}\n(${persentase}%) :\n ${nilaiPajakStr}`;
                  }
                  return '';
                });

                const totalBiaya = hargaSetelahPajak * item.jumlah;

                return [
                  { text: index + 1, alignment: 'center' },
                  { text: item.nama_item },
                  { text: item.jumlah, alignment: 'center' },
                  { text: item.satuan, alignment: 'center' },
                  {
                    text: formatRupiahNoComma(item.biaya_satuan),
                    alignment: 'right',
                  },
                  pajakArr.length > 0
                    ? { text: pajakDetail.join('\n'), alignment: 'left' }
                    : { text: '-', alignment: 'center' },
                  {
                    text: formatRupiahNoComma(totalBiaya),
                    alignment: 'right',
                  },
                  { text: item.keterangan || '-', alignment: 'left' },
                ];
              }),
              [
                { text: 'Total Biaya Keseluruhan', colSpan: 6, alignment: 'right' },
                {},
                {},
                {},
                {},
                {},
                formatRupiahNoComma(
                  row.sub_pengajuan.reduce((total, item) => {
                    const pajakArr = item.pajak || item.taxes || [];
                    let hargaSetelahPajak = item.biaya_satuan;
                    pajakArr.forEach((pajak) => {
                      const persentase = Number(pajak.persentase || pajak.percentage || 0);
                      const tipe = pajak.calculation || pajak.type;
                      if (persentase > 0) {
                        const nilaiPajak = (item.biaya_satuan * persentase) / 100;
                        if (tipe === 'increase' || tipe === 'increment') {
                          hargaSetelahPajak += nilaiPajak;
                        }
                        if (tipe === 'decrease' || tipe === 'decrement') {
                          hargaSetelahPajak -= nilaiPajak;
                        }
                      }
                    });
                    return total + hargaSetelahPajak * item.jumlah;
                  }, 0),
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
      // Hapus defaultStyle.font agar pdfMake pakai font default bawaan (Roboto)
      // defaultStyle: {
      //   font: 'Helvetica',
      // },
    };

    pdfMake.createPdf(docDefinition).open();
  };

  // Helper untuk format rupiah tanpa koma

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
