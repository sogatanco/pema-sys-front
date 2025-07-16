import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { alert } from '../../components/atoms/Toast';
import useAxios from '../../hooks/useAxios'; // pastikan path sesuai struktur project

const ModalExtend = ({ modalExtend, toggleExtend, sppdDetail, onSubmit }) => {
    const [tujuan, setTujuan] = useState('');
    const [tujuanList, setTujuanList] = useState([]);
    const [mulai, setMulai] = useState(null);
    const [hingga, setHingga] = useState(null);
    const [alasan, setAlasan] = useState('');

    const api = useAxios();

    useEffect(() => {
        if (modalExtend) {
            setTujuan('');
            setMulai(null);
            setHingga(null);
            setAlasan('');
            // Ambil data tujuan berdasarkan sppdDetail.id
            if (sppdDetail?.id) {
                api.get(`dapi/sppd/tujuan/${sppdDetail.id}`).then((res) => {
                    setTujuanList(res.data.data || []);
                });
            } else {
                setTujuanList([]);
            }
        }
    }, [modalExtend]);

    const handleSubmit = () => {
        if (!tujuan || !mulai || !hingga || !alasan) {
            alert('error', 'Tujuan, mulai, hingga, dan alasan harus diisi.');
            return;
        }
        if (dayjs(mulai).isAfter(dayjs(hingga))) {
            alert('error', 'Tanggal mulai tidak boleh lebih besar dari tanggal hingga.');
            return;
        }
        if (onSubmit) {
            onSubmit({
                tujuan,
                mulai: dayjs(mulai).format('YYYY-MM-DD'),
                hingga: dayjs(hingga).format('YYYY-MM-DD'),
                alasan,
            });
        }
    };

    return (
        <Modal isOpen={modalExtend} toggle={toggleExtend} centered>
            <ModalHeader toggle={toggleExtend}>Perpanjang SPPD</ModalHeader>
            <ModalBody>
                {/* Pilihan tujuan SPPD */}
                <FormGroup>
                    <Label for="tujuan">Tujuan SPPD</Label>
                    <Input
                        id="tujuan"
                        type="select"
                        value={tujuan}
                        onChange={e => setTujuan(e.target.value)}
                    >
                        <option value="">Pilih tujuan</option>
                        {tujuanList.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.detail_tujuan}
                            </option>
                        ))}
                    </Input>
                </FormGroup>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="mulai">Mulai</Label>
                                <DatePicker
                                    value={mulai}
                                    onChange={setMulai}
                                    renderInput={(params) => (
                                        <Input
                                            {...params}
                                            id="mulai"
                                            type="text"
                                            style={{ background: '#fff' }}
                                            placeholder="Pilih tanggal mulai"
                                            readOnly
                                        />
                                    )}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="hingga">Hingga</Label>
                                <DatePicker
                                    value={hingga}
                                    onChange={setHingga}
                                    renderInput={(params) => (
                                        <Input
                                            {...params}
                                            id="hingga"
                                            type="text"
                                            style={{ background: '#fff' }}
                                            placeholder="Pilih tanggal hingga"
                                            readOnly
                                        />
                                    )}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </LocalizationProvider>
                <FormGroup>
                    <Label for="alasan">Alasan</Label>
                    <Input
                        id="alasan"
                        type="textarea"
                        value={alasan}
                        onChange={e => setAlasan(e.target.value)}
                        placeholder="Masukkan alasan perpanjangan Ex: Masih mendampingi tim PT PEMA"
                        style={{ minHeight: 80 }}
                    />
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>Submit</Button>
                <Button color="secondary" onClick={toggleExtend}>Batal</Button>
            </ModalFooter>
        </Modal>
    );
};

ModalExtend.propTypes = {
    modalExtend: PropTypes.bool.isRequired,
    toggleExtend: PropTypes.func.isRequired,
    sppdDetail: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    onSubmit: PropTypes.func,
};

export default ModalExtend;
