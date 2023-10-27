import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Badge from '@mui/material/Badge';
import { Card } from 'reactstrap';
import Daily from './Daily';
import useAxios from '../../hooks/useAxios';
import Review from './Review';


const Home = () => {
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const api = useAxios();

  const {data, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: () =>
      api.get(`dapi/mustreview`).then((res) => {
        return res.data.data;
      }),
  });

  return (
    <>
      <TabContext value={value}>
        <Card className="mb-1">
          <TabList onChange={handleChange} aria-label="lab API tabs example">
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
                  <strong>MY ACTIVITY</strong> &nbsp;&nbsp;
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
                  <strong>TEAMS ACTIVITY</strong> &nbsp;&nbsp;
                </Badge>
              }
              value="2"
            />

            <Tab
              label={
                <Badge
                  badgeContent={data?.length}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  color="primary"
                >
                  <strong>NEED TO REVIEW</strong> &nbsp;&nbsp;
                </Badge>
              }
              value="3"
            />

          </TabList>
        </Card>

        <TabPanel value="1" className="ps-0 pe-0">
          <Daily></Daily>
        </TabPanel>
        <TabPanel value="2">
          dgsgsdg
        </TabPanel>
        <TabPanel value="3" className="ps-0 pe-0">
        <Review misal={data} {...{ refetch}}></Review>
        </TabPanel>
      </TabContext>
    </>
  );
};

export default Home;
