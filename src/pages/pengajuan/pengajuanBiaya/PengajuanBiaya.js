import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Table,
} from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import DataTable from 'react-data-table-component';
import { useQuery } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import useAxios from '../../../hooks/useAxios';
import { alert } from '../../../components/atoms/Toast';

const PengajuanBiaya = () => {
  const api = useAxios();
  const [isAddForm, setIsAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [modalContent2, setModalContent2] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [updateClick, setUpdateClick] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');

  // Pajak toggle function
  const [taxVisibility, setTaxVisibility] = useState({});
  const [taxesPerItem, setTaxesPerItem] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    unregister, // tambahkan ini
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: [{ itemName: '', quantity: '', unit: '', price: '', description: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pengajuan-list'],
    queryFn: () =>
      api.get(`api/pengajuan`).then((res) => {
        console.log(res);
        return res.data.data;
      }),
  });

  useEffect(() => {
    if (data) {
      setDataPengajuan(data);
    } else {
      setDataPengajuan([]);
    }
  }, [data]);

  useEffect(() => {
    let filtered = data;
    if (searchText) {
      filtered = filtered?.filter((item) =>
        item.sub_pengajuan[0].nama_item.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
    if (selectedMonth) {
      // selectedMonth format: "YYYY-MM"
      filtered = filtered?.filter((item) => {
        const created = new Date(item.created_at);
        const yearMonth = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(
          2,
          '0',
        )}`;
        return yearMonth === selectedMonth;
      });
    }
    setDataPengajuan(filtered);
  }, [searchText, selectedMonth, data]);

  const addForm = async (e) => {
    e.preventDefault();
    setIsAddForm(true);
  };

  const removeForm = () => {
    reset();
    setUpdateClick(false);
    setIsAddForm(false);
  };

  function formatRupiah(angka) {
    if (!angka) return 'Rp 0';
    const numberString = angka.toString().replace(/[^,\d]/g, '');
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += `${separator}${ribuan.join('.')}`;
    }

    return `Rp ${rupiah}`;
  }

  const onSubmit = async (dataSubmit) => {
    console.log('Data Submit', dataSubmit);
    setLoading(true);

    // Map items dan sertakan data pajak jika ada
    const cleanedItems = dataSubmit.items.map((item) => {
      let taxes = [];
      if (item.taxes && Array.isArray(item.taxes)) {
        taxes = item.taxes.map((tax) => ({
          name: tax.name,
          percentage: tax.percentage,
          type: tax.type,
        }));
      }
      return {
        ...item,
        price: Number(item.price.replace(/[^\d]/g, '')), // hilangkan Rp, titik, dll
        taxes, // array pajak, bisa kosong
      };
    });

    const formData = new FormData();

    formData.append('jenis_permohonan', dataSubmit.jenis_permohonan);
    formData.append('no_dokumen', dataSubmit.documentNumber);
    formData.append('lampiran', dataSubmit.file[0]);
    formData.append('items', JSON.stringify(cleanedItems));

    await api
      .post('api/pengajuan', formData)
      .then((res) => {
        console.log('res', res);
        setLoading(false);
        refetch();
        removeForm();
        reset();
        alert('success', 'Pengajuan Berhasil Ditambahkan');
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert('error', 'Terjadi Kesalahan');
      });
  };

  const handleChangeJenisPermohonan = (value) => {
    if (value === 'Permohonan Biaya') {
      setValue('documentNumber', 'FPR-UM-PEMA-01-04');
    } else if (value === 'Reimbursement') {
      setValue('documentNumber', 'FPR-UM-PEMA-01-02');
    } else if (value === 'Tagihan Biaya') {
      setValue('documentNumber', 'FPR-UM-PEMA-01-03');
    } else if (value === 'Aktual Biaya') {
      setValue('documentNumber', 'FPR-UM-PEMA-04-02');
    } else {
      setValue('documentNumber', '');
    }
  };

  const handleApprovalClick = async (row) => {
    await api
      .get(`api/pengajuan/${row.id}/show`)
      .then((res) => {
        console.log('res', res);
        setSelectedData(res.data.data);
        setModalOpen(true);
      })
      .catch((err) => {
        console.log(err);
        alert('error', 'Terjadi Kesalahan');
      });
  };

  const handleUpdateClick = (row) => {
    setUpdateClick(true);
    setIsAddForm(true);
    setValue('id', row.id);
    setValue('jenis_permohonan', row.pengajuan);
    setValue('documentNumber', row.no_dokumen);

    remove();

    // Reset pajak visibility dan value
    setTaxVisibility({});
    setTaxesPerItem({});

    if (row.sub_pengajuan && row.sub_pengajuan.length > 0) {
      row.sub_pengajuan.forEach((item, idx) => {
        append({
          itemName: item?.nama_item,
          quantity: item?.jumlah,
          unit: item?.satuan,
          price: formatRupiah(item?.biaya_satuan),
          description: item.keterangan,
          taxes:
            item.taxes && Array.isArray(item.taxes)
              ? item.taxes.map((tax) => ({
                  name: tax.nama_pajak,
                  percentage: tax.persentase,
                  type: tax.calculation === 'increase' ? 'increment' : 'decrement',
                }))
              : [],
        });

        // Jika ada pajak, tampilkan form pajak dan set valuenya
        if (item.taxes && Array.isArray(item.taxes) && item.taxes.length > 0) {
          setTaxVisibility((prev) => ({
            ...prev,
            [idx]: true,
          }));
          setTaxesPerItem((prev) => ({
            ...prev,
            [idx]: item.taxes.map((tax) => ({
              id: `${Date.now()}-${Math.random()}`,
              name: tax.nama_pajak,
              percentage: tax.persentase,
              type: tax.calculation === 'increase' ? 'increment' : 'decrement',
            })),
          }));
        }
      });
    }
  };

  const onUpdate = async (dataSubmit) => {
    console.log('Data Submit', dataSubmit);
    setLoading(true);

    // Map items dan sertakan data pajak jika ada
    const cleanedItems = dataSubmit.items.map((item) => {
      let taxes = [];
      if (item.taxes && Array.isArray(item.taxes)) {
        taxes = item.taxes.map((tax) => ({
          name: tax.name,
          percentage: tax.percentage,
          type: tax.type,
        }));
      }
      return {
        ...item,
        price: Number(item.price.replace(/[^\d]/g, '')),
        taxes,
      };
    });

    const formData = new FormData();

    formData.append('id', dataSubmit.id);
    formData.append('jenis_permohonan', dataSubmit.jenis_permohonan);
    formData.append('no_dokumen', dataSubmit.documentNumber);
    if (dataSubmit.file && dataSubmit.file[0]) {
      formData.append('lampiran', dataSubmit.file[0]);
    }
    formData.append('items', JSON.stringify(cleanedItems));

    await api
      .post(`api/pengajuan/${dataSubmit.id}/update`, formData)
      .then((res) => {
        refetch();
        console.log(res);
        setLoading(false);
        removeForm();
        reset();
        alert('success', 'Pengajuan Berhasil Diupdate');
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert('error', 'Terjadi Kesalahan');
      });
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

  const handleDetailClick = (row) => {
    setModalContent2({
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
                      const hargaSatuan = item?.biaya_satuan;
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
                          <td style={{ whiteSpace: 'pre-wrap' }}>{item?.nama_item}</td>
                          <td>{item?.jumlah}</td>
                          <td>{item?.satuan}</td>
                          <td>{formatRupiahNoComma(item?.biaya_satuan)}</td>
                          <td>
                            {pajakArr.length > 0 ? (
                              <div>
                                {pajakArr.map((pajak) => {
                                  const persentase = Number(
                                    pajak.persentase || pajak.percentage || 0,
                                  );
                                  const tipe = pajak.calculation || pajak.type;
                                  const nama = pajak.nama_pajak || pajak.name || '';
                                  const nilaiPajak =
                                    ((hargaSatuan * persentase) / 100) * item.jumlah;
                                  const nilaiPajakStr = formatRupiahNoComma(nilaiPajak);
                                  // Gunakan kombinasi nama, tipe, dan persentase sebagai key
                                  const key = `${nama}-${tipe}-${persentase}`;
                                  return (
                                    <div key={key} style={{ marginBottom: 4 }}>
                                      <span>
                                        {tipe === 'increase' || tipe === 'increment' ? '+' : '-'}{' '}
                                        {nama} ({persentase}%) :
                                      </span>
                                      <br />
                                      <span style={{ paddingLeft: 16 }}>{nilaiPajakStr}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
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
                            const hargaSatuan = item?.biaya_satuan;
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
    setModalOpen2(true);
  };

  const columns = [
    {
      name: 'Aksi',
      selector: (row) => (
        <>
          <Button
            color="danger"
            outline
            size="sm"
            className="me-2"
            onClick={() => handleUpdateClick(row)}
            disabled={
              !row?.approvals?.every(
                (approval) =>
                  approval.status === null ||
                  row?.approvals?.some((approval2) => approval2.status === '0'),
              )
            }
          >
            Update
          </Button>

          <Button
            color="secondary"
            outline
            size="sm"
            className="me-2"
            onClick={() => handleApprovalClick(row)}
          >
            Approval
          </Button>
          <Button outline size="sm" color="info" onClick={() => handleDetailClick(row)}>
            Detail
          </Button>
        </>
      ),
      width: '300px',
    },
    {
      name: 'Status',
      selector: (row) => (
        <>
          {row?.approvals?.every((approval) => approval.status === '1') ? (
            <span className="badge bg-success rounded-pill">Approved</span>
          ) : row?.approvals?.some((approval) => approval.status === '0') ? (
            <span className="badge bg-danger rounded-pill">Rejected</span>
          ) : (
            <span className="badge bg-secondary rounded-pill">Pending</span>
          )}
        </>
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
    },
    {
      name: 'No Dokumen',
      selector: (row) => row.no_dokumen,
      width: '200px',
    },
    {
      name: 'Nama Barang/Jasa',
      selector: (row) => row.sub_pengajuan[0]?.nama_item,
    },
    {
      name: 'Jumlah Barang/Jasa',
      selector: (row) => row?.sub_pengajuan[0]?.jumlah,
    },
    {
      name: 'Satuan',
      selector: (row) => row?.sub_pengajuan[0]?.satuan,
    },
    {
      name: 'Biaya Satuan',
      selector: (row) => (
        <div>
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
            row.sub_pengajuan[0]?.biaya_satuan,
          )}
        </div>
      ),
    },
  ];

  const toggleTax = (index) => {
    setTaxVisibility((prev) => {
      const isVisible = !prev[index];
      if (!isVisible) {
        // Unregister semua field pajak pada item ini
        if (taxesPerItem[index] && Array.isArray(taxesPerItem[index])) {
          taxesPerItem[index].forEach((_, taxIdx) => {
            unregister(`items.${index}.taxes.${taxIdx}.name`);
            unregister(`items.${index}.taxes.${taxIdx}.percentage`);
            unregister(`items.${index}.taxes.${taxIdx}.type`);
          });
        }
        setTaxesPerItem((prevTaxes) => {
          const updated = { ...prevTaxes };
          delete updated[index];
          return updated;
        });
      } else if (!taxesPerItem[index] || taxesPerItem[index].length === 0) {
        setTaxesPerItem((prevTaxes) => ({
          ...prevTaxes,
          [index]: [
            {
              id: `${Date.now()}-${Math.random()}`,
              name: '',
              percentage: '',
              type: 'increment',
            },
          ],
        }));
      }
      return {
        ...prev,
        [index]: isVisible,
      };
    });
  };

  const addTax = (itemIndex) => {
    setTaxesPerItem((prev) => {
      const itemTaxes = prev[itemIndex] || [];
      return {
        ...prev,
        [itemIndex]: [
          ...itemTaxes,
          {
            id: `${Date.now()}-${Math.random()}`,
            name: '',
            percentage: '',
            type: 'increment',
          },
        ],
      };
    });
  };

  const updateTax = (itemIndex, taxIndex, field, value) => {
    setTaxesPerItem((prev) => {
      const itemTaxes = [...(prev[itemIndex] || [])];
      itemTaxes[taxIndex][field] = value;
      return { ...prev, [itemIndex]: itemTaxes };
    });
  };

  const removeTax = (itemIndex, taxIndex) => {
    setTaxesPerItem((prev) => {
      const updatedTaxes = [...(prev[itemIndex] || [])];
      updatedTaxes.splice(taxIndex, 1);

      // Unregister react-hook-form field untuk pajak yang dihapus
      unregister(`items.${itemIndex}.taxes.${taxIndex}.name`);
      unregister(`items.${itemIndex}.taxes.${taxIndex}.percentage`);
      unregister(`items.${itemIndex}.taxes.${taxIndex}.type`);

      // Jika setelah dihapus tidak ada pajak lagi, sembunyikan form pajak
      if (updatedTaxes.length === 0) {
        setTaxVisibility((prevVis) => ({
          ...prevVis,
          [itemIndex]: false,
        }));
        return Object.fromEntries(
          Object.entries(prev).filter(([key]) => Number(key) !== itemIndex),
        );
      }
      return { ...prev, [itemIndex]: updatedTaxes };
    });
  };

  return (
    <>
      <Card>
        <CardBody>
          {!isAddForm && (
            <div className="d-grid gap-2">
              <Button size="lg" color="primary" onClick={addForm}>
                Tambah Permohonan
              </Button>
            </div>
          )}

          {isAddForm && (
            <>
              <div className="d-flex justify-content-end mb-3">
                <MaterialIcon icon="close" onClick={removeForm} style={{ cursor: 'pointer' }} />
              </div>
              <form onSubmit={updateClick ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>
                {updateClick && <input type="hidden" {...register('id')} required />}
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <Label>Jenis Permohonan</Label>
                      <select
                        className={`form-control ${errors.jenis_permohonan ? 'is-invalid' : ''}`}
                        {...register('jenis_permohonan', {
                          required: 'Jenis Permohonan wajib diisi',
                          onChange: (e) => handleChangeJenisPermohonan(e.target.value),
                        })}
                      >
                        <option value="">Pilih Permohonan</option>
                        <option value="Permohonan Biaya">Permohonan Biaya</option>
                        <option value="Reimbursement">Reimbursement</option>
                        <option value="Tagihan Biaya">Tagihan Biaya</option>
                        <option value="Aktual Biaya">Aktual Biaya</option>
                      </select>
                      {errors.jenis_permohonan && (
                        <div className="invalid-feedback">{errors.jenis_permohonan.message}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <Label>No Dokumen</Label>
                      <input
                        type="text"
                        className={`form-control ${errors.documentNumber ? 'is-invalid' : ''}`}
                        placeholder="No Dokumen"
                        {...register('documentNumber', { required: 'No Dokumen wajib diisi' })}
                      />
                      {errors.documentNumber && (
                        <div className="invalid-feedback">{errors.documentNumber.message}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <Label>Lampiran</Label>
                      <input
                        type="file"
                        accept=".pdf"
                        className={`form-control ${errors.file ? 'is-invalid' : ''}`}
                        placeholder="Lampiran"
                        {...register('file', {
                          required: updateClick ? false : 'Lampiran wajib diisi',
                        })}
                      />
                      <span className="text-primary">Hanya menerima file PDF</span>
                      {errors.file && <div className="invalid-feedback">{errors.file.message}</div>}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th style={{ width: '300px' }}>Nama Barang/Jasa</th>
                            <th style={{ width: '150px' }}>Jumlah</th>
                            <th style={{ width: '200px' }}>Satuan</th>
                            <th style={{ width: '200px' }}>Harga Satuan</th>
                            <th>Keterangan</th>
                            <th style={{ width: '150px' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map((field, index) => (
                            <>
                              <tr key={field.id}>
                                <td>
                                  <textarea
                                    className={`form-control ${
                                      errors.items?.[index]?.itemName ? 'is-invalid' : ''
                                    }`}
                                    placeholder="Nama Barang/Jasa"
                                    {...register(`items.${index}.itemName`, {
                                      required: 'Nama Barang/Jasa wajib diisi',
                                    })}
                                  ></textarea>
                                  {errors.items?.[index]?.itemName && (
                                    <div className="invalid-feedback">
                                      {errors.items[index].itemName.message}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className={`form-control ${
                                      errors.items?.[index]?.quantity ? 'is-invalid' : ''
                                    }`}
                                    placeholder="Jumlah"
                                    {...register(`items.${index}.quantity`, {
                                      required: 'Jumlah wajib diisi',
                                    })}
                                  />
                                  {errors.items?.[index]?.quantity && (
                                    <div className="invalid-feedback">
                                      {errors.items[index].quantity.message}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      errors.items?.[index]?.unit ? 'is-invalid' : ''
                                    }`}
                                    placeholder="Paket/Bulan/Kg/Unit, dll"
                                    {...register(`items.${index}.unit`, {
                                      required: 'Satuan wajib diisi',
                                    })}
                                  />
                                  {errors.items?.[index]?.unit && (
                                    <div className="invalid-feedback">
                                      {errors.items[index].unit.message}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      errors.items?.[index]?.price ? 'is-invalid' : ''
                                    }`}
                                    placeholder="Harga Satuan"
                                    value={formatRupiah(watch(`items.${index}.price`) || '')}
                                    {...register(`items.${index}.price`, {
                                      required: 'Harga Satuan wajib diisi',
                                      validate: (value) => {
                                        const numeric = value.replace(/[^\d]/g, '');
                                        if (!numeric) return 'Harga Satuan wajib berupa angka';
                                        if (numeric <= 0)
                                          return 'Harga Satuan tidak boleh kurang dari atau sama dengan 0';
                                        return true;
                                      },
                                      onChange: (e) => {
                                        const rawValue = e.target.value.replace(/[^\d]/g, ''); // hanya angka
                                        e.target.value = rawValue; // simpan angka mentah di react-hook-form
                                      },
                                    })}
                                    autoComplete="off"
                                  />

                                  {errors.items?.[index]?.price && (
                                    <div className="invalid-feedback">
                                      {errors.items[index].price.message}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <textarea
                                    className="form-control"
                                    placeholder="Keterangan"
                                    {...register(`items.${index}.description`)}
                                  ></textarea>
                                </td>
                                <td className="text-center">
                                  {index > 0 && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => remove(index)}
                                    >
                                      Hapus
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm ms-2"
                                    onClick={() => toggleTax(index)}
                                  >
                                    Pajak
                                  </button>
                                </td>
                              </tr>
                              {taxVisibility[index] && (
                                <tr>
                                  <td colSpan={6}>
                                    {(taxesPerItem[index] || []).map((tax, taxIndex) => (
                                      <div className="row mb-2" key={tax.id}>
                                        <div className="col-md-4">
                                          <select
                                            className={`form-control ${
                                              errors?.items?.[index]?.taxes?.[taxIndex]?.name
                                                ? 'is-invalid'
                                                : ''
                                            }`}
                                            // register pajak
                                            {...register(`items.${index}.taxes.${taxIndex}.name`, {
                                              required: 'Jenis Pajak wajib diisi',
                                              onChange: (e) =>
                                                updateTax(index, taxIndex, 'name', e.target.value),
                                            })}
                                            value={tax.name}
                                          >
                                            <option value="">Pilih Jenis Pajak</option>
                                            <option value="PPN">PPN</option>
                                            <option value="PPh 21">PPh 21</option>
                                            <option value="PPh 23">PPh 23</option>
                                          </select>
                                          {/* <input
                                            className={`form-control ${
                                              errors?.items?.[index]?.taxes?.[taxIndex]?.name
                                                ? 'is-invalid'
                                                : ''
                                            }`}
                                            placeholder="Jenis Pajak"
                                            // register pajak
                                            {...register(`items.${index}.taxes.${taxIndex}.name`, {
                                              required: 'Jenis Pajak wajib diisi',
                                              onChange: (e) =>
                                                updateTax(index, taxIndex, 'name', e.target.value),
                                            })}
                                            value={tax.name}
                                          /> */}
                                          {errors?.items?.[index]?.taxes?.[taxIndex]?.name && (
                                            <div className="invalid-feedback">
                                              {errors.items[index].taxes[taxIndex].name.message}
                                            </div>
                                          )}
                                        </div>
                                        <div className="col-md-3">
                                          <input
                                            type="number"
                                            className={`form-control ${
                                              errors?.items?.[index]?.taxes?.[taxIndex]?.percentage
                                                ? 'is-invalid'
                                                : ''
                                            }`}
                                            placeholder="Persentase (%)"
                                            {...register(
                                              `items.${index}.taxes.${taxIndex}.percentage`,
                                              {
                                                required: 'Persentase wajib diisi',
                                                validate: (value) => {
                                                  // Ganti isNaN dengan Number.isNaN sesuai aturan eslint
                                                  if (!value || Number.isNaN(Number(value)))
                                                    return 'Persentase wajib berupa angka';
                                                  if (Number(value) <= 0)
                                                    return 'Persentase tidak boleh kurang dari atau sama dengan 0';
                                                  return true;
                                                },
                                                onChange: (e) =>
                                                  updateTax(
                                                    index,
                                                    taxIndex,
                                                    'percentage',
                                                    e.target.value,
                                                  ),
                                              },
                                            )}
                                            value={tax.percentage}
                                          />
                                          {errors?.items?.[index]?.taxes?.[taxIndex]
                                            ?.percentage && (
                                            <div className="invalid-feedback">
                                              {
                                                errors.items[index].taxes[taxIndex].percentage
                                                  .message
                                              }
                                            </div>
                                          )}
                                        </div>
                                        <div className="col-md-3">
                                          <select
                                            className={`form-control ${
                                              errors?.items?.[index]?.taxes?.[taxIndex]?.type
                                                ? 'is-invalid'
                                                : ''
                                            }`}
                                            {...register(`items.${index}.taxes.${taxIndex}.type`, {
                                              required: 'Tipe wajib diisi',
                                              onChange: (e) =>
                                                updateTax(index, taxIndex, 'type', e.target.value),
                                            })}
                                            value={tax.type}
                                          >
                                            <option value="increment">Increment</option>
                                            <option value="decrement">Decrement</option>
                                          </select>
                                          {errors?.items?.[index]?.taxes?.[taxIndex]?.type && (
                                            <div className="invalid-feedback">
                                              {errors.items[index].taxes[taxIndex].type.message}
                                            </div>
                                          )}
                                        </div>
                                        <div className="col-md-2">
                                          <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => removeTax(index, taxIndex)}
                                          >
                                            Hapus
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                    {/* Tampilkan tombol tambah pajak hanya jika masih ada pajak */}
                                    {taxesPerItem[index] && taxesPerItem[index].length > 0 && (
                                      <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => addTax(index)}
                                      >
                                        Tambah Pajak
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          append({
                            itemName: '',
                            quantity: '',
                            unit: '',
                            price: '',
                            description: '',
                          })
                        }
                      >
                        Tambah Barang/Jasa
                      </button>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mb-3">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner color="light" size="sm" className="me-1" /> Loading
                      </>
                    ) : (
                      <>{updateClick ? 'Update' : 'Submit'}</>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </CardBody>
      </Card>

      {!isAddForm && (
        <Card>
          <CardBody>
            <div className="mb-3 d-flex align-items-center justify-content-end">
              <input
                type="text"
                className="form-control w-25  me-2"
                placeholder="Cari..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <input
                type="month"
                className="form-control w-auto"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ minWidth: 180 }}
              />
            </div>

            {isLoading ? (
              <div className="text-center">
                <Spinner color="primary" size="sm" className="me-2" /> Sedang Mengambil Data
              </div>
            ) : error ? (
              <div className="text-center">
                <span className="text-danger">Something went wrong</span>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={dataPengajuan}
                pagination
                highlightOnHover
                responsive
                striped
              />
            )}
          </CardBody>
        </Card>
      )}

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Approval Pengajuan</ModalHeader>
        <ModalBody>
          {selectedData && (
            <ListGroup flush>
              {selectedData.map((item, index) => (
                <ListGroupItem className="d-flex justify-content-between align-items-start flex-column">
                  <div className="w-100 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">
                        <strong>{index + 1}.</strong> {item.employe_id} - {item.full_name}
                      </h6>
                      <small className="text-muted">{item.position_name}</small>
                    </div>
                    {item?.status === '1' ? (
                      <div className="d-flex flex-column align-items-end">
                        <span className="badge bg-success rounded-pill">Approved</span>
                        <small className="text-muted">
                          {new Date(item?.updated_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </small>
                      </div>
                    ) : item?.status === '0' ? (
                      <div className="d-flex flex-column align-items-end">
                        <span className="badge bg-danger rounded-pill">Rejected</span>
                        <small className="text-muted">
                          {new Date(item?.updated_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </small>
                      </div>
                    ) : (
                      <div className="d-flex flex-column align-items-end">
                        <span className="badge bg-secondary rounded-pill">Pending</span>
                      </div>
                    )}
                  </div>
                  {item?.status === '0' && item?.keterangan && (
                    <div className="mt-2 w-100">
                      <small>
                        <strong>Alasan Penolakan:</strong> <br />
                        {item.keterangan}
                      </small>
                    </div>
                  )}
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Tutup
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen2} toggle={() => setModalOpen2(!modalOpen2)} size="xl">
        <ModalHeader toggle={() => setModalOpen2(!modalOpen2)}>Detail Pengajuan</ModalHeader>
        <ModalBody>{modalContent2?.body}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen2(false)}>
            Tutup
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PengajuanBiaya;
