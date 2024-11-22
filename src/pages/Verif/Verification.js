import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import MaterialIcon from '@material/react-material-icon';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import useAxios from '../../hooks/useAxios';
import logo from '../../assets/images/qrcode/qr-code-logo.png';
import './Style.scss';

const Verification = () => {
  const { idDoc } = useParams();
  const [searchParams] = useSearchParams();

  const vtype = searchParams.get('type');

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const api = useAxios();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      await api
        .post(`dapi/verif/${idDoc}`, { type: vtype })
        .then((res) => {
          if (res.data.data.status === 'approve') {
            setIsLoading(false);
            setData(res.data.data);
          } else {
            setError(true);
            setIsLoading(false);
          }
        })
        .catch(() => {
          setError(true);
          setIsLoading(false);
        });
    }

    fetchData();
  }, []);

  return (
    <div className="verified-status">
      <div className="content-status">
        {isLoading ? (
          <h5>Loading...</h5>
        ) : error || data === null ? (
            <>
            <img src={logo} alt="logo" />
            {/* <h4>
              {data?.bentuk_usaha} {data?.nama_perusahaan}
            </h4> */}
            
            <div className="verified">
              <div className="icon-close">
              <br/>  <br/> 
                <MaterialIcon icon="close" />
              </div>
              <br/>
             
              
              <span style={{ marginBottom: '-10px', textTransform: 'uppercase' }}>
                <strong> Dokumen {data?.jenis_name}</strong>
              </span>
              <span className="small mt-0">ini tidak terdaftar di database kami</span>
            </div>

            <br/>
            <br/>
            <br />
            <div className="copyright">
              <span>DOCUMENT VERIFICATION SYSTEM</span>
              <span>© {new Date().getFullYear()} PT Pembangunan Aceh</span>
            </div>
            <br/> 
          </>
        ) : (
          <>
            <img src={logo} alt="logo" />
            {/* <h4>
              {data?.bentuk_usaha} {data?.nama_perusahaan}
            </h4> */}
            <div className="verified">
              <div className="icon-check">
                <MaterialIcon icon="check" />
              </div>
              <span style={{ marginBottom: '-10px', textTransform: 'uppercase' }}>
                <strong> Dokumen {data?.jenis_name}</strong>
              </span>
              <span className="small mt-0">ini benar telah ditandatangani</span>
            </div>

            <div className="spda-status-container">
              <div className="no-spda">
                <span>oleh</span>
                <span>{data?.employe_name}</span>
              </div>
              <div className="spda-status">
                <span>Pada</span>
                <span>
                  {dayjs(data?.updated_at).locale('id').format('dddd, DD MMMM YYYY') || ''}
                </span>
              </div>
              <div className="spda-status">
                <span>Jam</span>
                <span>{dayjs(data?.updated_at).locale('id').format('HH:mm:ss') || ''}</span>
              </div>
            </div>
            <br />
            <div className="copyright">
              <span>DOCUMENT VERIFICATION SYSTEM</span>
              <span>© {new Date().getFullYear()} PT Pembangunan Aceh</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Verification;
