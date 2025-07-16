import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField,  Card, CardContent } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';

const Masuin = () => {
  const [slides, setSlides] = useState([
    { image: '', duration: 60000, fileName: '' }
  ]);
  const fileInputs = useRef([]);
  const api = useAxios();

  // Ambil data default dari backend saat mount
  useEffect(() => {
    api.get('dapi/lay')
      .then(res => {
        if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setSlides(res.data.data.map(item => ({
            ...item,
            image: item.image ? `${item.image}` : '',
            duration: item.duration || 60000
          })));
        }
      })
      .catch(err => {
        console.error('Error fetching slides:', err);
      });
  }, []);

  const handleImageChange = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newSlides = [...slides];
      newSlides[index].image = reader.result;
      newSlides[index].fileName = file.name;
      setSlides(newSlides);
    };
    reader.readAsDataURL(file);
  };

  const handleDurationChange = (index, value) => {
    const newSlides = [...slides];
    newSlides[index].duration = value;
    setSlides(newSlides);
  };

  const addSlide = () => {
    setSlides([...slides, { image: '', duration: 60000, fileName: '' }]);
  };

  const removeSlide = (index) => {
    if (slides.length === 1) return;
    setSlides(slides.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tampilkan list gambar dan durasi di console
    console.log('Slides:', slides);
    // Kirim ke backend
    try {
      const res = await api.post('dapi/lay/insert', slides);
      if (res.data && res.data.success) {
        alert('success', 'Data layar berhasil disimpan!');
      } else {
        alert('error', 'Gagal menyimpan data layar!');
      }
      return res.data;
    } catch (err) {
      console.error('Error submit to backend:', err);
      alert('error', 'Terjadi kesalahan saat menyimpan data layar!');
      return { success: false, error: err };
    }
    // Tambahkan alert/success handler jika perlu
  };

  return (
    <>
      <BreadCrumbs />
      <Card sx={{ width: '100%', mx: 'auto', mt: 2 }}>
        <CardContent className='p-5'>
          <Box component="form" onSubmit={handleSubmit}>
            {slides.map((slide, idx) => (
              <Box
                key={slide.fileName ? slide.fileName + idx : `slide-${slide.image?.slice(0, 20) || ''}-${idx}`}
                sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2, position: 'relative' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Gambar"
                    value={slide.fileName}
                    onClick={() => fileInputs.current[idx]?.click()}
                    InputProps={{
                      readOnly: true,
                      style: { cursor: 'pointer', background: '#fff', borderTopRightRadius: 0, borderBottomRightRadius: 0 }
                    }}
                    sx={{ mr: 0, flex: 1 }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={el => { fileInputs.current[idx] = el; }}
                    onChange={e => {
                      handleImageChange(idx, e.target.files[0]);
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      minWidth: 0,
                      px: 1.5,
                      py: 1.2,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderLeft: 'none',
                      borderColor: '#c4c4c4',
                      border: '1px solid #c4c4c4',
                      height: 56
                    }}
                    onClick={() => removeSlide(idx)}
                    disabled={slides.length === 1}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
                <TextField
                  label="Durasi (ms)"
                  type="number"
                  value={slide.duration}
                  onChange={e => handleDurationChange(idx, Number(e.target.value))}
                  fullWidth
                  inputProps={{ min: 500 }}
                />
              </Box>
            ))}
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={addSlide}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Tambah Gambar
            </Button>
            <Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Simpan
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default Masuin;
