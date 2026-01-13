import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { Container, Card, CardBody, Row, Col, Badge } from 'reactstrap';
import DataTable from 'react-data-table-component';
import MaterialIcon from '@material/react-material-icon';
import rupiah from '../../utils/rupiah';
import './Asset.scss';


const Scan = () => {
    const baseURL = process.env.REACT_APP_BASEURL;
    const { assetId } = useParams();
    // const [sesImg, setSesImg] = useState(new Date());
    const [data, setData] = useState([]);
    const [imgLoaded, setImgLoaded] = useState(false);
    const detailRef = useRef(null);

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
            name: 'Last Update',
            selector: (row) =>
                `${new Date(row.updated_at).toLocaleDateString('en-us', options)} ${new Date(
                    row.updated_at,
                ).toLocaleTimeString()} `,
        },
    ];

    useEffect(() => {
        fetch(`${baseURL}dapi/inven/${assetId}`)
            .then((res) => res.json())
            .then((d) => {
                setData(d);
                // setSesImg(new Date());
                setImgLoaded(false);
            });
    }, [assetId]);

    return (
        <>
            <Container>
                <Card className="mt-4">
                    <CardBody>
                        <Row className="content flex-column flex-lg-row">
                            <Col
                                xs="12"
                                className="py-4 image position-relative order-1"
                                lg={{ size: 5, order: 1 }}
                                style={{ minHeight: '1px' }}
                            >
                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '1 / 1',
                                    minWidth: '150px',
                                    minHeight: '150px',
                                    background: '#f0f0f0',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {!imgLoaded && (
                                        <MaterialIcon icon="image" style={{ fontSize: 64, color: '#ccc' }} />
                                    )}
                                    <img
                                        src={data.data?.file_image}
                                        alt={data.data?.name || 'Asset Image'}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            display: imgLoaded ? 'block' : 'none',
                                        }}
                                        onLoad={() => setImgLoaded(true)}
                                        onError={() => setImgLoaded(false)}
                                    />
                                </div>
                            </Col>
                            <Col
                                xs="12"
                                className="py-4 text order-2"
                                lg={{ size: 7, order: 2 }}
                                ref={detailRef}
                            >
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
                                        <tr>
                                            <td>Last Update</td>
                                            <td className="text-end">
                                                {`${new Date(data.data?.updated_at).toLocaleDateString(
                                                    'en-us',
                                                    options,
                                                )} ${new Date(data.data?.updated_at).toLocaleTimeString()}`}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Responsible </td>
                                            <td className="text-end">
                                                {data.data?.responsible_list?.map((r) => (
                                                    <Badge color="primary" key={r?.employe_id} className="ms-2">
                                                        {r?.first_name}
                                                    </Badge>
                                                ))}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <div>
                            <DataTable
                                className="mt-0"
                                columns={columns}
                                data={data.data?.child}
                                pagination
                                responsive
                                // Tambahkan customStyles agar minWidth kolom cukup besar untuk scroll
                                customStyles={{
                                    table: {
                                        style: {
                                            minWidth: '600px'
                                        }
                                    }
                                }}
                            />
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </>
    )
}

export default Scan;