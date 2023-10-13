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
  const { roles } = auth.user;
  const api = useAxios();
  const { projectId } = useParams();

  const queryParams = new URLSearchParams(window.location.search);

  const queryTo = queryParams.get('to');

  useEffect(() => {
    if (queryTo === 'review') {
      setNavActive(5);
    } else if (queryTo === 'handover') {
      setNavActive(6);
    } else if (queryTo === 'overview') {
      setNavActive(1);
    } else if (queryTo === 'activities') {
      setNavActive(7);
    }
  }, [queryParams]);

  useEffect(() => {
    async function fetchTotalReview() {
      await api
        .get(`api/task/${projectId}/manager/review`)
        .then((res) => setCurrentTotalReview(res.data.data.filter((task) => task.status === 2)))
        .catch((err) => console.log(err));
    }
    if (roles.includes('Manager')) {
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
        {!roles.includes('Director') && (
          <Link
            className={`${navActive === 2 && 'active'} text-muted fw-bold`}
            onClick={() => setNavActive(2)}
          >
            Board
          </Link>
        )}
        {(roles.includes('Manager') || roles.includes('Director')) && (
          <Link
            className={`${navActive === 7 && 'active'} text-muted fw-bold`}
            onClick={() => setNavActive(7)}
          >
            Activities
          </Link>
        )}
        {roles.includes('Staff') && (
          <>
            <Link
              className={`${navActive === 4 && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(4)}
            >
              Files
            </Link>
          </>
        )}
        {roles.includes('Director') && (
          <Link
            className={`${navActive === 8 && 'active'} text-muted fw-bold`}
            onClick={() => setNavActive(8)}
          >
            BAST Review{' '}
            <div
              color="danger"
              className={`count ${
                currentTotalReview.length > 0 ? 'bg-danger text-white' : 'bg-light text-dark'
              }`}
            >
              {currentTotalReview.length}
            </div>
          </Link>
        )}
        {roles.includes('Manager') && (
          <>
            <Link
              className={`${navActive === 3 && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(3)}
            >
              Members
            </Link>
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
