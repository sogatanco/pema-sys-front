import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { Col } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const allowedRoles = ['Manager', 'Director'];

const ProjectNav = ({ navActive, setNavActive, totalReview, totalBastReview }) => {
  const [currentTotalReview, setCurrentTotalReview] = useState('');
  const [currentTotalBastReview, setCurrentTotalBastReview] = useState('');
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
    } else if (queryTo === 'bast-review') {
      setNavActive(8);
    }
  }, [queryParams]);

  useEffect(() => {
    async function fetchTotalReview() {
      await api
        .get(`api/task/${projectId}/level1/review`)
        .then((res) => setCurrentTotalReview(res.data.data))
        .catch((err) => console.log(err));
    }
    if (roles?.find((role) => allowedRoles.includes(role))) {
      fetchTotalReview();
    }
  }, [totalReview]);

  useEffect(() => {
    async function fetchTotalBastReview() {
      await api
        .get(`api/project/${projectId}/${auth?.user.employe_id}/bast/review`)
        .then((res) => setCurrentTotalBastReview(res.data.data))
        .catch((err) => console.log(err));
    }
    if (roles?.find((role) => allowedRoles.includes(role))) {
      fetchTotalBastReview();
    }
  }, [totalBastReview]);

  const { isLoading, data } = useQuery({
    queryKey: ['project-number'],
    queryFn: () =>
      api.get(`api/project/${projectId}`).then((res) => {
        return res.data.data;
      }),
  });

  const BoardAllowedRoles = ['Staff', 'Manager'];
  const MembersAllowedRoles = ['Staff', 'Manager', 'Director'];
  const ActivitiesAllowedRoles = ['Manager', 'Director'];
  const FilesAllowedRoles = ['Staff'];
  const BASTReviewAllowedRoles = ['Director'];
  const ReviewTaskAllowedRoles = ['Manager', 'Director'];
  const HandoverAllowedRoles = ['Manager'];

  return (
    <Col md="12" className="d-flex justify-content-between mb-3 align-items-center">
      <div className="project-nav">
        <Link
          className={`${navActive === 1 && 'active'} text-muted fw-bold`}
          onClick={() => setNavActive(1)}
        >
          Overview
        </Link>
        {auth?.user?.roles.find((role) => BoardAllowedRoles.includes(role)) && (
          <Link
            className={`${navActive === 2 && 'active'} text-muted fw-bold`}
            onClick={() => setNavActive(2)}
          >
            Board
          </Link>
        )}
        {auth?.user?.roles.find((role) => ActivitiesAllowedRoles.includes(role)) && (
          <Link
            className={`${navActive === 7 && 'active'} text-muted fw-bold`}
            onClick={() => setNavActive(7)}
          >
            Activities
          </Link>
        )}
        {auth?.user?.roles.find((role) => FilesAllowedRoles.includes(role)) && (
          <>
            <Link
              className={`${navActive === 4 && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(4)}
            >
              Files
            </Link>
          </>
        )}
        {auth?.user?.roles.find((role) => BASTReviewAllowedRoles.includes(role)) && (
          <Link
            className={`${navActive === 8 && 'active'} text-muted fw-bold`}
            onClick={() => setNavActive(8)}
          >
            BAST Review{' '}
            <div
              color="danger"
              className={`count ${
                currentTotalBastReview?.length > 0 ? 'bg-danger text-white' : 'bg-light text-dark'
              }`}
            >
              {currentTotalBastReview?.length}
            </div>
          </Link>
        )}
        {auth?.user?.roles.find((role) => ReviewTaskAllowedRoles.includes(role)) && (
          <>
            <Link
              className={`${navActive === 5 && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(5)}
            >
              Review{' '}
              <div
                color="danger"
                className={`count ${
                  currentTotalReview?.length > 0 ? 'bg-danger text-white' : 'bg-light text-dark'
                }`}
              >
                {currentTotalReview?.length}
              </div>
            </Link>
          </>
        )}
        {auth?.user?.roles.find((role) => HandoverAllowedRoles.includes(role)) && (
          <Link
            className={`${navActive === 6 && 'active'} text-muted fw-bold`}
            onClick={() => setNavActive(6)}
          >
            Handover{' '}
          </Link>
        )}
        {auth?.user?.roles.find((role) => MembersAllowedRoles.includes(role)) && (
          <Link
            className={`${navActive === 3 && 'active'} text-muted fw-bold`}
            onClick={() => setNavActive(3)}
          >
            Members
          </Link>
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
  totalBastReview: PropTypes.number,
};

export default ProjectNav;
