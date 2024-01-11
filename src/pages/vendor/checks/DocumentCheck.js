import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TabMui from '../../../components/tabmui/TabMui';
import TabGeneral from './TabGeneral';
import TabOfficial from './TabOfficial';
import TabDocument from './TabDocument';
import TabPortfolio from './TabPortfolio';
import TabBusinessField from './TabBusinessField';

const tabItems = [
  {
    id: 1,
    title: 'Data Umum',
  },
  {
    id: 2,
    title: 'Data Jajaran/Komisaris',
  },
  {
    id: 3,
    title: 'Dokumen Perusahaan',
  },
  {
    id: 4,
    title: 'Portofolio',
  },
  {
    id: 5,
    title: 'Bidang Usaha',
  },
];
const DocumentCheck = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { id } = useParams();

  return (
    <TabMui items={tabItems} panels={tabItems} {...{ activeTab, setActiveTab }}>
      <>
        {activeTab === 1 && <TabGeneral companyId={id} />}
        {activeTab === 2 && <TabOfficial companyId={id} />}
        {activeTab === 3 && <TabDocument companyId={id} />}
        {activeTab === 4 && <TabPortfolio companyId={id} />}
        {activeTab === 5 && <TabBusinessField companyId={id} />}
      </>
    </TabMui>
  );
};

export default DocumentCheck;
