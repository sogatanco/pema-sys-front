import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import RequestItem from './RequestItem';
import useAxios from '../../../hooks/useAxios';

const Request = () => {
  const [submitList, setSubmitList] = useState();
  const [updateList, setUpdateList] = useState();

  const api = useAxios();

  const { data } = useQuery({
    queryKey: ['request-list'],
    queryFn: () =>
      api.get(`dapi/vendor/request-list`).then((res) => {
        return res.data.data;
      }),
  });

  useEffect(() => {
    const reviewSubmitFiltered = data?.filter((item) => {
      return item.status_verifikasi === 'review_submit';
    });
    setSubmitList(reviewSubmitFiltered);

    const reviewUpdateFiltered = data?.filter((item) => {
      return item.status_verifikasi === 'review_update';
    });
    setUpdateList(reviewUpdateFiltered);
  }, [data]);

  return (
    <>
      <RequestItem title="Company Data Requests" data={submitList} source="submit" />
      <RequestItem title="Company Update Data Requests" data={updateList} source="update" />
    </>
  );
};

export default Request;
