import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "react-data-table-component";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TextField, Box, Button, MenuItem, Typography, FormControl, InputLabel, Select } from "@mui/material";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS for react-confirm-alert
import { alert } from '../../components/atoms/Toast';
import useAxios from "../../hooks/useAxios";



const Setting = () => {

    const api = useAxios();

    const [kendaraans, setKendaraans] = useState([]);

    const [brand, setBrand] = React.useState("");
    const [plat, setPlat] = React.useState("");
    const [status, setStatus] = React.useState("");

    const [errors, setErrors] = useState({});

    const getKendaraan = () => {
        api.get('dapi/mobil/get').then(res => {
            if (res.data.success) {
                setKendaraans(res.data.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = {};
        if (!brand) validationErrors.brand = 'Brand Kendaraan is required';
        if (!plat) validationErrors.plat = 'Plat Kendaraan is required';
        if (!status) validationErrors.status = 'Status Kendaraan is required';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        await api.post('dapi/mobil/insert', { brand, plat, status }).then(res => {
            if (res.data.success) {
                alert('success', 'Data berhasil disimpan');
                setBrand('');
                setPlat('');
                setStatus('');
                getKendaraan();
            } else {
                alert('error', 'Data gagal disimpan');
            }
        }).catch(err => {
            console.log(err);
            alert('error', 'Terjadi kesalahan saat menyimpan data');
        });
        setErrors({}); // Reset errors after submission
    }

    const handleChange = (id, st) => {
        api.post(`dapi/mobil/update/${id}`, { status: st === 'aktif' ? 'non-aktif' : 'aktif' }).then(res => {
            if (res.data.success) {
                alert('success', 'Status berhasil diubah');
                getKendaraan();
            } else {
                alert('error', 'Status gagal diubah');
            }
        }).catch(err => {
            console.log(err);
            alert('error', 'Terjadi kesalahan saat mengubah status');
        });
    }

    const del = (id) => {
        confirmAlert({
            title: 'Konfirmasi Hapus',
            message: 'Apakah Anda yakin ingin menghapus data ini?',
            buttons: [
                {
                    label: 'Ya',
                    onClick: () => {
                        api.post(`dapi/mobil/delete/${id}`).then(res => {
                            if (res.data.success) {
                                alert('success', 'Data berhasil dihapus');
                                getKendaraan();
                            } else {
                                alert('error', 'Data gagal dihapus');
                            }
                        }).catch(err => {
                            console.log(err);
                            alert('error', 'Terjadi kesalahan saat menghapus data');
                        });
                    }
                },
                {
                    label: 'Tidak',
                    onClick: () => {}
                }
            ]
        });
    }


    React.useEffect(() => {
        getKendaraan();
    }, []);

    const columns = [
        {
            name: "No",
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: "Brand Kendaraan",
            selector: (row) => row.brand,
            sortable: true,
        },
        {
            name: "Plat Kendaraan",
            selector: (row) => row.plat,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => (
                <FormControlLabel
                    control={
                        <Switch
                            checked={row.status === 'aktif'}
                            onChange={() => handleChange(row.id, row.status)}
                            color="primary"
                        />
                    }
                    label={row.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                />
            ),
        },

        {
            name: "Action",
            selector: (row) => (
                <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        del(row.id);
                    }}
                >
                    Hapus
                </Button>
            ),
        }
    ];
    return (
        <>
            <Card>
                <CardHeader>
                    <strong>Management Kendaraan Operasional</strong>
                </CardHeader>
                <CardBody>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        autoComplete="off"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            margin: 'auto',
                            padding: 2,
                        }}
                    >
                        <TextField
                            label="Merek Kendaraan"
                            variant="outlined"
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            error={Boolean(errors.brand)}
                            helperText={errors.brand}
                            fullWidth
                        />

                        <TextField
                            label="Plat Kendaraan"
                            variant="outlined"
                            type="text"
                            value={plat}
                            onChange={(e) => setPlat(e.target.value)}
                            error={Boolean(errors.plat)}
                            
                            helperText={errors.plat}
                            fullWidth
                        />

                        <FormControl fullWidth error={Boolean(errors.status)}>
                            <InputLabel id="unit-kendaraan-label">Status</InputLabel>
                            <Select
                                labelId="unit-kendaraan-label"
                                id="unit-kendaraan"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                label="Unit Kendaraan"
                            >

                                <MenuItem value="aktif">
                                    Aktif
                                </MenuItem>
                                <MenuItem value="non-aktif">
                                    Non-Aktif
                                </MenuItem>

                            </Select>
                            {errors.status && <Typography color="error">{errors.status}</Typography>}
                        </FormControl>


                        <Button type="submit" variant="contained" color="primary">
                            Tambah Data Kendaraan
                        </Button>
                    </Box>

                    <DataTable
                        className="mt-3"
                        columns={columns}
                        data={kendaraans}
                        pagination
                        highlightOnHover
                        pointerOnHover
                        striped
                        responsive
                    />

                </CardBody>
            </Card>
        </>
    );
};

export default Setting;