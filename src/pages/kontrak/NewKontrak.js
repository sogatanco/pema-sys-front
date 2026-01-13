import React, { useState } from "react";
// import { Card, CardHeader, CardBody } from "reactstrap";
import { TextField, Box, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PropTypes from "prop-types";
import Autocomplete from '@mui/material/Autocomplete';
import useAxios from '../../hooks/useAxios';
import { alert } from "../../components/atoms/Toast";



const NewKontrak = ({ employes }) => {
    const [judul, setJudul] = useState('');
    const [partner, setPartner] = useState('');
    const [errors, setErrors] = useState({});
    const [dari, setDari] = useState(null);
    const [sampai, setSampai] = useState(null);
    const [employe, setEmploye] = React.useState(null);
    const api = useAxios();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = {};
        if (!judul) validationErrors.judul = 'Judul Kontrak tidak boleh kosong';
        if (!partner) validationErrors.partner = 'Lengkapi Nama Perusahaan Partner';
        if (!dari) validationErrors.dari = 'Lengkapi tgl Kontrak di mulai';
        if (!sampai) validationErrors.sampai = 'Isi Tgl Berakhir Kontrak';
        if (!employe) validationErrors.employe = 'PIC kontrak tidak boleh kosong';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // susun payload sesuai format PHP yang diminta
        const insert = {
            no_contrac: `CNT-${Date.now()}`,
            vjudul: judul,
            vpartner: partner,
            start: dari ? (dari.format ? dari.format('YYYY-MM-DD') : new Date(dari).toISOString()) : null,
            end: sampai ? (sampai.format ? sampai.format('YYYY-MM-DD') : new Date(sampai).toISOString()) : null,
            pic: employe?.employe_id ,
            created_by: (() => {
                try {
                    const u = JSON.parse(localStorage.getItem('user') || 'null');
                    return u?.id || null;
                } catch (e) {
                    return null;
                }
            })(),
        };

        try {
            const res = await api.post('dapi/kontrak/', insert);
            if (res?.data?.success) {
                alert('success', 'Kontrak berhasil disimpan');
                // reset form
                setJudul('');
                setPartner('');
                setDari(null);
                setSampai(null);
                setEmploye(null);
                setErrors({});
            } else {
                alert('error', `Gagal menyimpan: ${res?.data?.message || JSON.stringify(res?.data)}`);
            }
        } catch (err) {
            alert('error', `Error: ${err?.message || err}`);
        }
    }



    return (
        <>


            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    boxShadow: 'none',
                    margin: 'auto',
                    padding: 2,
                }}
            >
                <TextField
                    label="Judul Kontrak"
                    variant="outlined"
                    type="text"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    error={Boolean(errors.judul)}
                    helperText={errors.judul}
                    fullWidth
                />

                <TextField
                    label="Perusahaan Partner"
                    variant="outlined"
                    type="text"
                    value={partner}
                    onChange={(e) => setPartner(e.target.value)}
                    error={Boolean(errors.partner)}

                    helperText={errors.partner}
                    fullWidth
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        renderInput={(params) => <TextField {...params} />}
                        label="Mulai Kontrak"
                        ampm={false}
                        value={dari}

                        onChange={setDari}
                        slotProps={{
                            textField: {
                                error: Boolean(errors.dari),
                                helperText: errors.dari,
                                fullWidth: true,
                            },
                        }}

                    />
                    <DatePicker
                        renderInput={(params) => <TextField {...params} />}
                        label="Berakhir Kontrak"
                        ampm={false}
                        value={sampai}

                        onChange={setSampai}
                        slotProps={{
                            textField: {
                                error: Boolean(errors.sampai),
                                helperText: errors.sampai,
                                fullWidth: true,
                            },
                        }}

                    />
                </LocalizationProvider>

                <Autocomplete
                    style={{ width: '100%' }}
                    disablePortal
                    id="combo-box-demo"
                    options={employes || []}
                    value={employe}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            const label = newValue;
                            setEmploye({ label });
                        } else if (newValue && newValue.inputValue) {
                            const label = newValue.inputValue;
                            setEmploye({ label });
                        } else {
                            setEmploye(newValue);
                        }
                    }}
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                            return option;
                        }
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        return option.label;
                    }}
                    renderOption={(props, option) => <li {...props}>{option.label}</li>}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Nama PIC"
                            error={Boolean(errors.employe)}
                            helperText={errors.employe}
                        />
                    )} 
                />

                <Button type="submit" variant="contained" color="primary">
                    Tambah Dokumen
                </Button>

            </Box>

        </>
    )
}

NewKontrak.propTypes = {
    employes: PropTypes.array
}

export default NewKontrak;