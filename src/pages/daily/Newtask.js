import React from 'react';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { Row, Col, Button } from 'reactstrap';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

import Box from '@mui/material/Box';

const filt = createFilterOptions();
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
];

const categories = [
  { title: 'Rutin', id: 1 },
  { title: 'Non Rutin', id: 2 },
  { title: 'Tahunan', id: 3 },
];

const Newtask = () => {
  const [value, setValue] = React.useState(null);
  const [star, setStar] = React.useState(dayjs());
  const [end, setEnd] = React.useState(dayjs());
  const [progress, setProgress] = React.useState(0);
  const [category, setCategory] = React.useState(null);

  const submit = () => {
    console.log(value?.title);
    console.log(star);
    console.log(end);
    console.log(category?.title);
    console.log(progress);
  };

  return (
    <>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setValue({
              title: newValue,
            });
          } else if (newValue && newValue.inputValue) {
            setValue({
              title: newValue.inputValue,
            });
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filt(options, params);

          const { inputValue } = params;
          const isExisting = options.some((option) => inputValue === option.title);
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              title: `Add "${inputValue}"`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="free-solo-with-text-demo"
        options={top100Films}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.title;
        }}
        renderOption={(props, option) => <li {...props}>{option.title}</li>}
        freeSolo
        renderInput={(params) => <TextField {...params} label="What are you doing today ?" />}
      />
      <Row className="mt-3">
        <Col>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoItem>
              <MobileDateTimePicker value={star} onChange={(e) => setStar(e)} label="Mulai" />
            </DemoItem>
          </LocalizationProvider>
        </Col>
        <Col>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoItem>
              <MobileDateTimePicker label="Selesai" value={end} onChange={(e) => setEnd(e)} />
            </DemoItem>
          </LocalizationProvider>
        </Col>
        <Col>
          <Autocomplete
            id="disabled-options-demo"
            options={categories}
            value={category}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setCategory({
                  title: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                setCategory({
                  title: newValue.inputValue,
                });
              } else {
                setCategory(newValue);
              }
            }}
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.title;
            }}
            renderOption={(props, option) => <li {...props}>{option.title}</li>}
            renderInput={(params) => <TextField {...params} label="Category" />}
          />
        </Col>
      </Row>

      <Box sx={{ p: 2, borderRadius: 2, marginTop: 2, border: '0.5px solid #C4C4C4' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography id="input-slider" gutterBottom>
              Progress
            </Typography>
          </Grid>
          <Grid item xs>
            <Slider
              value={typeof progress === 'number' ? progress : 0}
              onChange={(e, newVal) => setProgress(newVal)}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item>{`${progress}%`}</Grid>
        </Grid>
      </Box>
      <div className="d-grid gap-2 mt-3">
        <Button variant="dark" size="lg" onClick={submit}>
          SUBMIT
        </Button>
      </div>
    </>
  );
};

export default Newtask;
