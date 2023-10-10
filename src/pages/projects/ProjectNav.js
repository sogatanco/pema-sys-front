import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { Col } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const ProjectNav = ({ navActive, setNavActive, totalReview }) => {
  const [currentTotalReview, setCurrentTotalReview] = useState('');
  const { auth } = useAuth();
  const api = useAxios();
  const { projectId } = useParams();

  const queryParams = new URLSearchParams(window.location.search);

  const queryTo = queryParams.get('to');

  useEffect(() => {
    if (queryTo === 'review') {
      setNavActive(5);
    } else if (queryTo === 'handover') {
      setNavActive(6);
    }
  }, []);

  useEffect(() => {
    async function fetchTotalReview() {
      await api
        .get(`api/task/${projectId}/manager/review`)
        .then((res) => setCurrentTotalReview(res.data.data.filter((task) => task.status === 2)))
        .catch((err) => console.log(err));
    }
    if (auth?.user.roles.includes('Manager')) {
      fetchTotalReview();
    }
  }, [totalReview]);

  const { isLoading, data } = useQuery({
    queryKey: ['project-number'],
    queryFn: () =>
      api.get(`api/project/${projectId}`).then((res) => {
        return res.data.data;
      }),
  });

  return (
    <Col md="12" className="d-flex justify-content-between mb-2 align-items-center">
      <div className="project-nav">
        <Link
          className={`${navActive === 1 && 'active'} text-muted fw-bold`}
          onClick={() => setNavActive(1)}
        >
          Overview
        </Link>
        <Link
          className={`${navActive === 2 && 'active'} text-muted fw-bold`}
          onClick={() => setNavActive(2)}
        >
          Board
        </Link>
        {!auth?.user.roles.includes('Manager') && (
          <>
            <Link
              className={`${navActive === 4 && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(4)}
            >
              Files
            </Link>
          </>
        )}
        <Link
          className={`${navActive === 3 && 'active'} text-muted fw-bold`}
          onClick={() => setNavActive(3)}
        >
          Members
        </Link>
        {auth?.user.roles.includes('Manager') && (
          <>
            <Link
              className={`${navActive === 5 && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(5)}
            >
              Review{' '}
              <div
                color="danger"
                className={`count ${
                  currentTotalReview.length > 0 ? 'bg-danger text-white' : 'bg-light text-dark'
                }`}
              >
                {currentTotalReview.length}
              </div>
            </Link>
            <Link
              className={`${navActive === 6 && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(6)}
            >
              Handover{' '}
            </Link>
          </>
        )}
      </div>
      <h3 className="fw-bold">{isLoading ? 'Loading..' : data?.project_number}</h3>
    </Col>
  );
};

ProjectNav.propTypes = {
  navActive: PropTypes.any,
  setNavActive: PropTypes.func,
  totalReview: PropTypes.number,
};

export default ProjectNav;
