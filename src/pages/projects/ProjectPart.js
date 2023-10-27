import React, { useState } from 'react';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import ProjectTables from './ProjectTable';
import './ProjectDetail.scss';
import useAuth from '../../hooks/useAuth';

const ProjectPart = () => {
  const { auth } = useAuth();
  const [navActive, setNavActive] = useState(2);

  const allProjectNavAllowedRoles = ['Manager'];

  return (
    <>
      {auth?.user.roles.find((role) => allProjectNavAllowedRoles.includes(role)) && (
        <Col>
          <Col md="12" className="d-flex justify-content-between mb-3 align-items-center">
            <div className="project-nav">
              <Link
                className={`${navActive === 1 && 'active'} text-muted fw-bold`}
                onClick={() => setNavActive(1)}
              >
                All Projects
              </Link>
              <Link
                className={`${navActive === 2 && 'active'} text-muted fw-bold`}
                onClick={() => setNavActive(2)}
              >
                My Projects
              </Link>
            </div>
          </Col>
        </Col>
      )}
      <ProjectTables nav={navActive} />
    </>
  );
};

export default ProjectPart;
