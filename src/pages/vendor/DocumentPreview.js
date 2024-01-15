import React from 'react';
import { useLocation } from 'react-router-dom';

const DocumentPreview = () => {
  const { search } = useLocation();
  // const useQuery = () => new URLSearchParams(useLocation().search);

  // const query = useQuery();

  // console.log(query.get('doc'));

  return (
    <div style={{ height: '98vh' }}>
      <embed src={`data:application/pdf;base64,${search.split('=')[2]}`} className="w-100 h-100" />
    </div>
  );
};

export default DocumentPreview;
