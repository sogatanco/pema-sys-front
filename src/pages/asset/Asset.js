import React, { useEffect, useState} from 'react';
import { Card, CardBody } from 'reactstrap';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { useLocation } from "react-router-dom";
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import NewAsset from './NewAsset';
import AssetOnMe from './AssetOnMe';
import ListAsset from './ListAsset';
import Request from './Request';


const Asset = () => {
  const { auth } = useAuth();
  const { hash } = useLocation();
  const [value, setValue] = useState(`${localStorage.getItem('page')? localStorage.getItem('page'):auth?.user.roles.includes('PicAsset') ? '1' : '2' }`);
  const [onMe, setOnMe] = useState();

  const api = useAxios();
  const [listAsset, setListAsset] = useState();
  const [reqser, setReqser] = useState();

 

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem('page', newValue);
  };

  useEffect(() => {
    if (hash === '#request') {
      setValue('3')
    } else if (hash === '#all') {
      setValue('1')
      console.log(listAsset)
    }
  }, [hash]);


  const getData = () => {
    if (value === '1') {
      api
        .get(`dapi/inven`)
        .then((res) => {
          setListAsset(res.data.data);
          console.log(res.data.data);
        })
    }else if(value === '2'){
      api.get(`dapi/inv/onme`).then((res) => {
        setOnMe(res.data.data);
      })
    }
      api.get(`dapi/inv/getrservice`).then((res) => {
        setReqser(res.data.data);
      })
    
  }

  useEffect(() => {
    getData();
    console.log(hash)
  }, [value]);

 
  
  return (
    <>
      <TabContext value={value} >
        <Card className="mb-1" >
          <TabList onChange={handleChange} aria-label="lab API tabs example" vertical="sm" variant="scrollable"
            scrollButtons="auto">
            {auth?.user.roles.includes('PicAsset') ? (
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
                    <strong>ALL ASSET</strong> &nbsp;&nbsp;
                  </Badge>
                }
                value="1"
              />
            ) : (
              ''
            )}

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
                  <strong>MY RESPONSIBILITY</strong> &nbsp;&nbsp;
                </Badge>
              }
              value="2"
            />

            <Tab
              label={
                <Badge
                  badgeContent={reqser?.filter((item) => item.status === 'submit')?.length}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  color="warning"
                >
                  <strong>SERVICE APPLICATION</strong> &nbsp;&nbsp;
                </Badge>
              }
              value="3"
            />
          </TabList>
        </Card>

        {auth?.user.roles.includes('PicAsset') ? (
          <TabPanel value="1" className="ps-0 pe-0">
            <Card>
              <CardBody>
                <>
                  <NewAsset refetch={getData} />
                  <ListAsset listAsset={listAsset} refetch={getData} loading1={false} className="mt-2"></ListAsset>
                </>
              </CardBody>
            </Card>
          </TabPanel>
        ) : (
          ''
        )}

        <TabPanel value="2" className="ps-0 pe-0">
          <Card>
            <CardBody>
              <AssetOnMe onMe={onMe} handleChange={handleChange} refetch1={getData} refetch2={getData}/>
            </CardBody>
          </Card>
        </TabPanel>
        <TabPanel value="3" className="ps-0 pe-0">
          <Card>
            <CardBody>
              <Request reqser={reqser} refetch2={getData} />
            </CardBody>
          </Card>
        </TabPanel>
      </TabContext>

      {/*  */}
    </>
  );
};

export default Asset;
