import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from 'reactstrap';
import Select from 'react-select';
import MaterialIcon from '@material/react-material-icon';
import { Link, useParams } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import { alert } from '../../../components/atoms/Toast';
import getBase64 from '../../../utils/generateFile';

const EditTender = () => {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [tenderTemp, setTenderTemp] = useState();
  const [tenderUmum, setTenderUmum] = useState(false);
  const [pascaKualifikasi, setPascaKualifikasi] = useState(false);
  const [dokTenderHidden, setDokTenderHidden] = useState(true);
  const [dokDeskTenderHidden, setDokDeskTenderHidden] = useState(true);
  const [dokTenderFile, setDokTenderFile] = useState();
  const [dokDeskTenderFile, setDokDeskTenderFile] = useState();
  const [kblis, setKblis] = useState([]);
  const [kblisSelected, setKblisSelected] = useState([]);
  const [documentsCheck, setDocumentsCheck] = useState({
    dok_fakta_integritas: false,
    dok_formulir_isian_kualifikasi: false,
    dok_hse_plan: false,
    dok_jaminan_penawaran: false,
    dok_kelengkapan_izin_usaha: false,
    dok_list_peralatan: false,
    dok_listmanpower_plus_cv: false,
    dok_metode_pelaksanaan: false,
    dok_penawaran_komersial: false,
    dok_perhitungan_tkdn: false,
    dok_qaqc_plan: false,
    dok_schedule_pekerjaan: false,
    dok_struktur_organisasi_pekerjaan: false,
    dok_surat_penyampaian_penawaran: false,
    dok_wajib_lainnya: false,
  });

  const baseURL = process.env.REACT_APP_BASEURL;

  const api = useAxios();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['tenderbyid'],
    queryFn: () =>
      api.get(`dapi/vendor/tender/${id}`).then((res) => {
        return res.data.data;
      }),
  });

  useEffect(() => {
    async function fetchKblis() {
      await api
        .get('dapi/vendor/masterkbli')
        .then((res) => setKblis(res.data.data))
        .catch((err) => console.log(err));
    }
    fetchKblis();
  }, []);

  useEffect(() => {
    setTenderTemp(data);
    if (data?.metode_pengadaan === 'umum' || data?.metode_pengadaan === 'terbatas') {
      setTenderUmum(true);
      if (data?.sistem_kualifikasi === 'pasca kualifikasi') {
        setPascaKualifikasi(true);
      } else {
        setPascaKualifikasi(false);
      }
    } else {
      setTenderUmum(false);
    }
    setDocumentsCheck(data?.centang_dok_wajib && JSON.parse(data?.centang_dok_wajib));
  }, [data]);

  const handleInput = (e) => {
    setTenderTemp((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChecked = (e) => {
    setDocumentsCheck((prev) => ({
      ...prev,
      [e.target.id]: e.target.checked,
    }));
  };

  const handleMetodePengadaan = (e) => {
    handleInput(e);
    if (e.target.value === 'umum' || e.target.value === 'terbatas') {
      setTenderUmum(true);
    } else {
      setTenderUmum(false);
    }
  };

  const handleSistemKualifikasi = (e) => {
    handleInput(e);
    if (e.target.value === 'pasca kualifikasi') {
      setPascaKualifikasi(true);
    } else {
      setPascaKualifikasi(false);
    }
  };

  const handleDokTenderFile = (val) => {
    getBase64(val)
      .then((res) => setDokTenderFile(res.split(',')[1]))
      .catch((err) => console.log(err));
  };

  const handleDokDeskTenderFile = (val) => {
    getBase64(val)
      .then((res) => setDokDeskTenderFile(res.split(',')[1]))
      .catch((err) => console.log(err));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const theKblis = [];
    kblisSelected.map((item) => theKblis.push(item.value));
    tenderTemp.id = tenderTemp?.id_tender;
    tenderTemp.centang_dok_wajib = documentsCheck;
    tenderTemp.dok_tender = dokTenderFile;
    tenderTemp.dok_deskripsi_tender = dokDeskTenderFile;
    tenderTemp.kbli = theKblis;

    await api
      .post('dapi/vendor/tender/update', tenderTemp)
      .then(() => {
        alert('success', 'Tender updated successfully.');
        refetch();
      })
      .catch(() => {
        alert('error', 'Something went wrong.');
      });
    setDokTenderHidden(true);
    setDokDeskTenderHidden(true);
    setIsSaving(false);
  };

  return (
    <Col lg="12">
      <Card>
        <CardBody className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-between">
            <CardTitle tag="h4" className="fw-bold">
              {data?.nama_tender || '..'}
              <br />
              <small style={{ fontWeight: 'lighter' }}>Update Tender</small>
            </CardTitle>
            <Link to="projects" style={{ textDecoration: 'none' }}></Link>
          </div>
          {isLoading ? (
            'Loading..'
          ) : (
            <Form onSubmit={handleSave}>
              <Row lg="12">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="metode_pengadaan">Metode Pengadaan</Label>
                    <Input
                      type="select"
                      name="metode_pengadaan"
                      id="metode_pengadaan"
                      onChange={(e) => {
                        handleMetodePengadaan(e);
                      }}
                      value={tenderTemp?.metode_pengadaan || ''}
                    >
                      <option value="umum">Umum</option>
                      <option value="terbatas">Terbatas</option>
                      <option value="pengadaan langsung">Pengadaan Langsung</option>
                      <option value="penunjukkan langsung">Penunjukkan Langsung</option>
                    </Input>
                  </FormGroup>
                  {tenderUmum && (
                    <FormGroup>
                      <Label htmlFor="sistem_kualifikasi">Sistem Kualifikasi</Label>
                      <Input
                        type="select"
                        name="sistem_kualifikasi"
                        id="sistem_kualifikasi"
                        onChange={(e) => handleSistemKualifikasi(e)}
                        value={tenderTemp?.sistem_kualifikasi || ''}
                      >
                        <option value="pasca kualifikasi">Pasca Kualifikasi</option>
                        <option value="pra kualifikasi">Pra Kualifikasi</option>
                      </Input>
                    </FormGroup>
                  )}
                  <FormGroup>
                    <Label htmlFor="nama_tender">Nama Tender</Label>
                    <Input
                      type="text"
                      name="nama_tender"
                      id="nama_tender"
                      value={tenderTemp?.nama_tender || ''}
                      onChange={handleInput}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="lokasi">Lokasi Pekerjaan</Label>
                    <Input
                      type="text"
                      name="lokasi"
                      id="lokasi"
                      value={tenderTemp?.lokasi || ''}
                      onChange={handleInput}
                    />
                  </FormGroup>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="tgl_pendaftaran">Tanggal Pendaftaran</Label>
                        <Input
                          type="date"
                          name="tgl_pendaftaran"
                          id="tgl_pendaftaran"
                          value={tenderTemp?.tgl_pendaftaran || ''}
                          onChange={handleInput}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="batas_pendaftaran">Batas Pendaftaran</Label>
                        <Input
                          type="date"
                          name="batas_pendaftaran"
                          id="batas_pendaftaran"
                          value={tenderTemp?.batas_pendaftaran || ''}
                          onChange={handleInput}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {tenderUmum ? (
                    ''
                  ) : (
                    <>
                      <FormGroup>
                        <Label htmlFor="jenis_pengadaan">Jenis Pengadaan</Label>
                        <Input
                          type="select"
                          name="jenis_pengadaan"
                          id="jenis_pengadaan"
                          onChange={handleInput}
                          value={tenderTemp?.jenis_pengadaan || ''}
                        >
                          <option value="barang">Barang</option>
                          <option value="jasa">Jasa</option>
                          <option value="jasa konstruksi">Jasa Konstruksi</option>
                          <option value="jasa konsultasi">Jasa Konsultasi</option>
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="kbli">Nomor KBLI</Label>
                        <Select
                          closeMenuOnSelect
                          defaultValue={data?.kbli_list}
                          options={kblis}
                          onChange={(choice) => setKblisSelected(choice)}
                          isMulti
                        />
                      </FormGroup>
                    </>
                  )}
                </Col>
                <Col md="6">
                  {tenderUmum && (
                    <>
                      <FormGroup>
                        <Label htmlFor="jenis_pengadaan">Jenis Pengadaan</Label>
                        <Input
                          type="select"
                          name="jenis_pengadaan"
                          id="jenis_pengadaan"
                          onChange={handleInput}
                          value={tenderTemp?.jenis_pengadaan || ''}
                        >
                          <option value="barang">Barang</option>
                          <option value="jasa">Jasa</option>
                          <option value="jasa konstruksi">Jasa Konstruksi</option>
                          <option value="jasa konsultasi">Jasa Konsultasi</option>
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="kbli">Nomor KBLI</Label>
                        <Select
                          closeMenuOnSelect
                          defaultValue={data?.kbli_list}
                          options={kblis}
                          onChange={(choice) => setKblisSelected(choice)}
                          isMulti
                        />
                      </FormGroup>
                    </>
                  )}
                  <FormGroup>
                    <Label htmlFor="hps">HPS</Label>
                    <Input
                      type="text"
                      name="hps"
                      id="hps"
                      value={tenderTemp?.hps || ''}
                      onChange={handleInput}
                    />
                  </FormGroup>
                  <Row>
                    <Col md="10">
                      <FormGroup>
                        <Label htmlFor="dok_tender">Dokumen Tender</Label>
                        {!dokTenderHidden ? (
                          <Input
                            type="file"
                            name="dok_tender"
                            id="dok_tender"
                            onChange={(e) => handleDokTenderFile(e.target.files[0])}
                            accept="application/pdf"
                          />
                        ) : (
                          <Col className="py-2">
                            <Link
                              to={`${baseURL}vendor_file/tender/${tenderTemp?.id_tender}/${tenderTemp?.dok_tender}`}
                              target="_blank"
                            >
                              File Dokumen Tender
                            </Link>
                          </Col>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="2" className="d-flex justify-content-end align-items-center pt-4">
                      <button type="button" style={{ border: 'none', background: 'none' }}>
                        <MaterialIcon
                          icon={`${dokTenderHidden ? 'edit' : 'close'}`}
                          onClick={() => {
                            setDokTenderHidden(!dokTenderHidden);
                            setDokTenderFile();
                          }}
                          className="text-muted"
                          style={{ fontSize: '20px' }}
                        />
                      </button>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="10">
                      <FormGroup>
                        <Label htmlFor="dok_deskripsi_tender">Dokumen Deskripsi Tender</Label>
                        {!dokDeskTenderHidden ? (
                          <Input
                            type="file"
                            name="dok_deskripsi_tender"
                            id="dok_deskripsi_tender"
                            onChange={(e) => handleDokDeskTenderFile(e.target.files[0])}
                            accept="application/pdf"
                          />
                        ) : (
                          <Col className="py-2">
                            <Link
                              to={`${baseURL}vendor_file/tender/${tenderTemp?.id_tender}/${tenderTemp?.dok_deskripsi_tender}`}
                              target="_blank"
                            >
                              File Dokumen Deskripsi Tender
                            </Link>
                          </Col>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="2" className="d-flex justify-content-end align-items-center pt-4">
                      <button type="button" style={{ border: 'none', background: 'none' }}>
                        <MaterialIcon
                          icon={`${dokDeskTenderHidden ? 'edit' : 'close'}`}
                          onClick={() => {
                            setDokDeskTenderHidden(!dokDeskTenderHidden);
                            setDokDeskTenderFile();
                          }}
                          className="text-muted"
                          style={{ fontSize: '20px' }}
                        />
                      </button>
                    </Col>
                  </Row>
                  {!tenderUmum && (
                    <FormGroup>
                      <Label htmlFor="perusahaan">Perusahaan Yang Ditunjuk</Label>
                      <Input type="select" name="perusahaan" id="perusahaan" onChange={handleInput}>
                        <option value="">ambil dari db</option>
                      </Input>
                    </FormGroup>
                  )}
                </Col>
              </Row>

              <Row lg="12" className="mt-3">
                <Col lg="6">
                  <h4 className="fw-bold">
                    {tenderUmum && !pascaKualifikasi ? 'Tahap I' : 'Dokumen Yang Diwajibkan'}
                  </h4>
                  <Row>
                    <Col md="6">
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_surat_penyampaian_penawaran"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_surat_penyampaian_penawaran || ''}
                        />
                        <Label
                          check
                          htmlFor="dok_surat_penyampaian_penawaran"
                          className="form-label"
                        >
                          Surat Penyampaian Penawaran
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_formulir_isian_kualifikasi"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_formulir_isian_kualifikasi || ''}
                        />
                        <Label
                          check
                          htmlFor="dok_formulir_isian_kualifikasi"
                          className="form-label"
                        >
                          Formulir Isian Kualifikasi
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_fakta_integritas"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_fakta_integritas || ''}
                        />
                        <Label check htmlFor="dok_fakta_integritas" className="form-label">
                          Pakta Integritas
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_hse_plan"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_hse_plan || ''}
                        />
                        <Label check htmlFor="dok_hse_plan" className="form-label">
                          HSE Plan
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_listmanpower_plus_cv"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_listmanpower_plus_cv || ''}
                        />
                        <Label check htmlFor="dok_listmanpower_plus_cv" className="form-label">
                          List Man Power + CV
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_metode_pelaksanaan"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_metode_pelaksanaan || ''}
                        />
                        <Label check htmlFor="dok_metode_pelaksanaan" className="form-label">
                          Metode Pelaksanaan (Jasa)
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_struktur_organisasi_pekerjaan"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_struktur_organisasi_pekerjaan || ''}
                        />
                        <Label
                          check
                          htmlFor="dok_struktur_organisasi_pekerjaan"
                          className="form-label"
                        >
                          Struktur Organisasi Pekerjaan
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_wajib_lainnya"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_wajib_lainnya || ''}
                        />
                        <Label check htmlFor="dok_wajib_lainnya" className="form-label">
                          *Dokumen Wajib Lainnya
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_qaqc_plan"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_qaqc_plan || ''}
                        />
                        <Label check htmlFor="dok_qaqc_plan" className="form-label">
                          QA/QC Plan
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_perhitungan_tkdn"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_perhitungan_tkdn || ''}
                        />
                        <Label check htmlFor="dok_perhitungan_tkdn" className="form-label">
                          Perhitungan TKDN
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_schedule_pekerjaan"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_schedule_pekerjaan || ''}
                        />
                        <Label check htmlFor="dok_schedule_pekerjaan" className="form-label">
                          Schedule Pekerjaan
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_list_peralatan"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_list_peralatan || ''}
                        />
                        <Label check htmlFor="dok_list_peralatan" className="form-label">
                          List Peralatan
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_kelengkapan_izin_usaha"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_kelengkapan_izin_usaha || ''}
                        />
                        <Label check htmlFor="dok_kelengkapan_izin_usaha" className="form-label">
                          Kelengkapan Izin Usaha
                        </Label>
                      </FormGroup>

                      {pascaKualifikasi && (
                        <>
                          <FormGroup check>
                            <Input
                              type="checkbox"
                              id="dok_penawaran_komersial"
                              onChange={handleChecked}
                              checked={documentsCheck?.dok_penawaran_komersial || ''}
                            />
                            <Label check htmlFor="dok_penawaran_komersial" className="form-label">
                              Surat Penawaran Komersial
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Input
                              type="checkbox"
                              id="dok_jaminan_penawaran"
                              onChange={handleChecked}
                              checked={documentsCheck?.dok_jaminan_penawaran || ''}
                            />
                            <Label check htmlFor="dok_jaminan_penawaran" className="form-label">
                              Jaminan Penawaran
                            </Label>
                          </FormGroup>
                        </>
                      )}
                    </Col>
                  </Row>
                </Col>
                {!pascaKualifikasi && tenderUmum && (
                  <Col lg="6">
                    <h4 className="fw-bold">Tahap II</h4>
                    <Col md="6">
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_penawaran_komersial"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_penawaran_komersial || ''}
                        />
                        <Label check htmlFor="dok_penawaran_komersial" className="form-label">
                          Surat Penawaran Komersial
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_jaminan_penawaran"
                          onChange={handleChecked}
                          checked={documentsCheck?.dok_jaminan_penawaran || ''}
                        />
                        <Label check htmlFor="dok_jaminan_penawaran" className="form-label">
                          Jaminan Penawaran
                        </Label>
                      </FormGroup>
                    </Col>
                  </Col>
                )}
              </Row>
              <div className="d-flex justify-content-end">
                <div className="d-flex gap-3">
                  <Link to="/vendor">
                    <Button type="button" color="secondary" outline>
                      Cancel
                    </Button>
                  </Link>
                  {isSaving ? (
                    <Button type="button" color="success" disabled>
                      <div className="d-flex align-items-center gap-2">
                        <Spinner size="sm" />
                        Menyimpan..
                      </div>
                    </Button>
                  ) : (
                    <Button type="submit" color="success">
                      Update
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default EditTender;
