import React from 'react';
import { Alert } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
// import Sppd from './Adm';
import Adm from './Adm';



const Index = () => {

  const [visible, setVisible] = React.useState(true);

const onDismiss = () => setVisible(false);

 
  return (
    <>
     <Alert color="info" isOpen={visible} toggle={onDismiss}>
      Baca Dokumentasi sistem ADM <a href='https://gofile.me/7mNIn/PBFC3xKHr' target='_blank' rel='noreferrer' style={{textDecoration:'none'}}>disini !!!</a> 
    </Alert>
      <BreadCrumbs />
      <Adm />
    </>
  );
};

export default Index;
