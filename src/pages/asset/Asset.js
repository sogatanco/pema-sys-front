import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody } from 'reactstrap';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useQueries } from '@tanstack/react-query';
import { useLocation } from "react-router-dom";
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import NewAsset from './NewAsset';
import AssetOnMe from './AssetOnMe';
import ListAsset from './ListAsset';
import Request from './Request';


const Asset = () => {
  const { hash } = useLocation();
  const [value, setValue] = useState('2');
  const [onMe, setOnMe] = useState();
  const { auth } = useAuth();
  const api = useAxios();
  const [listAsset, setListAsset] = useState();
  const [reqser, setReqser] = useState();
  const result = useQueries({
    queries: [
      {
        queryKey: ['list', 0],
        queryFn: () =>
          api
            .get(`${auth?.user.roles.includes('PicAsset') ? 'dapi/inven' : 'dapi/inv/onme'}`)
            .then((res) => {
              return res.data.data;
            }),
      },
      {
        queryKey: ['onMe', 1],
        queryFn: () =>
          api.get(`dapi/inv/onme`).then((res) => {
            return res.data.data;
          }),
      },
      {
        queryKey: ['req', 2],
        queryFn: () =>
          api.get(`dapi/inv/getrservice`).then((res) => {
            return res.data.data;
          }),
      },
    ],
  });


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { refetch } = result[0];
  const refetch1 = useCallback(() => {
    result[1].refetch();
  }, [result[1]]);

  const loading1=result[0].isLoading;

  const refetch2 = useCallback(() => {
    result[2].refetch();
  }, [result[2]]);

  useEffect(() => {
    if (hash === '#request') {
      setValue('3')
    } else if (hash === '#all') {
      setValue('1')
    }else{
      setValue('2')
    }
  }, [hash]);

  useEffect(()=>{
    if(auth?.user.roles.includes('PicAsset')){
      setValue('1')
    }else{
      setValue('2')
    }
  },[auth])
  useEffect(() => {

    setListAsset(result[0].data);
    setReqser(result[2].data);
    console.log(reqser)
    setOnMe(result[1].data);
    console.log(onMe)
  }, [result[0].data, result[1].data, result[2].data]);

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
                  badgeContent={result[1].data?.length}
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
                  badgeContent={result[2].data?.length}
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
                  <NewAsset {...{ refetch }} />
                  <ListAsset {...{ listAsset, refetch, loading1 }} className="mt-2"></ListAsset>
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
              <AssetOnMe {...{ onMe, handleChange, refetch1, refetch2 }} />
            </CardBody>
          </Card>
        </TabPanel>
        <TabPanel value="3" className="ps-0 pe-0">
          <Card>
            <CardBody>
              <Request {...{ reqser, refetch2 }} />
            </CardBody>
          </Card>
        </TabPanel>
      </TabContext>

      {/*  */}
    </>
  );
};

export default Asset;
