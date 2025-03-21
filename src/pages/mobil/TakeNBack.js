import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Alert } from "reactstrap";
import { Box, TextField, Autocomplete, Button, MenuItem } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import useAxios from "../../hooks/useAxios";

const TakeNBack = () => {
    const api = useAxios();
    const [employe, setEmploye] = useState(null);
    const [employes, setEmployes] = useState([]);
    const [sampai, setSampai] = useState(null);
    const [mobil, setMobil] = useState('');
    const [book, setBook] = useState('booking');
    const [nobook, setNobook] = useState('');
    const [keperluan, setKeperluan] = useState('');

    const getKaryawan = () => {
        api.get('api/employe/assignment-list?search=all').then(res => {
            setEmployes(res.data.data);
            console.log(res.data.data)
        })
    }

    useEffect(() => {
        getKaryawan();
    }, []);


    const data = [
        { id: 1, namaKaryawan: 'John Doe', perjanjianPengembalian: '2023-12-01', namaMobil: 'Toyota Camry' },
        { id: 2, namaKaryawan: 'Jane Smith', perjanjianPengembalian: '2023-11-15', namaMobil: 'Honda Civic' },
        { id: 3, namaKaryawan: 'Alice Johnson', perjanjianPengembalian: '2023-12-10', namaMobil: 'Ford Mustang' },
    ];

    // Gaya tombol
    const buttonStyle = {
        padding: '5px 10px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    // Kolom tabel
    const columns = [
        {
            name: '',
            cell: () => (
                <button type="button" style={buttonStyle}>Pengambalian</button>
            ),
            width: '150px',
            button: true,
            sortable: false,
        },
        {
            name: 'Nama Karyawan',
            selector: row => row.namaKaryawan,
            sortable: true,
        },
        {
            name: 'Perjanjian Pengembalian',
            selector: row => row.perjanjianPengembalian,
            sortable: true,
        },
        {
            name: 'Nama Mobil',
            selector: row => row.namaMobil,
            sortable: true,
        },
    ];

    // Pesan ketika data kosong
    const noDataComponent = <div style={{ textAlign: 'center', padding: '20px' }}>Tidak ada data yang tersedia.</div>;

    const [visible, setVisible] = React.useState(true);
    const onDismiss = () => setVisible(false);


    return (
        <>
            {/* pengambilan Mobil */}
            <Card>
                <CardHeader><strong>Pengambilan Mobil</strong></CardHeader>
                <CardBody>
                    <Alert color="info" isOpen={visible} toggle={onDismiss} fade={false}>
                        Utamakan yang telah melakukan booking terlebih dahulu
                    </Alert>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '100%' },
                            '& .MuiAutocomplete-root': { m: 1, width: '100%' },
                            '& .MuiButton-root': { m: 1, width: '100%' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            margin: 'auto',
                        }}
                        noValidate
                        autoComplete="off"
                    >

                        <TextField
                            style={{ width: '100%' }}
                            variant="outlined"
                            value={book}
                            onChange={(e) => setBook(e.target.value)}
                            select
                            label="Booking / No Booking"
                        >
                            <MenuItem value="booking">
                                Booking
                            </MenuItem>
                            <MenuItem value="no-booking">
                                No Booking
                            </MenuItem>

                        </TextField>

                        {book === 'booking' && (
                            <>
                                <TextField
                                    style={{ width: '100%' }}
                                    variant="outlined"
                                    value={nobook}
                                    onChange={(e) => setNobook(e.target.value)}
                                    select
                                    label="Nomor Booking"
                                >
                                    <MenuItem value="booking">
                                        B123B - WAHYUDIN - 17/02 08:00 s/d 17/02 10:00
                                    </MenuItem>
                                    <MenuItem value="no-booking">
                                        B143B - SAFRIAN - 17/02 08:00 s/d 17/02 10:00
                                    </MenuItem>

                                </TextField>

                                <TextField
                                    style={{ width: '100%' }}
                                    variant="outlined"
                                    value={mobil}
                                    onChange={(e) => setMobil(e.target.value)}
                                    select
                                    label="Unit Mobil"
                                >

                                    <MenuItem value="bl1357at">
                                        Toyota Avanza BL 1357 AT
                                    </MenuItem>

                                </TextField>
                            </>
                        )}

                        {book !== 'booking' && (<><TextField
                            style={{ width: '100%' }}
                            variant="outlined"
                            value={mobil}
                            onChange={(e) => setMobil(e.target.value)}
                            select
                            label="Unit Mobil"
                        >

                            <MenuItem value="bl1357at">
                                Toyota Avanza BL 1357 AT
                            </MenuItem>

                        </TextField>

                            {employes.length > 0 && (
                                <Autocomplete
                                    style={{ marginLeft: -10 }}
                                    disablePortal
                                    id="combo-box-demo"
                                    options={employes || []}
                                    value={employe}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            setEmploye({
                                                label: newValue,
                                            });
                                        } else if (newValue && newValue.inputValue) {
                                            setEmploye({
                                                label: newValue.inputValue,
                                            });
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
                                    renderOption={(props, option) => {
                                        const { key, ...otherProps } = props;
                                        return <li key={key} {...otherProps}>{option.label}</li>;
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Nama Karyawan" />}
                                />
                            )}

                            <TextField
                                required
                                id="keperluan"
                                label="Keperluan"
                                variant="outlined"
                                value={keperluan}
                                onChange={(event) => setKeperluan(event.target.value)}
                            />

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    renderInput={(params) => <TextField {...params} />}
                                    label="Perkiraan Pengembalian"
                                    ampm={false}
                                    value={sampai}
                                    onChange={setSampai}
                                    viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                    }}
                                />
                            </LocalizationProvider>
                        </>)}

                        <Button type="submit" variant="contained" color="secondary" size='large'>
                            Simpan
                        </Button>
                    </Box>
                </CardBody>
            </Card>

            {/* pengembalian Mobil */}
            <Card>
                <CardHeader><strong>Pengembalian Mobil</strong></CardHeader>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={data}
                        noDataComponent={noDataComponent}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="300px"
                    />
                </CardBody>
            </Card>
        </>
    )
};
TakeNBack.propTypes = {
    key: PropTypes.string,
};

export default TakeNBack;