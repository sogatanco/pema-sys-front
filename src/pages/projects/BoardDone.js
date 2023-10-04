import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import { useParams } from 'react-router-dom';
import BoardTask from './BoardTask';

const BoardDone = ({ data, isLoading, error, refetch, isRefetching }) => {
  const { projectId } = useParams();

  return (
    <Col lg="4" className="mt-4">
      <h4>Done ({data?.length})</h4>
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
