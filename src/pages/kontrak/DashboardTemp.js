import { TabContext, TabList, TabPanel } from '@mui/lab';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import { useQueries } from '@tanstack/react-query';
import { Card, CardBody } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import useAxios from '../../hooks/useAxios';
import NewKontrak from './NewKontrak';
import ListKontrak from './ListKontrak';

const Dashboard = () => {
    const [value, setValue] = React.useState('1');
    const [employes, setEmployes] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    const api = useAxios();
    const re = useQueries({
        queries: [
            {
                queryKey: ['assigne', 0],
                queryFn: () =>
                    api.get(`api/employe/assignment-list?search=all`).then((res) => {
                        return res.data.data;
                    }),
            }
        ]
    });

    useEffect(() => {
        setEmployes(re[0].data);
    }, [re])


    return (<>

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
                                <strong>DASHBOARD</strong> &nbsp;&nbsp;
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
                                <strong>ADD KONTRAK</strong> &nbsp;&nbsp;
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
                                <strong>LIST KONTRAK</strong> &nbsp;&nbsp;
                            </Badge>
                        }
                        value="3"
                    />

                </TabList>
            </Card>

            <TabPanel value="1" className="ps-0 pe-0">
                {/* Grafik BBM */}
                fgasfa
            </TabPanel>

            <TabPanel value="2" className="ps-0 pe-0">
                <Card><CardBody>
                    <NewKontrak {...{employes}}/>
                </CardBody>

                </Card>
            </TabPanel>

            <TabPanel value="3" className="ps-0 pe-0">
                <Card><CardBody>
                    <ListKontrak />
                </CardBody>

                </Card>
            </TabPanel>


        </TabContext>

    </>)
}

export default Dashboard;