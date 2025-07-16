import React, { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { Alert, Card, CardBody } from 'reactstrap';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { Box, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import dayjs from 'dayjs'; // Import dayjs for date formatting
import { alert } from '../../components/atoms/Toast';
// import useAuth from '../../hooks/useAuth'; // Import your authentication hook
import useAxios from '../../hooks/useAxios';
import ListPermintaan from './ListPermintaan';
import ListAfterReview from './ListAfterReview';

const PermintaanMobil = () => {
    // const { auth } = useAuth(); // Assuming you have a custom hook for authentication
    const api = useAxios();
    const [keperluan, setKeperluan] = useState('');
    const [dari, setDari] = useState(null);
    const [sampai, setSampai] = useState(null);
    const [perluSopir, setPerluSopir] = useState(0);
    const listPermintaanRef = useRef(null);
    const listAfterReviewRef = useRef(null);

    // alert
    const [visible, setVisible] = React.useState(true);
    const onDismiss = () => setVisible(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!keperluan || !dari || !sampai) {
            alert('error', 'Harap isi semua field sebelum mengajukan permintaan.');
            return;
        }

        const data = {
            keperluan,
            dari: dari ? dayjs(dari).format('YYYY-MM-DD HH:mm:ss') : null, // Format to MySQL datetime
            sampai: sampai ? dayjs(sampai).format('YYYY-MM-DD HH:mm:ss') : null, // Format to MySQL datetime
            perluSopir,
        };

        api.post('dapi/mobil/insert-permintaan', data)
            .then((response) => {
                console.log('Data submitted successfully:', response.data);
                alert('success', 'Permintaan berhasil diajukan!');
                setKeperluan(''); // Clear keperluan
                setDari(null); // Clear dari
                setSampai(null); // Clear sampai
                setPerluSopir(0); // Reset perluSopir to default
                if (listPermintaanRef.current) {
                    listPermintaanRef.current.refreshData(); // Trigger data refresh
                }
            })
            .catch((error) => {
                console.error('Error submitting data:', error);
                alert('error','Terjadi kesalahan saat mengajukan permintaan.');
            });
    };

    return (
        <>
            <Card>
                <CardBody>
                    <Alert color="info" isOpen={visible} toggle={onDismiss} fade={false}>
                        Permintaan Mobil Minimal 1 Jam sebelum pemakaian
                    </Alert>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
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
                                label="Dari"
                                ampm={false}
                                value={dari}
                                onChange={setDari}
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                }}
                            />
                            <DateTimePicker
                                renderInput={(params) => <TextField {...params} />}
                                label="Sampai"
                                ampm={false}
                                value={sampai}
                                onChange={setSampai}
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                }}
                            />
                        </LocalizationProvider>

                        <Box
                            sx={{
                                '& .MuiFormLabel-root': { m: 1, width: '100%' },
                                '& .MuiRadioGroup-root': { m: 1, width: '100%' },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                width: '100%',
                                margin: 'auto',
                                marginTop: '8px',
                            }}
                        >
                            <RadioGroup
                                row
                                value={perluSopir}
                                onChange={(event) => setPerluSopir(event.target.value)}
                                sx={{
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                <FormControlLabel value="1" control={<Radio />} label="Memerlukan Sopir" />
                                <FormControlLabel value="0" control={<Radio />} label="Tidak Memerlukan Sopir" />
                            </RadioGroup>
                        </Box>

                        <Button type="submit" variant="contained" color="secondary" size='large'>
                            Submit Pemintaan
                        </Button>
                    </Box>
                </CardBody>
            </Card>

            

            <Card>
                <CardBody>
                    <ListPermintaan ref={listPermintaanRef} afterReviewRef={listAfterReviewRef} />
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <ListAfterReview ref={listAfterReviewRef} />
                </CardBody>
            </Card>
        </>
    );
};

export default PermintaanMobil;
