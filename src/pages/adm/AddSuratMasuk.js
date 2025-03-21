import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, TextField, InputAdornment, MenuItem, Button } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MaterialIcon from '@material/react-material-icon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { confirmAlert } from "react-confirm-alert";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { alert } from "../../components/atoms/Toast";
import 'react-confirm-alert/src/react-confirm-alert.css';

dayjs.locale("id");

/**
 * Komponen untuk menambah surat masuk
 * 
 * Digunakan untuk menambahkan surat masuk dengan mengisi data-data yang dibutuhkan
 * 
 * @param {Object} props - props yang dibutuhkan
 * @returns {ReactElement} - komponen yang digenerate
 */
const AddSuratMasuk = ({ refresh, func1 }) => {

    const api = useAxios();
    const [loading, setLoading] = useState(false);

    const [nomorSurat, setNomorSurat] = React.useState('');
    const [pengirim, setPengirim] = React.useState('');
    const [perihal, setPerihal] = React.useState('');
    const [tglSurat, setTglSurat] = React.useState(dayjs());
    const vias = ['Email', 'Surat Fisik', 'Whatapps', 'Lainnya'];
    const [via, setVia] = React.useState('');
    const [dir, setDir] = React.useState('3');
    const [file, setFile] = React.useState();
    const [fileName, setFileName] = React.useState('');
    const { data } = useQuery({
        queryKey: ['dirs'],
        queryFn: () => api.get(`dapi/adm/direkturs`).then(res => res.data.data),
    });

    const [dataSurat, setDataSurat] = React.useState({});

    useEffect(() => {
        setDataSurat({
            nomorSurat,
            pengirim,
            perihal,
            tglSurat,
            via,
            dir,
            file,
        });
    }, [nomorSurat, pengirim, perihal, tglSurat, via, dir, file]);



    const submit =  () => {
        const allNonEmpty = Object.values(dataSurat).every(value => value !== '' && value !== null && value !== undefined);
        if (!allNonEmpty) {
            alert('error', 'Data belum lengkap, silahkan isi data terlebih dahulu');
        } else {
           
            confirmAlert({
                title: "Are you sure ?",
                message: "Be careful, what has gone will not come back",
                buttons: [
                    {
                        label: "Yes",
                        onClick: async() => {
                            setLoading(true);
                           await api.post(`dapi/adm/suratmasuk`, dataSurat, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
                                if (res.status === 200) {
                                    // console.log(res)
                                    refresh();
                                    func1(false);
                                    alert('success', 'Surat Masuk Berhasil diupload !');
                                    setLoading(false);
                                } else {
                                    alert('error', 'Surat Masuk Gagal diupload, Hubungi Tim IT untuk problem selanjutnya !');
                                    setLoading(false);
                                }

                            }).catch((err) => {
                                alert('error', `${err.message}`);
                                setLoading(false);
                            }); 
                        },
                    },
                    {
                        label: "No",
                        onClick: () => { },
                    }
                ],
            })
        }


    }
    return (
        <div>
            <Box className="mb-3">
                <TextField
                    id="outlined-basic"
                    style={{ width: '100%' }}
                    label="Nomor Surat Masuk"
                    variant="outlined"
                    value={nomorSurat}
                    onChange={(e) => setNomorSurat(e.target.value)}
                />
            </Box>
            <Box className="mb-3">
                <TextField
                    id="outlined-basic"
                    style={{ width: '100%' }}
                    label="Pengirim"
                    variant="outlined"
                    value={pengirim}
                    onChange={(e) => setPengirim(e.target.value)}
                />
            </Box>
            <Box className="mb-3">
                <TextField
                    id="outlined-basic"
                    style={{ width: '100%' }}
                    label="Perihal"
                    variant="outlined"
                    value={perihal}
                    onChange={(e) => setPerihal(e.target.value)}
                />
            </Box>

            <Box className="mb-3">
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
                    <DemoContainer components={['DatePicker']} >
                        <DatePicker
                            label="Tgl Surat"
                            value={tglSurat}
                            onChange={setTglSurat}
                            sx={{ width: '100%' }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </Box>


            <Box className="mb-3">
                <TextField
                    select
                    style={{ width: '100%' }}
                    variant="outlined"
                    value={via}
                    onChange={(e) => setVia(e.target.value)}
                    label="Surat diterima Via"
                >
                    {vias?.map((item) => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <Box className="mb-3">
                <TextField
                    label="Upload File"
                    variant="outlined"
                    value={fileName}
                    fullWidth
                    placeholder="Harus PDF maksimal 12 MB"
                    disabled
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MaterialIcon icon="cloud_upload" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('input-file').click()} />
                            </InputAdornment>
                        ),
                    }}
                />

                <input
                    type="file"
                    id="input-file"
                    style={{ display: 'none' }}
                    accept="application/pdf"
                    onChange={(e) => {
                        setFileName(e.target.files[0]?.name);
                        // console.log(e.target.files[0]?.name);
                        setFile(e.target.files[0]);
                    }}
                />
            </Box>

            {data?.length > 0 && (
                <Box className="mb-3">
                    <TextField
                        select
                        style={{ width: '100%' }}
                        variant="outlined"
                        value={dir}
                        onChange={(e) => setDir(e.target.value)}
                        label="Ditujukan Kepada"
                    >
                        {data?.map((item) => (
                            <MenuItem key={item?.position_id} value={item?.position_id}>
                                {item?.position_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            )}

            <Box className="mb-3">
                <Button disabled={loading} variant="contained" size="large" style={{ width: '100%' }} onClick={() => submit()}>{loading ? 'Loading...' : 'Simpan Surat Masuk'}</Button>
            </Box>

        </div>
    );
};

AddSuratMasuk.propTypes = {
    refresh: PropTypes.func,
    func1: PropTypes.func,
}

export default AddSuratMasuk;