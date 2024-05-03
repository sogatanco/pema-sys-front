import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from 'reactstrap';
import Select from 'react-select';
import useAxios from '../../../hooks/useAxios';
import getBase64 from '../../../utils/generateFile';
import { alert } from '../../../components/atoms/Toast';

const NewTender = () => {
  const [values, setValues] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenderUmum, setTenderUmum] = useState(true);
  const [pascaKualifikasi, setPaskaKualifikasi] = useState(true);
  const [dokTenderFile, setDokTenderFile] = useState();
  const [dokDeskTenderFile, setDokDeskTenderFile] = useState();
  // const [dokSuratPenyampaianFile, setDokSuratPenyampaianFile] = useState();
  const [dokUntukVendorFile, setDokUntukVendorFile] = useState();
  const [kblis, setKblis] = useState([]);
  const [kblisSelected, setKblisSelected] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [modal, setModal] = useState(false);
  const [jenisPengadaanSelected, setJenisPengadaanSelected] = useState('barang');
  const [companiesToInvite, setCompaniesToInvite] = useState([]);
  const [companySelected, setCompanySelected] = useState([]);

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

  const api = useAxios();

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
    async function fetchTalent() {
      await api
        .get(`dapi/vendor/companies-to-invite?type=${jenisPengadaanSelected}`)
        .then((res) => setCompaniesToInvite(res.data.data))
        .catch((err) => console.log(err));
    }

    fetchTalent();
  }, [jenisPengadaanSelected]);

  useEffect(() => {
    companiesToInvite.unshift({
      label: `Semua Vendor (${companiesToInvite.length})`,
      value: 'all_vendor',
    });
  }, [companiesToInvite]);

  const handleInput = (e) => {
    setValues((prev) => ({
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
    if (e.target.value === 'seleksi_umum' || e.target.value === 'tender_umum') {
      setTenderUmum(true);
    } else {
      setTenderUmum(false);
    }
  };

  const handleSistemKualifikasi = (e) => {
    handleInput(e);
    if (e.target.value === 'pasca kualifikasi') {
      setPaskaKualifikasi(true);
    } else {
      setPaskaKualifikasi(false);
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

  // const handleDokSuratPenyampaian = (val) => {
  //   getBase64(val)
  //     .then((res) => setDokSuratPenyampaianFile(res.split(',')[1]))
  //     .catch((err) => console.log(err));
  // };

  const handleDokUntukVendorFile = (val) => {
    getBase64(val)
      .then((res) => setDokUntukVendorFile(res.split(',')[1]))
      .catch((err) => console.log(err));
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (values) {
      setModal(true);
    } else {
      alert('error', 'Tidak ada data yang di isi');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const theKblis = [];
    kblisSelected.map((item) => theKblis.push(item.value));
    if (values) {
      values.pilihan_tender = 'eksternal project';
      values.centang_dok_wajib = documentsCheck;
      values.dok_tender = dokTenderFile;
      values.dok_deskripsi_tender = dokDeskTenderFile;
      // values.doc_penyampaian_penawaran = dokSuratPenyampaianFile;
      values.dok_untuk_vendor = dokUntukVendorFile;
      values.kbli = theKblis;
      values.company_selected = companySelected;

      await api
        .post('dapi/vendor/tender', values)
        .then(() => {
          alert('success', 'New tender has been created.');
          document.getElementById('new-tender').reset();
        })
        .catch((err) => {
          console.log('ERROR', err);
          alert('error', err.response.data.message);
        });
    } else {
      alert('error', 'Tidak ada data yang diisi');
    }
    setModal(false);
    setIsSubmitting(false);
  };

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <Col lg="12">
      <Card className="">
        <CardBody className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-between">
            <CardTitle tag="h4">New Tender</CardTitle>
            <Link to="projects" style={{ textDecoration: 'none' }}></Link>
          </div>
          <Row className="mt-3">
            <Form onSubmit={handleConfirm} id="new-tender">
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="metode_pengadaan">
                      Metode Pengadaan <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      name="metode_pengadaan"
                      id="metode_pengadaan"
                      onChange={(e) => handleMetodePengadaan(e)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        - Pilih -
                      </option>
                      <option value="seleksi_umum">Seleksi Umum</option>
                      <option value="seleksi_terbatas">Seleksi Terbatas</option>
                      <option value="tender_umum">Tender Umum</option>
                      <option value="tender_terbatas">Tender Terbatas</option>
                    </Input>
                  </FormGroup>
                  {tenderUmum && (
                    <FormGroup>
                      <Label htmlFor="sistem_kualifikasi">
                        Sistem Kualifikasi <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="select"
                        name="sistem_kualifikasi"
                        id="sistem_kualifikasi"
                        onChange={(e) => handleSistemKualifikasi(e)}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          - Pilih -
                        </option>
                        <option value="pasca kualifikasi">Pasca Kualifikasi</option>
                        <option value="pra kualifikasi">Pra Kualifikasi</option>
                      </Input>
                    </FormGroup>
                  )}
                  <FormGroup>
                    <Label htmlFor="nama_tender">
                      Nama Paket Pengadaan <span className="text-danger">*</span>
                    </Label>
                    <Input type="text" name="nama_tender" id="nama_tender" onChange={handleInput} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="lokasi">
                      Lokasi Pekerjaan <span className="text-danger">*</span>
                    </Label>
                    <Input type="text" name="lokasi" id="lokasi" onChange={handleInput} />
                  </FormGroup>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label htmlFor="tgl_pendaftaran">
                          Tanggal Pendaftaran <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="date"
                          name="tgl_pendaftaran"
                          id="tgl_pendaftaran"
                          onChange={handleInput}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label htmlFor="batas_pendaftaran">
                          Batas Pendaftaran <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="date"
                          name="batas_pendaftaran"
                          id="batas_pendaftaran"
                          onChange={handleInput}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* {documentsCheck?.dok_surat_penyampaian_penawaran === true && (
                    <Row>
                      <Col sm="12" md="12">
                        <FormGroup>
                          <Label htmlFor="dok_surat_penyampaian">
                            Dokumen Surat Penyampaian Penawaran
                          </Label>
                          <Input
                            type="file"
                            name="dok_surat_penyampaian"
                            id="dok_surat_penyampaian"
                            onChange={(e) => handleDokSuratPenyampaian(e.target.files[0])}
                            accept="application/pdf"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  )} */}

                  <Row>
                    <Col sm="12" md="12">
                      <FormGroup>
                        <Label htmlFor="dok_untuk_vendor">
                          Upload Template Dokumen Untuk Vendor{' '}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="file"
                          name="dok_untuk_vendor"
                          id="dok_untuk_vendor"
                          onChange={(e) => handleDokUntukVendorFile(e.target.files[0])}
                          accept=".rar"
                        />
                        <small className="text-muted">File format .rar (max. 10mb)</small>
                      </FormGroup>
                    </Col>
                  </Row>

                  {tenderUmum ? (
                    ''
                  ) : (
                    <>
                      <FormGroup>
                        <Label htmlFor="jenis_pengadaan">
                          Jenis Pengadaan <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="select"
                          name="jenis_pengadaan"
                          id="jenis_pengadaan"
                          onChange={(e) => handleInput(e)}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            - Pilih -
                          </option>
                          <option value="barang">Barang</option>
                          <option value="jasa">Jasa</option>
                          <option value="jasa konstruksi">Jasa Konstruksi</option>
                          <option value="jasa konsultasi">Jasa Konsultasi</option>
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="kbli">
                          Nomor KBLI <span className="text-danger">*</span>
                        </Label>
                        <Select
                          closeMenuOnSelect
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
                        <Label htmlFor="jenis_pengadaan">
                          Jenis Pengadaan <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="select"
                          name="jenis_pengadaan"
                          id="jenis_pengadaan"
                          onChange={(e) => handleInput(e)}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            - Pilih -
                          </option>
                          <option value="barang">Barang</option>
                          <option value="jasa">Jasa</option>
                          <option value="jasa konstruksi">Jasa Konstruksi</option>
                          <option value="jasa konsultasi">Jasa Konsultasi</option>
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="kbli">
                          Nomor KBLI <span className="text-danger">*</span>
                        </Label>
                        {/* <Input
                          type="select"
                          name="kbli"
                          id="kbli"
                          onChange={handleInput}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            - Pilih -
                          </option>
                          <option value="12345678">12345678 - ABCD</option>
                        </Input> */}
                        <Select
                          closeMenuOnSelect
                          options={kblis}
                          onChange={(choice) => setKblisSelected(choice)}
                          isMulti
                        />
                      </FormGroup>
                    </>
                  )}
                  <FormGroup>
                    <Label htmlFor="hps">
                      HPS <span className="text-danger">*</span>
                    </Label>
                    <Input type="number" name="hps" id="hps" onChange={handleInput} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="dok_tender">
                      Dokumen Pengadaan <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="file"
                      name="dok_tender"
                      id="dok_tender"
                      onChange={(e) => handleDokTenderFile(e.target.files[0])}
                      accept="application/pdf"
                    />
                    <small className="text-muted">File format .pdf (max. 10mb)</small>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="dok_deskripsi_tender">
                      Deskripsi Pekerjaan <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="file"
                      name="dok_deskripsi_tender"
                      id="dok_deskripsi_tender"
                      onChange={(e) => handleDokDeskTenderFile(e.target.files[0])}
                      accept="application/pdf"
                    />
                    <small className="text-muted">File format .pdf (max. 10mb)</small>
                  </FormGroup>
                  {!tenderUmum && (
                    <>
                      <FormGroup>
                        <Label htmlFor="tipe_penyedia">
                          Tipe Penyedia <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="select"
                          name="tipe_penyedia"
                          id="tipe_penyedia"
                          onChange={(e) => {
                            handleInput(e);
                            setJenisPengadaanSelected(e.target.value);
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            - Pilih -
                          </option>
                          <option value="Barang">Barang</option>
                          <option value="Jasa">Jasa</option>
                          <option value="Barang dan Jasa">Barang & Jasa</option>
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="perusahaan">
                          Perusahaan Yang Diundang <span className="text-danger">*</span>
                        </Label>
                        <Select
                          closeMenuOnSelect
                          options={companiesToInvite}
                          onChange={(choice) => setCompanySelected(choice)}
                          isMulti
                        />
                      </FormGroup>
                    </>
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
                        <Input type="checkbox" id="dok_fakta_integritas" onChange={handleChecked} />
                        <Label check htmlFor="dok_fakta_integritas" className="form-label">
                          Pakta Integritas
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input type="checkbox" id="dok_hse_plan" onChange={handleChecked} />
                        <Label check htmlFor="dok_hse_plan" className="form-label">
                          HSE Plan
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_listmanpower_plus_cv"
                          onChange={handleChecked}
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
                        <Input type="checkbox" id="dok_wajib_lainnya" onChange={handleChecked} />
                        <Label check htmlFor="dok_wajib_lainnya" className="form-label">
                          *Dokumen Wajib Lainnya
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup check>
                        <Input type="checkbox" id="dok_qaqc_plan" onChange={handleChecked} />
                        <Label check htmlFor="dok_qaqc_plan" className="form-label">
                          QA/QC Plan
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input type="checkbox" id="dok_perhitungan_tkdn" onChange={handleChecked} />
                        <Label check htmlFor="dok_perhitungan_tkdn" className="form-label">
                          Perhitungan TKDN
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_schedule_pekerjaan"
                          onChange={handleChecked}
                        />
                        <Label check htmlFor="dok_schedule_pekerjaan" className="form-label">
                          Schedule Pekerjaan
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input type="checkbox" id="dok_list_peralatan" onChange={handleChecked} />
                        <Label check htmlFor="dok_list_peralatan" className="form-label">
                          List Peralatan
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_kelengkapan_izin_usaha"
                          onChange={handleChecked}
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
                        />
                        <Label check htmlFor="dok_penawaran_komersial" className="form-label">
                          Surat Penawaran Komersial
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="dok_penawaran_komersial"
                          onChange={handleChecked}
                        />
                        <Label check htmlFor="dok_penawaran_komersial" className="form-label">
                          Jaminan Penawaran
                        </Label>
                      </FormGroup>
                    </Col>
                  </Col>
                )}
              </Row>
              <div className="d-flex justify-content-end">
                <div className="d-flex gap-3">
                  {isSubmitting ? (
                    <Button type="button" color="success" disabled>
                      <div className="d-flex align-items-center gap-2">
                        <Spinner size="sm" />
                        Menyimpan..
                      </div>
                    </Button>
                  ) : (
                    <Button type="submit" color="success" disabled={values === undefined}>
                      Submit
                    </Button>
                  )}
                </div>
              </div>
              <Modal isOpen={modal} toggle={toggle.bind(null)} centered>
                <ModalHeader>Konfirmasi</ModalHeader>
                <ModalBody>
                  <div className="d-flex flex-row gap-2">
                    <Input
                      id="confirm"
                      type="checkbox"
                      checked={isConfirmed}
                      onChange={(e) => setIsConfirmed(e.target.checked)}
                    />
                    <Label htmlFor="confirm">
                      Silakan cek kembali data pengadaan. Centang jika data sudah benar.
                    </Label>
                  </div>
                </ModalBody>
                <ModalFooter>
                  {isSubmitting ? (
                    <Button type="button" color="success" disabled>
                      <div className="d-flex align-items-center gap-2">
                        <Spinner size="sm" />
                        Menyimpan..
                      </div>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      color="success"
                      onClick={handleSubmit}
                      disabled={!isConfirmed}
                    >
                      Submit
                    </Button>
                  )}
                  <Button color="secondary" outline onClick={toggle.bind(null)}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </Form>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default NewTender;
