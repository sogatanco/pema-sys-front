import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Alert, Card, CardBody } from 'reactstrap';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Button } from '@mui/material';
import PropTypes from 'prop-types';
import useAxios from '../../hooks/useAxios';
import ListPermintaan from './ListPermintaan';

const PermintaanMobil = () => {
    const api = useAxios();
    const [keperluan, setKeperluan] = useState('');
    const [dari, setDari] = useState(null);
    const [sampai, setSampai] = useState(null);
    const [employe, setEmploye] = useState(null);
    const [employes, setEmployes] = useState([]);

    // alert
    const [visible, setVisible] = React.useState(true);
    const onDismiss = () => setVisible(false);

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
        <>
            <Card>
                <CardBody>


                    <Alert color="info" isOpen={visible} toggle={onDismiss} fade={false}>
                        Permintaan Mobil Minimal 1 Jam sebelum pemakaian
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
                            required
                            id="keperluan"
                            label="Keperluan"
                            variant="outlined"
                            value={keperluan}
                            onChange={(event) => setKeperluan(event.target.value)}
                        />
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
                                renderInput={(params) => <TextField {...params} label="PIC (Penanggung Jawab)" />}
                            />
                        )}
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

                        <Button type="submit" variant="contained" color="secondary" size='large'>
                            Submit Pemintaan
                        </Button>
                    </Box>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <ListPermintaan />
                </CardBody>
            </Card>
        </>
    );
};

// Adding PropTypes for validation
PermintaanMobil.propTypes = {
    key: PropTypes.string,
    // Add other props if necessary
};

export default PermintaanMobil;
