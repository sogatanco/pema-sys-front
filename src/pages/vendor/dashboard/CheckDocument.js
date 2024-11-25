/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';

const fields = [
  {
    id: 0,
    title: 'Surat Penyampaian Penawaran',
    name: 'dok_surat_penyampaian_penawaran',
  },
  {
    id: 1,
    title: 'Formulir Isian Kualifikasi',
    name: 'dok_formulir_isian_kualifikasi',
  },
  {
    id: 2,
    title: 'Fakta Integritas',
    name: 'dok_fakta_integritas',
  },
  {
    id: 3,
    title: 'HSE Plan',
    name: 'dok_hse_plan',
  },
  {
    id: 4,
    title: 'Jaminan Penawaran',
    name: 'dok_jaminan_penawaran',
  },
  {
    id: 5,
    title: 'Kelengkapan Izin Usaha',
    name: 'dok_kelengkapan_izin_usaha',
  },
  {
    id: 6,
    title: 'List Peralatan',
    name: 'dok_list_peralatan',
  },
  {
    id: 7,
    title: 'List Man Power + CV',
    name: 'dok_listmanpower_plus_cv',
  },
  {
    id: 8,
    title: 'Metode Pelaksanaan (Jasa)',
    name: 'dok_metode_pelaksanaan',
  },
  {
    id: 9,
    title: 'Surat Penawaran Komersial',
    name: 'dok_penawaran_komersial',
  },
  {
    id: 10,
    title: 'Perhitungan TKDN',
    name: 'dok_perhitungan_tkdn',
  },
  {
    id: 11,
    title: 'QA/QC Plan',
    name: 'dok_qaqc_plan',
  },
  {
    id: 12,
    title: 'Schedule Pekerjaan',
    name: 'dok_schedule_pekerjaan',
  },
  {
    id: 13,
    title: 'Struktur Organisasi Pekerjaan',
    name: 'dok_struktur_organisasi_pekerjaan',
  },
  {
    id: 14,
    title: '*Dokumen Wajib Lainnya',
    name: 'dok_wajib_lainnya',
  },
];

const fieldsTahap2 = [
  {
    id: 0,
    title: 'Jaminan Penawaran',
    name: 'dok_jaminan_penawaran',
  },
  {
    id: 2,
    title: 'Surat Penawaran Komersial',
    name: 'dok_penawaran_komersial',
  },
];

const API_URL = process.env.REACT_APP_BASEURL;

const CheckDocument = ({
  modal6,
  toggle6,
  selectedCompanyName,
  tender,
  selectedCompanyData,
  selectedStage,
}) => {
  const [documentsCheck, setDocumentsCheck] = useState({});
  const [fieldsActive, setFieldsActive] = useState(fields);

  useEffect(() => {
    setDocumentsCheck(tender?.centang_dok_wajib && JSON.parse(tender?.centang_dok_wajib));
  }, [tender]);

  useEffect(() => {
    if (selectedStage === 'Tahap II') {
      setFieldsActive(fieldsTahap2);
    } else {
      setFieldsActive(fields);
    }
  }, [selectedStage]);

  return (
    <Modal isOpen={modal6} toggle={toggle6.bind(null)} centered size="lg">
      <ModalHeader toggle={toggle6.bind(null)}>
        <div className="d-flex flex-column">
          <span className="fw-bold">{selectedCompanyName}</span>
          <small>Cek Dokumen {selectedStage}</small>
        </div>
      </ModalHeader>
      <ModalBody>
        <Table bordered hover>
          <tbody>
            {fieldsActive.map((field) =>
              Object.keys(documentsCheck).map(
                (key) =>
                  field.name === key &&
                  documentsCheck[key] === true && (
                    <tr key={field.id}>
                      <td>{field?.title}</td>
                      <td style={{ textAlign: 'center' }}>
                        {selectedCompanyData !== undefined && (
                          <Link
                            to={`${API_URL}vendor_file/${selectedCompanyData[key]}`}
                            target="blank"
                          >
                            <Button color="secondary" outline size="sm">
                              Download
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ),
              ),
            )}
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
};

export default CheckDocument;
