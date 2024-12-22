import React, { useEffect } from "react";
import { Row, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from "reactstrap";
import Chart from 'react-apexcharts';
import { useQuery } from "@tanstack/react-query";
import BandwidthUsage from '../sppd/components/BandwidthUsage';
import '../sppd/Dasboard.scss';
import './DashboardAdm.scss';
import useAxios from "../../hooks/useAxios";
import Loader from "../../layouts/loader/Loader";



const DashboardAdm = () => {
    // const [dashView, setDashView] = useState([]);

    const api = useAxios();
    const { data, isLoading } = useQuery({
        queryKey: ['dataDash2'],
        queryFn: () =>
            api.get(`/dapi/adm/dashboard`).then((res) => {
                return res.data.data;
            }),
    });

    useEffect(() => {
        // console.log(dataDash.data);
        // setDashView(data?.dataDash);
        console.log(data?.dataDash)
    }, [data]);


    const optionsbar = {
        chart: {
            fontFamily: "'Rubik', sans-serif",
        },
        // colors: ['#000000'],
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: data?.chart?.divisi,
            labels: {
                show: false
            },
        },
        plotOptions: {
            bar: {
                distributed: true,
                horizontal: false,
            },
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
        },
        yaxis: {
            labels: {
                style: {
                    cssClass: 'grey--text lighten-2--text fill-color',
                },
            },
            //   max: 100,
        },
        title: {
            text: `Grafik Surat PEMA ${new Date().getFullYear()} per Divisi`, // Judul chart
            align: 'left', // Penempatan judul ('left', 'center', 'right')
            style: {
                fontSize: '16px', // Ukuran font
                color: '#6c757d', // Warna font
            },
        },
        tooltip: {
            theme: 'dark',
        },
    };

    const seriesbar = [
        {
            name: 'Surat Masuk',
            data: data?.chart?.value,
        },
    ];
    return (
        <>
            {!isLoading ? <>
            <Row>
                {data?.dataDash?.map((item) => (
                    <Col md={3} className="mt-3" key={item.type}>
                        <BandwidthUsage
                            title={item.title}
                            sub={item.sub}
                            count={item.value?.toString()}
                            tipe={item.type}
                            color={item.color}
                        />
                    </Col>
                ))}


            </Row>

                <Row className="mt-4">
                    <Col md={4}>
                        <h3 className="list-group-title">Surat Keluar Terbaru</h3>
                        <ListGroup>
                            {data?.latest_surat?.map((item) => (
                                <ListGroupItem className="list-group-item-hover list-group-item-strip mb-3" key={item.id}>
                                    <div className="list-group-item-date">{item.nomor_surat}</div>
                                    <ListGroupItemHeading>
                                       Kpd : {item.kepada}
                                    </ListGroupItemHeading>
                                    <ListGroupItemText>
                                        {item.perihal}
                                    </ListGroupItemText>
                                </ListGroupItem>
                            ))}

                            {data?.latest_surat?.length === 0 && (
                                <ListGroupItem className=" mb-3">
                                    <div className="list-group-item-date">&nbsp;</div>
                                    <ListGroupItemHeading className="text-center">
                                        Belum ada Data
                                    </ListGroupItemHeading>
                                    <ListGroupItemText>
                                        &nbsp;
                                    </ListGroupItemText>
                                </ListGroupItem>
                            )}
                        </ListGroup>
                    </Col>
                    <Col md={8}>
                        <Chart options={optionsbar} series={seriesbar} type="bar" height="500" />
                    </Col>
                </Row></> : <Loader/>}



        </>
    );
};

export default DashboardAdm;