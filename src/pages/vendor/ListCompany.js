import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge, Card, CardBody, CardTitle } from 'reactstrap';
import useAxios from '../../hooks/useAxios';

const ListCompany = () => {
  const [dataList, setDataList] = useState([]);
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['general-list-company'],
    queryFn: () =>
      api.get(`dapi/vendor/company`).then((res) => {
        return res.data.data;
      }),
  });

  useEffect(() => {
    setDataList(data);
  }, [data]);

  const handleSearch = (value) => {
    const filterByTitle = data.filter((item) =>
      item.nama_perusahaan.toLowerCase().includes(value.toLowerCase()),
    );

    setDataList(filterByTitle);
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between mb-4">
          <CardTitle tag="h4">List Of Vendors</CardTitle>
          <div className="md-6">
            <input
              type="search"
              className="form-control w-100"
              placeholder="Cari"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        {isLoading ? (
          <p className="text-center">Loading..</p>
        ) : error ? (
          <p className="text-center">Something went wrong.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th width="50" style={{ textAlign: 'center' }}>
                    ID
                  </th>
                  <th width="420" style={{ textAlign: 'center' }}>
                    Vendor
                  </th>
                  <th style={{ textAlign: 'center' }}>Email</th>
                  <th style={{ textAlign: 'center' }}>Phone Number</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataList?.length > 0 ? (
                  dataList?.map((c, i) => (
                    <tr key={c.id}>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{i + 1}</td>
                      <td>
                        <div className="d-flex flex-column gap-0">
                          <span className="fw-bold" style={{ fontSize: '16px' }}>
                            {`${c.bentuk_usaha} ${c.nama_perusahaan}`}
                          </span>
                          <span className="text-muted mb-0">{c.tipe}</span>
                        </div>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {c.email === c.email_alternatif ? (
                          c.email
                        ) : (
                          <div className="d-flex flex-column">
                            <span>{c.email}</span>
                            <span>{c.email_alternatif}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>{c.hp}</td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        {c.status_verifikasi === null && <Badge color="primary">Register</Badge>}
                        {c.status_verifikasi === 'terverifikasi' && (
                          <Badge color="success">Terverifikasi</Badge>
                        )}
                        {c.status_verifikasi === 'revisi' && (
                          <Badge color="warning">Revisi Data</Badge>
                        )}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <Link to={`/vendor/requests/check/${c.id}`}>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            style={{ width: '100%' }}
                          >
                            Detail
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ListCompany;
