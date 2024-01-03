import React, { useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import PropTypes from 'prop-types';
import useAxios from '../../../hooks/useAxios';
import useAuth from '../../../hooks/useAuth';
import { alert } from '../../../components/atoms/Toast';

const FormTender = ({ tenderUmum, pascaKualifikasi }) => {
  const { auth } = useAuth();
  const [values, setValues] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    values.user_id = auth.user.employe_id;
    values.pilihan_tender = 'eksternal project';
    values.centang_dok_wajib = documentsCheck;
    values.dok_tender = 'dok tender.pdf';
    values.dok_deskripsi_tender = 'dokdesk tender.pdf';
    await api
      .post('dapi/vendor/tender', values)
      .then(() => alert('success', 'New tender has been created.'))
      .catch(() => {
        alert('error', 'Something went wrong.');
      });
    setIsSubmitting(false);
  };

  return (
    <Row className="mt-3">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="metode_pengadaan">Metode Pengadaan</Label>
              <Input
                type="select"
                name="metode_pengadaan"
                id="metode_pengadaan"
                onChange={handleInput}
                defaultValue=""
              >
                <option value="" disabled>
                  - Pilih -
                </option>
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
                  onChange={handleInput}
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
              <Label htmlFor="nama_tender">Nama Tender</Label>
              <Input type="text" name="nama_tender" id="nama_tender" onChange={handleInput} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="lokasi">Lokasi Pekerjaan</Label>
              <Input type="text" name="lokasi" id="lokasi" onChange={handleInput} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="tgl_pendaftaran">Tanggal Pendaftaran</Label>
              <Input
                type="text"
                name="tgl_pendaftaran"
                id="tgl_pendaftaran"
                onChange={handleInput}
              />
            </FormGroup>
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
                    defaultValue=""
                  >
                    <option value="" disabled></option>
                    <option value="barang">Barang</option>
                    <option value="jasa">Jasa</option>
                    <option value="jasa konstruksi">Jasa Konstruksi</option>
                    <option value="jasa konsultasi">Jasa Konsultasi</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="kbli">Nomor KBLI</Label>
                  <Input type="select" name="kbli" id="kbli" onChange={handleInput} defaultValue="">
                    <option value="" disabled>
                      - Pilih -
                    </option>
                    <option value="12345678">12345678 - ABCD</option>
                  </Input>
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
                  <Label htmlFor="kbli">Nomor KBLI</Label>
                  <Input type="select" name="kbli" id="kbli" onChange={handleInput} defaultValue="">
                    <option value="" disabled>
                      - Pilih -
                    </option>
                    <option value="12345678">12345678 - ABCD</option>
                  </Input>
                </FormGroup>
              </>
            )}
            <FormGroup>
              <Label htmlFor="hps">HPS</Label>
              <Input type="text" name="hps" id="hps" onChange={handleInput} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="dok_tender">Dokumen Tender</Label>
              <Input type="file" name="dok_tender" id="dok_tender" onChange={handleInput} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="dok_deskripsi_tender">Dokumen Deskripsi Tender</Label>
              <Input
                type="file"
                name="dok_deskripsi_tender"
                id="dok_deskripsi_tender"
                onChange={handleInput}
              />
            </FormGroup>
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
                  />
                  <Label check htmlFor="dok_surat_penyampaian_penawaran" className="form-label">
                    Surat Penyampaian Penawaran
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input
                    type="checkbox"
                    id="dok_formulir_isian_kualifikasi"
                    onChange={handleChecked}
                  />
                  <Label check htmlFor="dok_formulir_isian_kualifikasi" className="form-label">
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
                  <Input type="checkbox" id="dok_listmanpower_plus_cv" onChange={handleChecked} />
                  <Label check htmlFor="dok_listmanpower_plus_cv" className="form-label">
                    List Man Power + CV
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="dok_metode_pelaksanaan" onChange={handleChecked} />
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
                  <Label check htmlFor="dok_struktur_organisasi_pekerjaan" className="form-label">
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
                  <Input type="checkbox" id="dok_schedule_pekerjaan" onChange={handleChecked} />
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
                  <Input type="checkbox" id="dok_kelengkapan_izin_usaha" onChange={handleChecked} />
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
                      <Input type="checkbox" id="dok_jaminan_penawaran" onChange={handleChecked} />
                      <Label check htmlFor="dok_jaminan_penawaran" className="form-label">
                        Jaminan Penawaran
                      </Label>
                    </FormGroup>
                  </>
                )}
              </Col>
            </Row>
          </Col>
          {!pascaKualifikasi && (
            <Col lg="6">
              <h4 className="fw-bold">Tahap II</h4>
              <Col md="6">
                <FormGroup check>
                  <Input type="checkbox" id="dok_penawaran_komersial" onChange={handleChecked} />
                  <Label check htmlFor="dok_penawaran_komersial" className="form-label">
                    Surat Penawaran Komersial
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="dok_penawaran_komersial" onChange={handleChecked} />
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
            <Button color="secondary" outline>
              Cancel
            </Button>
            {isSubmitting ? (
              <Button type="button" color="success" disabled>
                <div className="d-flex align-items-center gap-2">
                  <Spinner size="sm" />
                  Menyimpan..
                </div>
              </Button>
            ) : (
              <Button type="submit" color="success" onClick={handleSubmit}>
                Simpan
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Row>
  );
};

FormTender.propTypes = {
  tenderUmum: PropTypes.bool,
  pascaKualifikasi: PropTypes.bool,
};

export default FormTender;
