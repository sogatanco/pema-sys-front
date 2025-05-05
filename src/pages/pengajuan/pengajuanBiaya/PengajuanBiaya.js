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

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
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

  const addForm = async (e) => {
    e.preventDefault();
    setIsAddForm(true);
  };

  const removeForm = () => {
    reset();
    setUpdateClick(false);
    setIsAddForm(false);
  };

  const onSubmit = async (dataSubmit) => {
    console.log('Data Submit', dataSubmit);
    setLoading(true);
    const formData = new FormData();

    formData.append('jenis_permohonan', dataSubmit.jenis_permohonan);
    formData.append('no_dokumen', dataSubmit.documentNumber);
    formData.append('lampiran', dataSubmit.file[0]);
    formData.append('items', JSON.stringify(dataSubmit.items));

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

    if (row.sub_pengajuan && row.sub_pengajuan.length > 0) {
      row.sub_pengajuan.forEach((item) => {
        append({
          itemName: item.nama_item,
          quantity: item.jumlah,
          unit: item.satuan,
          price: item.biaya_satuan,
          description: item.keterangan,
        });
      });
    }
  };

  const onUpdate = async (dataSubmit) => {
    console.log('Data Submit', dataSubmit);
    setLoading(true);
    const formData = new FormData();

    formData.append('id', dataSubmit.id);
    formData.append('jenis_permohonan', dataSubmit.jenis_permohonan);
    formData.append('no_dokumen', dataSubmit.documentNumber);
    if (dataSubmit.file && dataSubmit.file[0]) {
      formData.append('lampiran', dataSubmit.file[0]);
    }
    formData.append('items', JSON.stringify(dataSubmit.items));

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
                    <tr>
                      <td colSpan={5} className="text-end fw-bold">
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
                            <th style={{ width: '50px' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map((field, index) => (
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
                                  type="number"
                                  className={`form-control ${
                                    errors.items?.[index]?.price ? 'is-invalid' : ''
                                  }`}
                                  placeholder="Harga Satuan"
                                  {...register(`items.${index}.price`, {
                                    required: 'Harga Satuan wajib diisi',
                                  })}
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
                              <td>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => remove(index)}
                                  >
                                    <MaterialIcon icon="delete" fontSize="17" />
                                  </button>
                                )}
                              </td>
                            </tr>
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
                className="form-control w-25"
                placeholder="Cari..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
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
