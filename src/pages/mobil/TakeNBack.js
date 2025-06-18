import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Alert } from "reactstrap";
import { Box, TextField, Autocomplete, Button, MenuItem } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import dayjs from 'dayjs'; // Import dayjs untuk date formatting
import { confirmAlert } from "react-confirm-alert";
import useAxios from "../../hooks/useAxios";
import { alert } from '../../components/atoms/Toast'; // Import alert
import "react-confirm-alert/src/react-confirm-alert.css"; // Tambahkan CSS untuk react-confirm-alert

const TakeNBack = () => {
    const api = useAxios();
    const [employe, setEmploye] = useState(null);
    const [employes, setEmployes] = useState([]);
    const [sampai, setSampai] = useState(null);
    const [mobil, setMobil] = useState('');
    const [book, setBook] = useState('booking');
    const [nobook, setNobook] = useState('');
    const [keperluan, setKeperluan] = useState('');
    const [bookings, setBookings] = useState([]); // State untuk booking data
    const [mobils, setMobils] = useState([]); // State untuk mobil data
    const [pengambilan, setPengambilan] = useState([]); // State untuk data pengambilan

    const getKaryawan = () => {
        api.get('api/employe/assignment-list?search=all').then(res => {
            setEmployes(res.data.data);
            console.log(res.data.data);
        });
    };

    const getBookings = () => {
        api.get('dapi/mobil/get-permintaan-by-status').then(res => {
            if (res.data.success) {
                console.log(res);
                setBookings(res.data.data);
            }
        }).catch(err => {
            console.error('Error fetching bookings:', err);
        });
    };

    const getMobils = () => {
        api.get('dapi/mobil/get').then(res => {
            if (res.data.success) {
                setMobils(res.data.data);
            }
        }).catch(err => {
            console.error('Error fetching mobils:', err);
        });
    };

    const getPengambilan = () => {
        api.get('dapi/mobil/get-pengambilan').then(res => {
            if (res.data.success) {
                setPengambilan(res.data.data);
            }
        }).catch(err => {
            console.error('Error fetching pengambilan:', err);
        });
    };

    const handleSave = (event) => {
        event.preventDefault();

        if (book === 'booking' && (!mobil )) {
            alert('error', 'Harap isi semua field (Mobil dan Perkiraan Pengembalian) sebelum menyimpan.');
            return;
        }

        if (book !== 'booking' && (!mobil || !employe || !keperluan || !sampai)) {
            alert('error', 'Harap isi semua field sebelum menyimpan.');
            return;
        }
console.log(employe)
        const data = {
            id_mobil: mobil,
            booked: book === 'booking' ? nobook : null,
            employe_id: book !== 'booking' ? employe?.value : null,
            keperluan: book !== 'booking' ? keperluan : null,
            sampai: dayjs(sampai).format('YYYY-MM-DD HH:mm:ss'),
            book, // Include Booking/No Booking in the data
        };

        api.post('dapi/mobil/insert-pengambilan', data)
            .then((response) => {
                if (response.data.success) {
                    alert('success', 'Data pengambilan berhasil disimpan.');
                    setMobil('');
                    setNobook('');
                    setEmploye(null);
                    setKeperluan('');
                    setSampai(null);
                    setBook('booking'); // Reset Booking/No Booking to default
                } else {
                    alert('error', 'Gagal menyimpan data pengambilan.');
                }
            })
            .catch((error) => {
                console.error('Error saving data:', error);
                alert('error', 'Terjadi kesalahan saat menyimpan data.');
            });
    };

    // Fungsi untuk menangani pengembalian
    const handleDort = (id) => {
        let latestKm = null;

        confirmAlert({
            title: "Konfirmasi Pengembalian",
            message: "Cek apakah kilometer dan minyak sesuai?",
            customUI: ({ onClose }) => (
                <div className="custom-ui">
                    <h1>Konfirmasi Pengembalian</h1>
                    <p>Cek apakah kilometer dan minyak sesuai?</p>
                    <TextField
                        label="Kilometer Terakhir"
                        type="number"
                        fullWidth
                        onChange={(e) => {
                            latestKm = e.target.value; // Pisahkan assignment
                        }}
                    />
                    <div style={{ marginTop: "20px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                if (!latestKm) {
                                    alert('error', 'Harap masukkan kilometer terbaru.');
                                    return;
                                }
                                api.post(`dapi/mobil/pengembalian/${id}`, { last_km: latestKm })
                                    .then((response) => {
                                        if (response.data.success) {
                                            alert('success', 'Mobil berhasil dikembalikan.');
                                            getPengambilan(); // Refresh data pengambilan
                                        } else {
                                            alert('error', 'Gagal mengembalikan mobil.');
                                        }
                                    })
                                    .catch((error) => {
                                        console.error('Error during return:', error);
                                        alert('error', 'Terjadi kesalahan saat mengembalikan mobil.');
                                    });
                                onClose();
                            }}
                        >
                            Ya
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={onClose} style={{ marginLeft: "10px" }}>
                            Tidak
                        </Button>
                    </div>
                </div>
            ),
        });
    };

    useEffect(() => {
        getKaryawan();
        getBookings();
        getMobils();
        getPengambilan(); // Panggil fetch pengambilan di useEffect
    }, []);


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
            name: 'Pengembalian',
            cell: row => (
                row.real_pengembalian 
                    ? <span>{dayjs(row.real_pengembalian).format('YYYY-MM-DD HH:mm')}</span> 
                    : <button 
                        type="button" 
                        style={buttonStyle} 
                        onClick={() => handleDort(row.id)}>Pengembalian</button>
            ),
            width: '150px',
            button: true,
            sortable: false,
        },
        {
            name: 'Nama Karyawan',
            selector: row => row.employe_name || row.employe_name,
            sortable: true,
        },
        {
            name: 'Pengambilan',
            selector: row => row.taken_time || row.taken_time,
            sortable: true,
        },
        {
            name: 'Perjanjian Pengembalian',
            selector: row => row.pengembalian || row.pengembalian,
            sortable: true,
        },
        {
            name: 'Nama Mobil',
            selector: row => `${row.brand} - ${row.plat}`, // Gunakan template literals
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
                        onSubmit={handleSave}
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
                                    {bookings.map((booking) => (
                                        <MenuItem key={booking.id} value={booking.id}>
                                            {`${booking.created_by_name} - ${dayjs(booking.mulai).format('YYYY-MM-DD HH:mm')} s/d ${dayjs(booking.hingga).format('YYYY-MM-DD HH:mm')}`}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    style={{ width: '100%' }}
                                    variant="outlined"
                                    value={mobil}
                                    onChange={(e) => setMobil(e.target.value)}
                                    select
                                    label="Unit Mobil"
                                >
                                    {mobils.map((unit) => (
                                        <MenuItem key={unit.id} value={unit.id}>
                                            {`${unit.brand} - ${unit.plat}`}
                                        </MenuItem>
                                    ))}
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
                            {mobils.map((unit) => (
                                <MenuItem key={unit.id} value={unit.id}>
                                    {`${unit.brand} - ${unit.plat}`}
                                </MenuItem>
                            ))}
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
                        data={pengambilan} // Ganti data dummy dengan data dari API
                        noDataComponent={noDataComponent}
                        pagination
                        fixedHeader
                        sortable
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