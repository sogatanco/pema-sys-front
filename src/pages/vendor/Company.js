import React from 'react';
import ListCompany from './ListCompany';

const Company = () => {
  // const [companies, setCompanies] = useState();
  // const api = useAxios();
  // const result = useQueries({
  //   queries: [
  //     {
  //       queryKey: ['company-list', 0],
  //       queryFn: () =>
  //         api.get(`dapi/vendor/company`).then((res) => {
  //           return res.data.data;
  //         }),
  //     },
  //   ],
  // });

  return <ListCompany />;
};

export default Company;
