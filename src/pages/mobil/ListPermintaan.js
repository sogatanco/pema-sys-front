import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import { Button, TextField } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS for react-confirm-alert
import PropTypes from 'prop-types';
import { alert } from '../../components/atoms/Toast';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth'; // Import your authentication hook

const ListPermintaan = forwardRef((props, ref) => {
  const api = useAxios();
  const [data, setData] = useState([]);
  // const { auth } = useAuth(); // Hapus jika tidak digunakan di bawah
  const {auth} = useAuth(); // Gunakan langsung jika hanya butuh auth.user

  // Tambahkan validasi props.afterReviewRef agar tidak ada warning
  const afterReviewRef = props.afterReviewRef || null;

  // Use useCallback to ensure fetchData is stable and doesn't cause unnecessary re-renders
  const fetchData = useCallback(() => {
    console.log(auth.user);
    const endpoint = auth.user?.roles?.includes('PICMobil') 
        ? 'dapi/mobil/get-permintaan-all' 
        : 'dapi/mobil/get-permintaan';

    api.get(endpoint)
        .then((response) => {
            const formattedData = response.data.data.map(item => ({
                ...item,
                displayMobil: `${item.brand} - ${item.plat}`, // Tambahkan tampilan brand - plat
            }));
            setData(formattedData);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
  }, [auth.user, api]);

  const handleDelete = (id, status) => {
    if (status !== null) {
      alert('error', 'Tidak bisa dihapus, permintaan sudah direview.');
      return;
    }

    confirmAlert({
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus permintaan ini?',
      buttons: [
        {
          label: 'Ya',
          onClick: () => {
            api.post(`dapi/mobil/delete-permintaan/${id}`)
              .then(() => {
                alert('success', 'Permintaan berhasil dihapus.');
                fetchData(); // Refresh data after deletion
              })
              .catch((error) => {
                console.error('Error deleting data:', error);
                alert('error', 'Terjadi kesalahan saat menghapus permintaan.');
              });
          },
        },
        {
          label: 'Tidak',
          onClick: () => {},
        },
      ],
    });
  };

  const handleApprove = (id) => {
    api.post(`dapi/mobil/approve-permintaan/${id}`)
        .then(() => {
            alert('success', 'Permintaan berhasil disetujui.');
            fetchData(); // Refresh data after approval
            if (afterReviewRef && afterReviewRef.current && afterReviewRef.current.refreshData) {
                afterReviewRef.current.refreshData();
            }
        })
        .catch((error) => {
            console.error('Error approving request:', error);
            alert('error', 'Terjadi kesalahan saat menyetujui permintaan.');
        });
  };

  const handleReject = (id) => {
    let reason = '';

    confirmAlert({
        title: 'Konfirmasi Penolakan',
        message: 'Masukkan alasan penolakan:',
        customUI: ({ onClose }) => (
            <div className="custom-ui">
                <h1>Konfirmasi Penolakan</h1>
                <TextField
                    label="Alasan Penolakan"
                    fullWidth
                    multiline
                    rows={3}
                    onChange={(e) => {
                        reason = e.target.value;
                    }}
                />
                <div style={{ marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            if (!reason.trim()) {
                                alert('error', 'Harap masukkan alasan penolakan.');
                                return;
                            }
                            api.post(`dapi/mobil/reject-permintaan/${id}`, { ket:reason })
                                .then(() => {
                                    alert('success', 'Permintaan berhasil ditolak.');
                                    fetchData(); // Refresh data after rejection
                                    if (afterReviewRef && afterReviewRef.current && afterReviewRef.current.refreshData) {
                                        afterReviewRef.current.refreshData();
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error rejecting request:', error);
                                    alert('error', 'Terjadi kesalahan saat menolak permintaan.');
                                });
                            onClose();
                        }}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                        style={{ marginLeft: '10px' }}
                    >
                        Batal
                    </Button>
                </div>
            </div>
        ),
    });
  };

  useEffect(() => {
    fetchData(); // Fetch data only once when the component mounts
  }, []);

  useImperativeHandle(ref, () => ({
    refreshData: fetchData, // Expose the fetchData method to the parent
  }));

  // Define the columns
  const columns = [
    {
        name: 'Aksi',
        cell: row => (
            <>
                {auth.user?.roles?.includes('PICMobil') && (
                    <>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleApprove(row?.id)}
                            style={{ marginRight: '5px' }}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleReject(row?.id)}
                            style={{ marginRight: '5px' }}
                        >
                            Reject
                        </Button>
                    </>
                )}
                {!auth.user?.roles?.includes('PICMobil') && (
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        disabled={row?.status !== null}
                        onClick={() => handleDelete(row?.id, row?.status)}
                    >
                        Hapus
                    </Button>
                )}
            </>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: '250px', // Luaskan kolom aksi
    },
    {
        name: 'Tgl Pengajuan',
        selector: row => row?.created_at ? new Date(row?.created_at).toLocaleString() : 'Unknown',
        sortable: true,
    },
    {
        name: 'Keperluan',
        selector: row => row?.keperluan,
        sortable: true,
    },
    {
        name: 'Mobil',
        selector: row => row?.displayMobil || '-',
        sortable: true,
    },
    {
        name: 'Dari',
        selector: row => new Date(row?.mulai).toLocaleString(),
        sortable: true,
    },
    {
        name: 'Sampai',
        selector: row => new Date(row?.hingga).toLocaleString(),
        sortable: true,
    },
    {
        name: 'Perlu Sopir',
        selector: row => (row?.sopir === 1 ? 'Ya' : 'Tidak'),
        sortable: true,
    },
    {
        name: 'Status',
        selector: row => {
            if (row?.status === null) return 'Under Review';
            if (row?.status === 0) return 'Reject';
            if (row?.status === 1) return 'Approve';
            return 'Unknown';
        },
        sortable: true,
    },
    {
        name: 'Keterangan',
        selector: row => row?.ket || '-',
        sortable: false,
    },
  ];

  return (
    <DataTable
      title="List Permintaan Kendaraan"
      columns={columns}
      data={data}
      pagination
      highlightOnHover
      striped
    />
  );
});

ListPermintaan.propTypes = {
  afterReviewRef: PropTypes.object, // Perbaiki propTypes agar sesuai warning
};

export default ListPermintaan;
