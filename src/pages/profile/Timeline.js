import React, { useState } from 'react';
import { Card } from 'reactstrap';
import './Timeline.scss';

import ProfileNav from './ProfileNav';
import ProfileTabContent from './ProfileTabContent';

const Timeline = () => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <Card>
        <ProfileNav toggle={toggle} activeTab={activeTab} />
        <ProfileTabContent activeTab={activeTab} />
      </Card>
    </>
  );
};

export default Timeline;
