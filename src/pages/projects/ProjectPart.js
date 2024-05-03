import React, { useState } from 'react';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import ProjectTables from './ProjectTable';
import './ProjectDetail.scss';
import useAuth from '../../hooks/useAuth';

const allProjectNavAllowedRoles = ['Staff', 'Manager'];
const myProjectNavAllowedRoles = ['Staff', 'Manager'];
const assignedProjectNavAllowedRoles = ['Manager'];

const ProjectPart = () => {
  const { auth } = useAuth();
  const [navActive, setNavActive] = useState(2);

  const userRoles = auth?.user?.roles;

  return (
    <>
      <Col md="12" className="d-flex justify-content-between mb-3 align-items-center">
        <div className="nav-container">
          <div className="project-nav">
            {userRoles?.find((role) => allProjectNavAllowedRoles.includes(role)) && (
              <Link
                className={`${navActive === 1 && 'active'} text-muted fw-bold`}
                onClick={() => setNavActive(1)}
              >
                <div className="title">
                  All Projects
                  {/* <div className="total">1232</div> */}
                </div>
              </Link>
            )}
            {userRoles?.find((role) => myProjectNavAllowedRoles.includes(role)) && (
              <Link
                className={`${navActive === 2 && 'active'} text-muted fw-bold`}
                onClick={() => setNavActive(2)}
              >
                <div className="title">
                  My Projects
                  {/* <div className="total">132</div> */}
                </div>
              </Link>
            )}
            {userRoles?.find((role) => assignedProjectNavAllowedRoles.includes(role)) && (
              <Link
                className={`${navActive === 3 && 'active'} text-muted fw-bold`}
                onClick={() => setNavActive(3)}
              >
                <div className="title">
                  Project Assigned
                  {/* <div className="total">32</div> */}
                </div>
              </Link>
            )}
          </div>
          {/* <div className="nav-search">
              <input type="text" placeholder="Search.." />
            </div> */}
        </div>
      </Col>
      <ProjectTables nav={navActive} />
    </>
  );
};

export default ProjectPart;
