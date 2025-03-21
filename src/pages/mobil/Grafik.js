import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Select, MenuItem, TextField, Box, styled } from '@mui/material';

import './Grafik.css'; // Import the CSS 

const colorss = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'];

const Grafik = () => {
    const [state] = React.useState({
        series: [{
            data: [12, 22, 10, 28, 16, 21, 13, 30]
        }],
        options: {
            chart: {
                height: 350,
                type: 'bar',
            },
            colors: colorss,
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: [
                    ['AVANZA', 'BL 1243 AT'],
                    ['AVANZA', 'Smith'],
                    ['AVANZA', 'Williams'],
                    'Amber',
                    ['Peter', 'Brown'],
                    ['Mary', 'Evans'],
                    ['David', 'Wilson'],
                    ['Lily', 'Roberts'],
                ],
                labels: {
                    style: {
                        colors: colorss,
                        fontSize: '12px'
                    }
                }
            }
        }
    });

    const [selection, setSelection] = useState('all');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSelectionChange = (event) => {
        setSelection(event.target.value);
        // Reset values when selection changes
        setMonth('');
        setYear('');
        setStartDate('');
        setEndDate('');
    };

    const RoundedSelect = styled(Select)({
        borderRadius: "17px",
        backgroundColor: "white",
        letterSpacing: "0.5px",
        border: "none",
        "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: "17px",
            border: "none",
        },
    });



    return (

       
                <div className="chart-container">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <h4 style={{ fontWeight: 'bold', color: 'black' }}>Grafik BBM Mobil Operasional</h4>

                        <Box display="flex" alignItems="center">

                            <Box className="me-2">
                                <RoundedSelect
                                    value={selection}
                                    onChange={handleSelectionChange}
                                    displayEmpty
                                    size="small" // Ukuran lebih kecil
                                >
                                    <MenuItem value="monthly">Bulanan</MenuItem>
                                    <MenuItem value="yearly">Tahunan</MenuItem>
                                    <MenuItem value="custom">Kustom</MenuItem>
                                    <MenuItem value="all">Semua</MenuItem>
                                </RoundedSelect>
                            </Box>

                            {selection === 'monthly' && (
                                <Box display="flex" alignItems="center">
                                    <RoundedSelect
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        displayEmpty
                                        size="small" // Ukuran lebih kecil
                                        sx={{ mr: 1 }} // Margin kanan untuk jarak
                                    >
                                        <MenuItem value=""><em>Pilih Bulan</em></MenuItem>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <MenuItem key={i} value={i + 1}>{`Bulan ${i + 1}`}</MenuItem>
                                        ))}
                                    </RoundedSelect>
                                    <RoundedSelect
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        displayEmpty
                                        size="small" // Ukuran lebih kecil
                                    >
                                        <MenuItem value=""><em>Pilih Tahun</em></MenuItem>
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <MenuItem key={i} value={2023 + i}>{2023 + i}</MenuItem>
                                        ))}
                                    </RoundedSelect>
                                </Box>
                            )}

                            {selection === 'yearly' && (
                                <Box>
                                    <RoundedSelect
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        displayEmpty
                                        size="small" // Ukuran lebih kecil
                                    >
                                        <MenuItem value=""><em>Pilih Tahun</em></MenuItem>
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <MenuItem key={i} value={2023 + i}>{2023 + i}</MenuItem>
                                        ))}
                                    </RoundedSelect>
                                </Box>
                            )}

                            {selection === 'custom' && (
                                <Box display="flex" alignItems="center">
                                    <TextField
                                        label="Tanggal Mulai"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        size="small" // Ukuran lebih kecil
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        sx={{ mr: 1 }} // Margin kanan untuk jarak
                                    />
                                    <TextField

                                        label="Tanggal Akhir"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        size="small" // Ukuran lebih kecil
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>



                    </Box>

                    <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
                </div>

           
    );
};

export default Grafik;
