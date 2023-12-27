import React, { useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CompanyList from './CompanyList';

const Company = () => {
  const [companies, setCompanies] = useState();
  const api = useAxios();
  const result = useQueries({
    queries: [
      {
        queryKey: ['company-list', 0],
        queryFn: () =>
          api.get(`dapi/vendor/company`).then((res) => {
            return res.data.data;
          }),
      },
    ],
  });

  useEffect(() => {
    setCompanies(result[0].data);
  }, [result[0].data]);

  return (
    <>
      <BreadCrumbs />
      <CompanyList {...{companies}}/>
    </>
  );
};



export default Company;
