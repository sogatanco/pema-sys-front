import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import MaterialIcon from '@material/react-material-icon';
import { Badge } from 'reactstrap';
import { QRCode } from 'react-qrcode-logo';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import useAxios from '../../hooks/useAxios';
import logo from '../../assets/images/qrcode/qr-code-logo.png';
import FMerge from '../adm/Fungsi/FMerge';
import GenerateSurat from '../adm/Fungsi/Generate';
import './Style.scss';


const Verification = () => {
  const qrCodeRef = useRef();
  const baseURL1 = process.env.REACT_APP_FRONTEND;
  const { idDoc } = useParams();
  const [searchParams] = useSearchParams();

  const vtype = searchParams.get('type');

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const api = useAxios();


  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      await api
        .post(`dapi/verif/${idDoc}`, { type: vtype })
        .then((res) => {
          console.log(res.data.data)
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

  const viewSurat = async () => {
    setLoading(true);

    const pdf = await GenerateSurat(data?.detail, qrCodeRef);

    FMerge(pdf, data?.detail?.fileLampiran).then((res) => {
      window.open(res);
      setLoading(false);
    });


  }

  return (


    <>
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
                  <br />  <br />
                  <MaterialIcon icon="close" />
                </div>
                <br />


                <span style={{ marginBottom: '-10px', textTransform: 'uppercase' }}>
                  <strong> Dokumen {data?.jenis_name}</strong>
                </span>
                <span className="small mt-0">ini tidak terdaftar di database kami</span>
              </div>

              <br />
              <br />
              <br />
              <div className="copyright">
                <span>DOCUMENT VERIFICATION SYSTEM</span>
                <span>© {new Date().getFullYear()} PT Pembangunan Aceh</span>
              </div>
              <br />
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
                  <span>sebagai</span>
                  <span>{data?.id_current_position}</span>
                </div>
                <div className="spda-status">
                  <span>Pada</span>
                  <span>
                    {dayjs(data?.updated_at).locale('id').format('dddd, DD MMMM YYYY') || ''}
                  </span>
                </div>
              </div>
              {
                data?.jenis_doc === 2 && (
                  <Badge color="info" style={{ zIndex: 3, cursor: 'pointer' }} onClick={() => viewSurat()}> {loading?'Loading...': 'Lihat Surat'} </Badge>

                )
              }

              <br />
              <div className="copyright">
                <span>DOCUMENT VERIFICATION SYSTEM</span>
                <span>© {new Date().getFullYear()} PT Pembangunan Aceh</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div ref={qrCodeRef} style={{ display: 'none' }}>
        <QRCode
          value={`${baseURL1}verification/${data?.no_document}?type=sign`}
          size={400}
          qrStyle="dots"
          logoImage={logo} // Ganti dengan URL logo kamu
          logoWidth={100}
          logoHeight={100}
          eyeRadius={20}
          fgColor="#0F52BA"
        />
      </div></>
  );
};

export default Verification;
