import React, { useState } from "react";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import { Card, CardBody, CardHeader } from 'reactstrap';
import CarUsage from "./CarUsage";
import Grafik from "./Grafik";
import AvailableCar from "./AvailableCar";
import PermintaanMobil from "./PermintaanMobil";
import TakeNBack from "./TakeNBack";
import PengisianBbm from "./PengisianBbm";


const Mobil = () => {
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
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
                                    <strong>PERMINTAAN</strong> &nbsp;&nbsp;
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
                                    <strong>PENGAMBILAN & PENGEMBALIAN</strong> &nbsp;&nbsp;
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
                                    <strong>PENGISIAN BBM</strong> &nbsp;&nbsp;
                                </Badge>
                            }
                            value="4"
                        />
                    </TabList>
                </Card>

                <TabPanel value="1" className="ps-0 pe-0">
                    {/* Grafik BBM */}
                    <Grafik />

                    {/* Available Car */}
                    <Card className="mt-4">
                        <CardHeader><strong>Mobil Operasional yang Tersedia</strong></CardHeader>
                        <CardBody>
                            <AvailableCar />
                        </CardBody>
                    </Card>

                    {/* Table Car Usage */}
                    <Card>
                        <CardHeader><strong>Daftar Penggunaan Mobil</strong></CardHeader>
                        <CardBody className="px-4">
                            <CarUsage />
                        </CardBody>
                    </Card>
                </TabPanel>

                <TabPanel value="2" className="ps-0 pe-0">
                    <PermintaanMobil />
                </TabPanel>

                <TabPanel value="3" className="ps-0 pe-0">
                    <TakeNBack />
                </TabPanel>

                <TabPanel value="4" className="ps-0 pe-0">
                    <PengisianBbm />
                </TabPanel>

            </TabContext>

        </>
    );
};

export default Mobil;