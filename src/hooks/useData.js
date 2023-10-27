// import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios';

const useEmployee = () => {
  const api = useAxios();
  return api.get(`api/employe`);
};

const tes = () => {
  console.log('tes');
};

export { useEmployee, tes };
