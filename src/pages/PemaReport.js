import React from 'react';
import { Navbar, Row, Col } from 'reactstrap';
import Marquee from 'react-fast-marquee';
import Clock from 'react-live-clock';
import './PemaReport.css';

const PemaReport = () => {
  return (
    <>
      <Navbar color="none" fixed="bottom" className="py-0">
        <Row className="p">
          <Col xs="10" className="te">
            <Marquee>
             PEMA-LAMI KSO lakukan ekspor perdana Lobster ke Malaysia  || Penandatanganan Mou, Wujud Sinergi Pemanfaatan Karbon Dan Jasa Lingkungan Hutan Mangrove Antara PEMA dan Pemerintah Kota Langsa || PEMA - JRG KSO Siap Bawa Kopi Gayo Kuasai Pasar Sumatera
            </Marquee>
          </Col>
          <Col className="t" xs="2">
            <p className="jam text-center mt-1 mb-0">
              <Clock format="hh:mm:ss" ticking="true" />
            </p>
          </Col>
        </Row>

        {/* <NavbarBrand href="/">reactstrap</NavbarBrand>

        <NavbarText>
          
        </NavbarText> */}
      </Navbar>
      <div className='frame'>
      <iframe title="server01" className='isi' src="https://app.powerbi.com/reportEmbed?reportId=41867b84-77dd-435d-ad9d-ed21502efe1d&autoAuth=true&ctid=8396733b-c28e-45b7-953e-e57dd19d52d8"  allowFullScreen="true"></iframe>
      </div>

     
    </>
  );
};
export default PemaReport;
