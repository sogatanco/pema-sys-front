import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import { useParams } from 'react-router-dom';
import BoardTask from './BoardTask';

const BoardDone = ({ data, isLoading, error, refetch, isRefetching }) => {
  const { projectId } = useParams();

  return (
    <Col lg="4" className="mt-1">
      <div className="d-flex align-items-center justify-content-between bg-light-success text-success py-2 px-3 mb-2 rounded-3">
        <span className="fw-bold">Done</span>
        <span className="fw-bold">{data?.length}</span>
      </div>
      {isLoading ? (
        'Loading...'
      ) : error ? (
        'Something went wrong.'
      ) : (
        <>
          <BoardTask {...{ data, projectId, refetch, isRefetching }} />
        </>
      )}
    </Col>
  );
};

BoardDone.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.any,
  refetch: PropTypes.func,
  isRefetching: PropTypes.bool,
};

export default BoardDone;
