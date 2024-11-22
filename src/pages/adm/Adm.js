import React, { useEffect, useState } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Tab from '@mui/material/Tab';
import { useQueries } from '@tanstack/react-query';
import MaterialIcon from '@material/react-material-icon';
import Badge from '@mui/material/Badge';
import useAxios from '../../hooks/useAxios';
import TulisSurat from './TulisSurat';

const Adm = () => {
  const api = useAxios();

  const formData=JSON.parse(localStorage.getItem('formData'))
  const [value, setValue] = useState('1');
  const [tulisForm, setTulisForm] = useState(formData?.tulisForm||false);
  const [divisis, setDivisis] = useState([]);
  const [mydivisi, setMyDivisi] = useState('');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=>{
    localStorage.setItem('formData', JSON.stringify({tulisForm}));
  }, [tulisForm])

  const dataStatic = useQueries({
    queries: [
      {
        queryKey: ['divisi', 0],
        queryFn: () =>
          api.get(`dapi/adm/divisi`).then((res) => {
            return res.data.data;
          }),
      },
    ],
  });

  useEffect(() => {
    setDivisis(dataStatic[0].data?.other_divisis);
    setMyDivisi(dataStatic[0].data?.my_divisi?.organization_id?.toString());
  },[dataStatic])

  return (
    <>
      <TabContext value={value}>
        <Card className="mb-1">
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            vertical="sm"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label={
                <Badge
                  badgeContent={0}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  color="primary"
                >
                  <strong>TULIS SURAT</strong> &nbsp;&nbsp;
                </Badge>
              }
              value="1"
            />

            <Tab
              label={
                <Badge
                  badgeContent={0}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  color="primary"
                >
                  <strong>SURAT MASUK</strong> &nbsp;&nbsp;
                </Badge>
              }
              value="2"
            />

            <Tab
              label={
                <Badge
                  badgeContent={0}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  color="primary"
                >
                  <strong>SURAT KELUAR</strong> &nbsp;&nbsp;
                </Badge>
              }
              value="3"
            />

            <Tab
              label={
                <Badge
                  badgeContent={0}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  color="primary"
                >
                  <strong>PERLU PARAF</strong> &nbsp;&nbsp;
                </Badge>
              }
              value="4"
            />

            <Tab
              label={
                <Badge
                  badgeContent={0}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  color="primary"
                >
                  <strong>PERLU TANDA TANGAN</strong> &nbsp;&nbsp;
                </Badge>
              }
              value="5"
            />
          </TabList>
        </Card>

        <TabPanel value="1" className="ps-0 pe-0">
          <Card>
            <CardBody>
              {tulisForm ? (
                <>
                  <MaterialIcon
                    icon="close"
                    className="mb-3 float-end"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setTulisForm(!tulisForm)}
                  />
                  <TulisSurat divisis={divisis} mydivisi={mydivisi} />
                </>
              ) : (
                <Button
                  color="primary"
                  size="lg"
                  style={{ width: '100%' }}
                  onClick={() => setTulisForm(!tulisForm)}
                >
                  Buat Surat Baru
                </Button>
              )}
            </CardBody>
          </Card>
        </TabPanel>
      </TabContext>
    </>
  );
};
export default Adm;
