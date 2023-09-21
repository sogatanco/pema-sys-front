import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';

const ProjectNav = ({ navActive, setNavActive }) => {
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
        <Link
          className={`${navActive === 3 && 'active'} text-muted fw-bold`}
          onClick={() => setNavActive(3)}
        >
          Members
        </Link>
        <Link
          className={`${navActive === 4 && 'active'} text-muted fw-bold`}
          onClick={() => setNavActive(4)}
        >
          Files(7)
        </Link>
      </div>
      <h3 className="fw-bold">KS0121023</h3>
    </Col>
  );
};

ProjectNav.propTypes = {
  navActive: PropTypes.any,
  setNavActive: PropTypes.func,
};

export default ProjectNav;
