import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import MaterialIcon from '@material/react-material-icon';
import { Row, Col, Button } from 'reactstrap';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { useQueries } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';

const filt = createFilterOptions();

const Newtask = ({ refetch }) => {
  const [activities, setActivities] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [value, setValue] = React.useState(null);
  const [star, setStar] = React.useState(dayjs());
  const [end, setEnd] = React.useState(dayjs());
  const [progress, setProgress] = React.useState(0);
  const [category, setCategory] = React.useState(null);
  const [actpoin, setActpoin] = React.useState(0);
  const [isAddForm, setIsAddForm] = React.useState(false);

  const activityValueSubmit = {
    activity: '',
    poin: 0,
    start: dayjs(),
    end: dayjs(),
    category: '',
    progress: 0,
  };
  const api = useAxios();
  const submit = async (e) => {
    e.preventDefault();
    if (value?.activity && category?.id) {
      activityValueSubmit.activity = value?.activity;
      activityValueSubmit.start = dayjs(star);
      activityValueSubmit.end = dayjs(end);
      activityValueSubmit.category = category?.id;
      activityValueSubmit.progress = progress;
      activityValueSubmit.poin = actpoin;
      e.preventDefault();
      await api
        .post(`dapi/activit`, activityValueSubmit)
        .then(() => {
          alert('success', `Data has been submitted !`);
          setValue(null);
          setCategory(null);
          setProgress(0);
          setStar(dayjs());
          setEnd(dayjs());
          refetch();
        })
        .catch((err) => {
          alert('error', err);
        });
    } else {
      alert('error', `Fields Can't Be Empty !!`);
    }
  };

  const addForm = async (e) => {
    e.preventDefault();
    setIsAddForm(true);
  };

  const removeForm = async (e) => {
    e.preventDefault();
    setIsAddForm(false);
  };

  const [act, cat] = useQueries({
    queries: [
      {
        queryKey: ['act'],
        queryFn: () =>
          api.get(`dapi/activities`).then((res) => {
            return res.data.data;
          }),
      },
      {
        queryKey: ['cat'],
        queryFn: () =>
          api.get(`dapi/categories`).then((res) => {
            return res.data.data;
          }),
      },
    ],
  });

  useEffect(() => {
    setCategories(cat.data);
    setActivities(act.data);
  }, [cat.data, act.data]);

  return !isAddForm ? (
    <div className="d-grid gap-2 mt-3">
      <Button variant="dark" size="lg" onClick={addForm}>
        Add New Activity
      </Button>
    </div>
  ) : (
    <>
      <div className="d-flex justify-content-end mb-3">
        <MaterialIcon icon="close" onClick={removeForm} />
      </div>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setValue({
              activity: newValue,
            });
            setActpoin(0);
          } else if (newValue && newValue.inputValue) {
            setValue({
              activity: newValue.inputValue,
            });
            setActpoin(0);
          } else {
            setValue(newValue);
            setActpoin(newValue?.poin);

            const filcat = cat.data.filter((cats) => cats.id === parseInt(newValue?.category, 10));
            if (filcat?.length > 0) {
              setCategory(filcat[0]);
            }
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filt(options, params);

          const { inputValue } = params;
          const isExisting = options.some((option) => inputValue === option.activity);
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              activity: `Add "${inputValue}"`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="free-solo-with-text-demo"
        options={activities || []}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.activity;
        }}
        renderOption={(props, option) => <li {...props}>{option.activity}</li>}
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
            options={categories || []}
            value={category}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setCategory({
                  category_name: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                setCategory({
                  category_name: newValue.inputValue,
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
              return option.category_name;
            }}
            renderOption={(props, option) => <li {...props}>{option.category_name}</li>}
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

Newtask.propTypes = {
  refetch: PropTypes.func,
};
export default Newtask;
