import React, { useState } from 'react';
import { Button, Col } from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import BoardTask from './BoardTask';
import TaskForm from './TaskForm';

const BoardToDo = ({ data, isLoading, error, refetch, isRefetching }) => {
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  const { projectId } = useParams();

  const type = 1;

  return (
    <Col lg="4" className="mt-1">
      <h4>To do ({data?.length})</h4>
      {isLoading ? (
        'Loading...'
      ) : error ? (
        'Something went wrong.'
      ) : (
        <>
          {!newTaskOpen ? (
            <Button
              type="button"
              size="sm"
              color="secondary"
              className="d-flex align-items-center justify-content-center"
              block
              onClick={() => setNewTaskOpen(true)}
            >
              <MaterialIcon icon="add" style={{ fontSize: '14px' }} />
              New Task
            </Button>
          ) : (
            <TaskForm {...{ projectId, setNewTaskOpen, refetch, type }} />
          )}
          <BoardTask {...{ data, projectId, refetch, isRefetching }} />
        </>
      )}
    </Col>
  );
};

BoardToDo.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.any,
  refetch: PropTypes.func,
  isRefetching: PropTypes.bool,
};

export default BoardToDo;
