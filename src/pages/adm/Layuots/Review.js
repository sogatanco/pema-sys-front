import React from "react";
import PropTypes from "prop-types";
import { RadioGroup, FormControlLabel, Radio, Box, TextField, Button } from '@mui/material';

// import crypto from "crypto-browserify";
import { alert } from "../../../components/atoms/Toast";
import useAxios from "../../../hooks/useAxios";



const Review = ({ data, refresh , closeModal}) => {
    const [stat, setStat] = React.useState('approve');
    const [catatan, setCatatan] = React.useState();
    const [loading, setLoading]=React.useState(false);
    const api = useAxios();
    
    const submit = () => {
        setLoading(true);
        if (stat !== 'approve' && catatan === '') {
            alert('error', 'Catatan harus diisi !');
            setLoading(false);
        }else{
            
            api.post(`dapi/adm/surat/review/${data?.no_document}`, {
                status:stat,
                catatan_persetujuan:catatan
            }).then((res) => {
                console.log(res?.data);
                if (res.status === 200) {
                    alert('success', `Berhasil ${data?.current_type} dokumen`);
                    refresh();
                    closeModal();
                }else{
                    alert('error', `Gagal ${data?.current_type} dokumen`);
                }
                setLoading(false);
            }).catch((err) => {
                alert('error', `${err.message}`);
                setLoading(false);
            })
            refresh();
            closeModal();
        }
    }


    
    return (
        <>
            <h5 className="text-capitalize">{data?.current_type} Dokumen</h5>
            <hr style={{ marginTop: -2 }} />


            <Box
                className="mb-3"
                sx={{ p: 1, borderRadius: 2, marginTop: 2, border: '0.5px solid #1c8ee6' , color: '#1c8ee6'}}
            >
                <RadioGroup
                    row
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={stat}
                    onChange={(e) => setStat(e.target.value)}
                    className="d-flex justify-content-between"
                >
                    <FormControlLabel
                        key="approve"
                        value="approve"
                        control={<Radio />}
                        label={data?.current_type==='paraf'?'Paraf Dokumen':'Tanda Tangan Dokumen'}
                        className="me-5"
                    />
                    <FormControlLabel
                        key="rejected"
                        value="rejected"
                        control={<Radio />}
                        label={data?.current_type==='paraf'?'Tolak Paraf Dokumen':'Tolak Tanda Tangan Dokumen'}
                        className="me-5"
                    />
                </RadioGroup>
            </Box>

            <TextField
                style={{ width: '100%' }}
                id="outlined-multiline-static"
                placeholder="Lorem ipsum dolor sit amet,
lorem ipsum dolo
Lorem ipsum,"
                label="Catatan Persetujuan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                multiline
                rows={4}
            />

            <Button
                color="primary"
                variant="contained"
                style={{ width: '100%' }}
                className="mt-4"
                disabled={loading}
                onClick={submit}
            >
                {loading ? 'Loading . . .' : 'Simpan'}
            </Button>

        </>
    );
};

Review.propTypes = {
    data: PropTypes.object,
    refresh:PropTypes.func, 
    closeModal:PropTypes.func
};

export default Review;