import React from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import PropTypes from 'prop-types';

const FormTender = ({ tenderUmum, pascaKualifikasi }) => {
  return (
    <Row className="mt-3">
      <Form>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="metode">Metode Pengadaan</Label>
              <Input type="select" name="metode" id="metode">
                <option value="umur">Umum</option>
                <option value="terbatas">Terbatas</option>
                <option value="pengadaan langsung">Pengadaan Langsung</option>
                <option value="penunjukkan langsung">Penunjukkan Langsung</option>
              </Input>
            </FormGroup>
            {tenderUmum && (
              <FormGroup>
                <Label htmlFor="sistem_kualifikasi">Sistem Kualifikasi</Label>
                <Input type="select" name="sistem_kualifikasi" id="sistem_kualifikasi">
                  <option value="pasca kualifikasi">Pasca Kualifikasi</option>
                  <option value="pra kualifikasi">Pra Kualifikasi</option>
                </Input>
              </FormGroup>
            )}
            <FormGroup>
              <Label htmlFor="nama_tender">Nama Tender</Label>
              <Input type="text" name="nama_tender" id="nama_tender" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="lokasi">Lokasi Pekerjaan</Label>
              <Input type="text" name="lokasi" id="lokasi" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="tgl_pendaftaran">Tanggal Pendaftaran</Label>
              <Input type="text" name="tgl_pendaftaran" id="tgl_pendaftaran" />
            </FormGroup>
            {tenderUmum ? (
              <FormGroup>
                <Label htmlFor="masa_sanggah">Masa Sanggah</Label>
                <Input type="select" name="masa_sanggah" id="masa_sanggah">
                  <option value="ada">Ada</option>
                  <option value="tidak ada">Tidak Ada</option>
                </Input>
              </FormGroup>
            ) : (
              <>
                <FormGroup>
                  <Label htmlFor="tipe_penyedia">Tipe Penyedia</Label>
                  <Input type="select" name="tipe_penyedia" id="tipe_penyedia">
                    <option value="barang">Barang</option>
                    <option value="jasa">Jasa</option>
                    <option value="barang dan jasa">barang dan Jasa</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="bidang_usaha">Bidang Usaha Penyedia</Label>
                  <Input type="select" name="bidang_usaha" id="bidang_usaha">
                    <option value="barang">ambil dari db</option>
                  </Input>
                </FormGroup>
              </>
            )}
          </Col>
          <Col md="6">
            {tenderUmum && (
              <>
                <FormGroup>
                  <Label htmlFor="tipe_penyedia">Tipe Penyedia</Label>
                  <Input type="select" name="tipe_penyedia" id="tipe_penyedia">
                    <option value="barang">Barang</option>
                    <option value="jasa">Jasa</option>
                    <option value="barang dan jasa">barang dan Jasa</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="bidang_usaha">Bidang Usaha Penyedia</Label>
                  <Input type="select" name="bidang_usaha" id="bidang_usaha">
                    <option value="barang">ambil dari db</option>
                  </Input>
                </FormGroup>
              </>
            )}
            <FormGroup>
              <Label htmlFor="hps">HPS</Label>
              <Input type="text" name="hps" id="hps" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="kbli">NIB Penyedia</Label>
              <Input type="select" name="kbli" id="kbli">
                <option value="">ambil dari db</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="dok_tender">Dokumen Tender</Label>
              <Input type="file" name="dok_tender" id="dok_tender" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="dok_deskripsi_tender">Dokumen Deskripsi Tender</Label>
              <Input type="file" name="dok_deskripsi_tender" id="dok_deskripsi_tender" />
            </FormGroup>
            {!tenderUmum && (
              <FormGroup>
                <Label htmlFor="perusahaan">Perusahaan Yang Ditunjuk</Label>
                <Input type="select" name="perusahaan" id="perusahaan">
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
                  <Input type="checkbox" id="check1" />
                  <Label check htmlFor="check1" className="form-label">
                    Surat Penyampaian Penawaran
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check2" />
                  <Label check htmlFor="check2" className="form-label">
                    Formulir Isian Kualifikasi
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check3" />
                  <Label check htmlFor="check3" className="form-label">
                    Pakta Integritas
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check4" />
                  <Label check htmlFor="check4" className="form-label">
                    HSE Plan
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check5" />
                  <Label check htmlFor="check5" className="form-label">
                    List Man Power + CV
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check6" />
                  <Label check htmlFor="check6" className="form-label">
                    Metode Pelaksanaan (Jasa)
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check7" />
                  <Label check htmlFor="check7" className="form-label">
                    Struktur Organisasi Pekerjaan
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check8" />
                  <Label check htmlFor="check8" className="form-label">
                    *Dokumen Wajib Lainnya
                  </Label>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup check>
                  <Input type="checkbox" id="check9" />
                  <Label check htmlFor="check9" className="form-label">
                    QA/QC Plan
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check10" />
                  <Label check htmlFor="check10" className="form-label">
                    Perhitungan TKDN
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check11" />
                  <Label check htmlFor="check11" className="form-label">
                    Schedule Pekerjaan
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check12" />
                  <Label check htmlFor="check12" className="form-label">
                    List Peralatan
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check13" />
                  <Label check htmlFor="check13" className="form-label">
                    Kelengkapan Izin Usaha
                  </Label>
                </FormGroup>

                {pascaKualifikasi && (
                  <>
                    <FormGroup check>
                      <Input type="checkbox" id="check14" />
                      <Label check htmlFor="check14" className="form-label">
                        Surat Penawaran Komersial
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Input type="checkbox" id="check15" />
                      <Label check htmlFor="check15" className="form-label">
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
                  <Input type="checkbox" id="check14" />
                  <Label check htmlFor="check14" className="form-label">
                    Surat Penawaran Komersial
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="check15" />
                  <Label check htmlFor="check15" className="form-label">
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
            <Button color="success">Simpan</Button>
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
