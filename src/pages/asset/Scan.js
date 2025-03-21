import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Card, CardBody, Row, Col, Badge } from 'reactstrap';
import DataTable from 'react-data-table-component';
import rupiah from '../../utils/rupiah';
import './Asset.scss';


const Scan = () => {
    const baseURL = process.env.REACT_APP_BASEURL;
    const { assetId } = useParams();
    const [sesImg, setSesImg] = useState(new Date());
    const [data, setData] = useState([]);

    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const columns = [
        {
            name: 'Asset Number',
            selector: (row) => row.asset_number,
        },
        {
            name: 'Responsible',
            selector: (row) => (
                <>
                    {row?.res_list?.map((r) => (
                        <Badge color="primary" key={r?.employe_id} className="ms-2">
                            {r?.first_name}
                        </Badge>
                    ))}
                </>
            ),
        },
        {
            name: 'Last Udpate',
            selector: (row) =>
                `${new Date(row.updated_at).toLocaleDateString('en-us', options)} ${new Date(
                    row.updated_at,
                ).toLocaleTimeString()} `,
        },
    ];

    useEffect(() => {
        fetch(`${baseURL}dapi/inven/${assetId}`)
            .then((res) => {
                return res.json();
            })
            .then((d) => {
                setData(d);
                setSesImg(new Date());
            });
    }, [assetId]);

    console.log(data)

    return (
        <>
            <Container>
                <Card className="mt-4">
                    <CardBody>
                        <Row className="content">
                            <Col
                                xs='12'
                                sm="12"
                                md="12"
                                lg="5"
                                className=" py-4 image"
                                style={{
                                    backgroundPosition: `center`,
                                    backgroundSize: `cover`,
                                    backgroundRepeat: `no-repeat`,
                                    backgroundImage: `url('${baseURL}inven${data.data?.file}?s=${sesImg}')`,
                                }}>
                            </Col>
                            <Col  xs='12'
                                sm="12"
                                md="12"
                                lg="5" className="py-4 text">
                                <div className="d-flex justify-content-between">
                                    <h2 className="text-bold mb-0">{data.data?.name}</h2>
                                </div>

                                <hr />

                                <table className="w-100">
                                    <tbody>
                                        <tr>
                                            <td>Parent Asset Number</td>
                                            <td className="text-end">{data.data?.asset_number}</td>
                                        </tr>
                                        <tr>
                                            <td>Type</td>
                                            <td className="text-end">{data.data?.type_name}</td>
                                        </tr>
                                        <tr>
                                            <td>Acquisition Price</td>
                                            <td className="text-end">{rupiah(data.data?.price)}</td>
                                        </tr>
                                        <tr>
                                            <td>Current Asset Value</td>
                                            <td className="text-end">{rupiah(data.data?.current)}</td>
                                        </tr>

                                        <tr>
                                            <td>Vendor</td>
                                            <td className="text-end">{data.data?.vendor}</td>
                                        </tr>
                                        <tr>
                                            <td>Acquisition Time</td>
                                            <td className="text-end">{data.data?.acquisition}</td>
                                        </tr>
                                        <tr>
                                            <td>Age </td>
                                            <td className="text-end">{data.data?.old}</td>
                                        </tr>

                                        <tr>
                                            <td>Amount </td>
                                            <td className="text-end">{data.data?.amount} items</td>
                                        </tr>
                                        <tr>
                                            <td>Location </td>
                                            <td className="text-end">{data.data?.location}</td>
                                        </tr>


                                    </tbody>
                                </table>
                            </Col>
                        </Row>

                        <DataTable
                            className="mt-0"
                            columns={columns}
                            data={data.data?.child}
                        />
                    </CardBody>
                </Card>
            </Container>

        </>
    )
}

export default Scan;