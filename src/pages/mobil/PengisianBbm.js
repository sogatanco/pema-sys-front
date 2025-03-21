// Import necessary React and MUI components
import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Autocomplete from '@mui/material/Autocomplete';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import useAxios from '../../hooks/useAxios';

// Define the PengisianBbm functional component
const PengisianBbm = () => {
    // State hooks for form fields
    const api = useAxios();
    const [unitMobil, setUnitMobil] = useState('');
    const [jenisBbm, setJenisBbm] = useState('');
    const [jumlahBiaya, setJumlahBiaya] = useState('');
    const [jumlahLiter, setJumlahLiter] = useState('');
    const [tanggal, setTanggal] = useState(null);
    const [employe, setEmploye] = useState(null);
    const [employes, setEmployes] = useState([]);

    // State hook for form validation
    const [errors, setErrors] = useState({});

    // Dummy options for Unit Mobil dropdown
    const unitMobilOptions = [
        'Toyota Avanza',
        'Honda Brio',
        'Daihatsu Xenia',
        'Suzuki Ertiga',
        'Mitsubishi Xpander',
    ];

    // Options for Jenis BBM dropdown with RON and jenis in lowercase
    const jenisBbmOptions = [
        { label: 'Solar (CN 48)', value: 'bio_solar', ron: '48', jenis: 'diesel' },
        { label: 'Dexlite (CN 51)', value: 'dexlite', ron: '51', jenis: 'diesel' },
        { label: 'Pertalite (RON 90)', value: 'pertalite', ron: '90', jenis: 'bensin' },
        { label: 'Pertamax (RON 92)', value: 'pertamax', ron: '92', jenis: 'bensin' },
        { label: 'Pertamax Green (RON 95)', value: 'pertamax_green', ron: '95', jenis: 'bensin' },
        { label: 'Pertamax Turbo (RON 98)', value: 'pertamax_turbo', ron: '98', jenis: 'bensin' },
        { label: 'Dex (CN 53)', value: 'dex', ron: '53', jenis: 'diesel' },
    ];

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Basic validation
        const validationErrors = {};
        if (!unitMobil) validationErrors.unitMobil = 'Unit Mobil is required';
        if (!jenisBbm) validationErrors.jenisBbm = 'Jenis BBM is required';
        if (!jumlahBiaya || Number.isNaN(Number(jumlahBiaya)) || Number(jumlahBiaya) <= 0) {
            validationErrors.jumlahBiaya = 'Jumlah Biaya must be a positive number';
        }
        if (!jumlahLiter || Number.isNaN(Number(jumlahLiter)) || Number(jumlahLiter) <= 0) {
            validationErrors.jumlahLiter = 'Jumlah Liter must be a positive number';
        }

        // If there are validation errors, set them and return
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Log form data to console if validation passes
        console.log('Form Data Submitted:', {
            unitMobil,
            jenisBbm,
            jumlahBiaya,
            jumlahLiter,
        });

        // Optionally, reset form fields after submission
        setUnitMobil('');
        setJenisBbm('');
        setJumlahBiaya('');
        setJumlahLiter('');
        setErrors({});
    };

    const getKaryawan = () => {
        api.get('api/employe/assignment-list?search=all').then(res => {
            setEmployes(res.data.data);
            console.log(res.data.data)
        })
    }

    useEffect(() => {
        getKaryawan();
    }, []);


    return (
        <Card>
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


                    {/* Unit Mobil Dropdown */}
                    <FormControl fullWidth error={Boolean(errors.unitMobil)}>
                        <InputLabel id="unit-mobil-label">Unit Mobil</InputLabel>
                        <Select
                            labelId="unit-mobil-label"
                            id="unit-mobil"
                            value={unitMobil}
                            onChange={(e) => setUnitMobil(e.target.value)}
                            label="Unit Mobil"
                        >
                            {unitMobilOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.unitMobil && <Typography color="error">{errors.unitMobil}</Typography>}
                    </FormControl>

                    {/* Jenis BBM Dropdown */}
                    <FormControl fullWidth error={Boolean(errors.jenisBbm)}>
                        <InputLabel id="jenis-bbm-label">Jenis BBM</InputLabel>
                        <Select
                            labelId="jenis-bbm-label"
                            id="jenis-bbm"
                            value={jenisBbm}
                            onChange={(e) => setJenisBbm(e.target.value)}
                            label="Jenis BBM"
                        >
                            {jenisBbmOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.jenisBbm && <Typography color="error">{errors.jenisBbm}</Typography>}
                    </FormControl>

                    {/* Jumlah Biaya Numeric Input */}
                    <TextField
                        label="Jumlah Biaya (Rp)"
                        variant="outlined"
                        type="number"
                        value={jumlahBiaya}
                        onChange={(e) => setJumlahBiaya(e.target.value)}
                        error={Boolean(errors.jumlahBiaya)}
                        helperText={errors.jumlahBiaya}
                        fullWidth
                    />

                    {/* Jumlah Liter Numeric Input */}
                    <TextField
                        label="Jumlah Liter"
                        variant="outlined"
                        type="number"
                        value={jumlahLiter}
                        onChange={(e) => setJumlahLiter(e.target.value)}
                        error={Boolean(errors.jumlahLiter)}
                        helperText={errors.jumlahLiter}
                        fullWidth
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            renderInput={(params) => <TextField {...params} />}
                            label="Tgl Pengisian"
                            ampm={false}
                            value={tanggal}
                            onChange={setTanggal}
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                            }}
                        />
                    </LocalizationProvider>

                    {employes.length > 0 && (
                        <Autocomplete
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
                            renderInput={(params) => <TextField {...params} label="Pengisian oleh" />}
                        />
                    )}
                    {/* Submit Button */}
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </CardBody>
        </Card>
    );
};


PengisianBbm.propTypes = {
    key: PropTypes.string,
    // Add other props if necessary
};

export default PengisianBbm;
