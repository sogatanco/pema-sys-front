import React, { useEffect, useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import { useQueries } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import NewAsset from './NewAsset';

const Asset = () => {
  const api = useAxios();
  const [categories, setCategories] = useState([]);
  const [employees, setemployees] = useState();
  const result = useQueries({
    queries: [
      {
        queryKey: ['category', 0],
        queryFn: () =>
          api.get(`dapi/inven/category`).then((res) => {
            return res.data.data;
          }),
      },
      {
        queryKey: ['assigne', 1],
        queryFn: () =>
          api.get(`api/employe/assignment-list`).then((res) => {
            return res.data.data;
          }),
      },
    ],
  });

  useEffect(() => {
    setCategories(result[0].data);
    setemployees(result[1].data);
  }, [result[0].data, result[1].data]);

  return (
    <>
      <Card>
        <CardBody>
          <NewAsset {...{categories, employees}}/>
        </CardBody>
      </Card>
    </>
  );
};

export default Asset;
