import React, { useEffect } from "react";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";
import { Input, Badge, Button } from 'reactstrap';
import '../sppd/style.scss';

const ListSurat = ({ listSurat }) => {

    const [search, setSearch] = React.useState('');
    const [listP, setListP] = React.useState([]);

    useEffect(() => {
        setListP(listSurat);
    }, [listSurat]);

    useEffect(() => {
        const result = listSurat?.filter((p) =>
            p.kepada.toLocaleLowerCase().match(search.toLocaleLowerCase()) || p.nomor_surat.toLocaleLowerCase().match(search.toLocaleLowerCase()),
        );
        setListP(result);
    }, [search]);

    const columns = [
        {
            name: 'Actions',
            width: '380px',
            selector: () => (
                <>
                    <Button
                        className="me-2"
                        size="sm"
                        outline
                        color="danger"
                        tag="input"
                        type="reset"
                        value="Update"
                    />
                    <Button
                        className="me-2"
                        size="sm"
                        outline
                        color="info"
                        tag="input"
                        type="reset"
                        value="View"
                    />
                    <Button
                        className="me-2"
                        size="sm"
                        outline
                        color="dark"
                        tag="input"
                        type="reset"
                        value="Approval"
                    />
                    <Button
                        className="me-2"
                        size="sm"
                        outline
                        color="success"
                        tag="input"
                        type="reset"
                        value="Logs"
                    />
                    <Button
                        className="me-2"
                        size="sm"
                        outline
                        color="warning"
                        tag="input"
                        type="reset"
                        value="Review"
                    />

                </>


            ),
        },
        {
            name: 'Nomor Surat',
            selector: (row) => row.nomor_surat,
        },
        {
            name: 'Kepada',
            selector: (row) => row.kepada,
        },
        {
            name: 'Perihal',
            selector: (row) => row.perihal,
        },
        {
            name: 'Diajukan sejak',
            selector: (row) => row.created_at,
        },
        
        {
            name: 'Status',
            selector: (row) => row.status === 'signed' ? (
                <Badge color="success" style={{ width: '100px' }}>
                    Approved
                </Badge>
            ) : row.status === 'rejected' ? (
                <Badge color="danger" style={{ width: '100px' }}>
                    Rejected
                </Badge>
            ) : (
                <Badge color="warning" style={{ width: '100px' }}>
                    Under Review
                </Badge>
            ),
        },
        {
            name: 'Persetujuan Saat ini',
            selector: (row) => row.current_type || '-',
        },
        
        

    ]


    return (
        <div>
            <DataTable
                columns={columns}
                data={listP}
                pagination
                subHeader
                subHeaderComponent={
                    <div className="d-flex justify-content-end w-100">
                        <Input
                            type="text"
                            value={search}
                            placeholder="search . . . . "
                            className="w-25"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                }
            />
        </div>
    )
}

ListSurat.propTypes = {
    listSurat: PropTypes.array
}
export default ListSurat;