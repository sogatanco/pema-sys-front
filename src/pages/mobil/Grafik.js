import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Select, MenuItem, TextField, Box, styled } from '@mui/material';
import { Button } from 'reactstrap';
import useAxios from '../../hooks/useAxios'; // tambahkan import useAxios

// import './Grafik.css'; // Import the CSS 

const colorss = [];

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function generateRandomColors(length) {
    return Array.from({ length }, () => getRandomColor());
}

const Grafik = () => {
    const api = useAxios();
    const currentYear = new Date().getFullYear();
    const yearOptions = [currentYear - 2, currentYear - 1, currentYear];
    const [state, setState] = useState({
        series: [{
            data: []
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
    const [selection, setSelection] = useState('yearly');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(currentYear);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSelectionChange = (event) => {
        setSelection(event.target.value);
        // Reset values when selection changes
        setMonth('');
        setYear(currentYear);
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



    // Fungsi untuk mendapatkan startDate dan endDate sesuai opsi
    const getDateRange = () => {
        if (selection === 'yearly' && year) {
            return {
                start: `${year}-01-01 00:00:00`,
                end: `${year}-12-31 23:59:59`
            };
        }
        if (selection === 'monthly' && year && month) {
            const lastDay = new Date(year, month, 0).getDate();
            return {
                start: `${year}-${String(month).padStart(2, '0')}-01 00:00:00`,
                end: `${year}-${String(month).padStart(2, '0')}-${lastDay} 23:59:59`
            };
        }
        if (selection === 'custom' && startDate && endDate) {
            return {
                start: `${startDate} 00:00:00`,
                end: `${endDate} 23:59:59`
            };
        }
        // Default: tahun ini
        return {
            start: `${currentYear}-01-01 00:00:00`,
            end: `${currentYear}-12-31 23:59:59`
        };
    };

    const fetchData = () => {
        const { start, end } = getDateRange();
        api.get('dapi/mobil/bbm-laporan', {
            params: {
                startdate: start,
                enddate: end
            }
        })
        .then((response) => {
            if (response.data.success) {
                const categories = response.data.data.categories || [];
                const data = response.data.data.data || [];
                const randomColors = generateRandomColors(categories.length);
                setState(prev => ({
                    ...prev,
                    series: [{
                        data
                    }],
                    options: {
                        ...prev.options,
                        colors: randomColors,
                        xaxis: {
                            ...prev.options.xaxis,
                            categories
                        }
                    }
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    series: [{ data: [] }],
                    options: {
                        ...prev.options,
                        xaxis: {
                            ...prev.options.xaxis,
                            categories: []
                        }
                    }
                }));
            }
        })
        .catch((error) => {
            console.error('Error fetching BBM data:', error);
            setState(prev => ({
                ...prev,
                series: [{ data: [] }],
                options: {
                    ...prev.options,
                    xaxis: {
                        ...prev.options.xaxis,
                        categories: []
                    }
                }
            }));
        });
    };

    // Fetch data tahun ini saat komponen mount
    React.useEffect(() => {
        const start = `${currentYear}-01-01 00:00:00`;
        const end = `${currentYear}-12-31 23:59:59`;
        api.get('dapi/mobil/bbm-laporan', {
            params: {
                startdate: start,
                enddate: end
            }
        })
        .then((response) => {
            if (response.data.success) {
                const categories = response.data.data.categories || [];
                const data = response.data.data.data || [];
                const randomColors = generateRandomColors(categories.length);
                setState(prev => ({
                    ...prev,
                    series: [{
                        data
                    }],
                    options: {
                        ...prev.options,
                        colors: randomColors,
                        xaxis: {
                            ...prev.options.xaxis,
                            categories
                        }
                    }
                }));
            }
        })
        .catch(() => {
            setState(prev => ({
                ...prev,
                series: [{ data: [] }],
                options: {
                    ...prev.options,
                    xaxis: {
                        ...prev.options.xaxis,
                        categories: []
                    }
                }
            }));
        });
    }, []);

    return (
        <div className="chart-container">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                sx={{
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                }}
            >
                <h4 style={{ fontWeight: 'bold', color: 'black', marginBottom: 8 }}>Grafik BBM Mobil Operasional</h4>

                {/* Mulai Box filter & tombol */}
                <Box
                    sx={{
                        borderRadius: 3,
                        background: '#f8f9fa',
                        boxShadow: '0 1px 6px rgba(60,60,60,0.07)',
                        p: { xs: 1, sm: 1.5 },
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: 1,
                        minWidth: { xs: 'unset', sm: 320 },
                        width: { xs: '100%', sm: 'auto' },
                        mb: { xs: 1, sm: 0 }
                    }}
                >
                    <Box className="me-2" sx={{ minWidth: 80, maxWidth: 120 }}>
                        <RoundedSelect
                            value={selection}
                            onChange={handleSelectionChange}
                            displayEmpty
                            size="small"
                            fullWidth
                            sx={{ fontSize: 13, height: 36 }}
                        >
                            <MenuItem value="monthly" sx={{ fontSize: 13 }}>Bulanan</MenuItem>
                            <MenuItem value="yearly" sx={{ fontSize: 13 }}>Tahunan</MenuItem>
                            <MenuItem value="custom" sx={{ fontSize: 13 }}>Kustom</MenuItem>
                        </RoundedSelect>
                    </Box>

                    {/* Bulanan */}
                    {selection === 'monthly' && (
                        <Box display="flex" alignItems="center" sx={{ gap: 1, flexWrap: 'wrap' }}>
                            <RoundedSelect
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                displayEmpty
                                size="small"
                                sx={{ minWidth: 80, maxWidth: 110, fontSize: 13, height: 36 }}
                                fullWidth
                            >
                                <MenuItem value="" sx={{ fontSize: 13 }}><em>Pilih Bulan</em></MenuItem>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <MenuItem key={i} value={i + 1} sx={{ fontSize: 13 }}>{`Bulan ${i + 1}`}</MenuItem>
                                ))}
                            </RoundedSelect>
                            <RoundedSelect
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                displayEmpty
                                size="small"
                                sx={{ minWidth: 80, maxWidth: 110, fontSize: 13, height: 36 }}
                                fullWidth
                            >
                                <MenuItem value="" sx={{ fontSize: 13 }}><em>Pilih Tahun</em></MenuItem>
                                {yearOptions.map((y) => (
                                    <MenuItem key={y} value={y} sx={{ fontSize: 13 }}>{y}</MenuItem>
                                ))}
                            </RoundedSelect>
                        </Box>
                    )}

                    {/* Tahunan */}
                    {selection === 'yearly' && (
                        <Box sx={{ minWidth: 80, maxWidth: 110 }}>
                            <RoundedSelect
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                displayEmpty
                                size="small"
                                fullWidth
                                sx={{ fontSize: 13, height: 36 }}
                            >
                                <MenuItem value="" sx={{ fontSize: 13 }}><em>Pilih Tahun</em></MenuItem>
                                {yearOptions.map((y) => (
                                    <MenuItem key={y} value={y} sx={{ fontSize: 13 }}>{y}</MenuItem>
                                ))}
                            </RoundedSelect>
                        </Box>
                    )}

                    {/* Kustom */}
                    {selection === 'custom' && (
                        <Box display="flex" alignItems="center" sx={{ gap: 1, flexWrap: 'wrap' }}>
                            <TextField
                                label="Tanggal Mulai"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ minWidth: 110, maxWidth: 140, fontSize: 13, height: 36 }}
                                fullWidth
                            />
                            <TextField
                                label="Tanggal Akhir"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ minWidth: 110, maxWidth: 140, fontSize: 13, height: 36 }}
                                fullWidth
                            />
                        </Box>
                    )}

                    <Button
                        color="primary"
                        size='sm'
                        style={{
                            padding: '4px 12px',
                            borderRadius: '17px',
                            fontWeight: 'bold',
                            marginTop: 2,
                            fontSize: 13,
                            height: 32,
                            minWidth: 70
                        }}
                        onClick={fetchData}
                    >
                        Tampilkan
                    </Button>
                </Box>
                {/* Selesai Box filter & tombol */}
            </Box>

            <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
        </div>
    );
};

export default Grafik;
