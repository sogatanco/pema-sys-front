import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useAxios from '../../hooks/useAxios';

const ListBbm = () => {
    const api = useAxios();
    const [data, setData] = useState([]);

    const fetchData = () => {
        api.get('dapi/mobil/get-bbm')
            .then((response) => {
                if (response.data.success) {
                    console.log( response.data.data);
                    setData(response.data.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching BBM data:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            name: 'Unit Kendaraan',
            selector: row => `${row.name}`,
            sortable: true,
        },
        {
            name: 'Jenis BBM',
            selector: row => row.jenis_bbm,
            sortable: true,
        },
        {
            name: 'Jumlah Biaya (Rp)',
            selector: row => row.jumlah,
            sortable: true,
        },
        {
            name: 'Tanggal Pengisian',
            selector: row => row.w_pengisian,
            sortable: true,
        },
        {
            name: 'Pengisian Oleh',
            selector: row => row.oleh_name,
            sortable: true,
        },
    ];

    return (
        <DataTable
            title="Daftar Pengisian BBM"
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            striped
        />
    );
};

export default ListBbm;
