import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import useAxios from '../../hooks/useAxios';

const ListAfterReview = React.forwardRef((props, ref) => {
    const api = useAxios();
    const [data, setData] = useState([]);

    const fetchData = () => {
        api.get('dapi/mobil/get-permintaan-after')
            .then((response) => {
                if (response.data.success) {
                    setData(response.data.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching after review data:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Allow parent to trigger refresh
    React.useImperativeHandle(ref, () => ({
        refreshData: fetchData
    }));

    const columns = [
        { name: 'Keperluan', selector: row => row.keperluan, sortable: true },
        { name: 'Dibuat', selector: row => row.created_by_name, sortable: true },
        { name: 'Dari', selector: row => new Date(row.mulai).toLocaleString(), sortable: true }, // Convert to local date-time string using toLocaleStringrow.mulai, sortable: true },
        { name: 'Sampai', selector: row => new Date(row.hingga).toLocaleString(), sortable: true }, // Convert to local date-time string using toLocaleStringrow.hingga, sortable: true },
        { name: 'Status', selector: row => row.status===1?'Disetujui':'Ditolak', sortable: true },
        {name:'Direview',selector:row=>row.review_by_name,sortable:true},
        {name:'Keterangan',selector:row=>row.ket,sortable:true},
        // Tambahkan kolom lain sesuai kebutuhan
    ];

    return (
        <DataTable
            title="Permintaan Setelah Review"
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            striped
        />
    );
});

export default ListAfterReview;
