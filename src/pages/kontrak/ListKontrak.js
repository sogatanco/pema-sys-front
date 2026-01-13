import DataTable from "react-data-table-component";

const ListKontrak = () => {
    const data = [{ nama: 'sdgsdg', tgl: '05-10-2025' }, { nama: 'sdgsg', tgl: '05-09-2025' }];
    const column = [
        {
            name: 'Nama',
            selector: (row) => row.nama
        }
    ];

    return (
        <>
            <DataTable
                data={data}
                columns={column}
                pagination
                subHeader>

            </DataTable>
        </>
    )
}

export default ListKontrak;