import React from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';
import PropTypes from 'prop-types';
import './Nav.scss';

const Nav = (props) => {
  const { items, navActive, setNavActive, count } = props;

  return (
    <Col>
      <Col md="12" className="d-flex justify-content-between mb-3 align-items-center">
        <div className="nav-tab">
          {items.map((item) => (
            <Link
              key={item.id}
              className={`${navActive === item.id && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(item.id)}
            >
              {item.label}
              {item.countable && <div className="count bg-success text-white">{count}</div>}
            </Link>
          ))}
        </div>
      </Col>
    </Col>
  );
};

Nav.propTypes = {
  items: PropTypes.array,
  navActive: PropTypes.number,
  setNavActive: PropTypes.func,
  count: PropTypes.number,
};

export default Nav;
