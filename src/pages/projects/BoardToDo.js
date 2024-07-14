import React, { useState } from 'react';
import { Button, Col } from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import BoardTask from './BoardTask';
import TaskForm from './TaskForm';
import useAuth from '../../hooks/useAuth';

const newTaskAllowedRoles = ['Manager'];

const BoardToDo = ({
  directSupervisor,
  data,
  isLoading,
  error,
  refetch,
  isRefetching,
  isMemberActive,
}) => {
  const { auth } = useAuth();
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  const { projectId } = useParams();

  const type = 1;

  return (
    <Col lg="4" className="mt-1">
      <div className="d-flex align-items-center justify-content-between bg-light-primary text-primary py-1 px-2 mb-2 rounded-3">
        <span className="fw-bold">To do</span>
        <span className="fw-bold">{data?.length}</span>
      </div>
      {isLoading ? (
        'Loading...'
      ) : error ? (
        'Something went wrong.'
      ) : (
        <>
          {isMemberActive &&
            auth?.user?.roles.find((role) => newTaskAllowedRoles?.includes(role)) &&
            (!newTaskOpen ? (
              <Button
                type="button"
                size="sm"
                color="secondary"
                className="d-flex align-items-center justify-content-center rounded-2"
                block
                onClick={() => setNewTaskOpen(true)}
              >
                <MaterialIcon icon="add" style={{ fontSize: '14px' }} />
                Add Goal
              </Button>
            ) : (
              <TaskForm
                {...{ projectId, setNewTaskOpen, refetch, type }}
                title="Create new goal.."
              />
            ))}
          <BoardTask
            {...{ directSupervisor, data, projectId, refetch, isRefetching, isMemberActive }}
          />
        </>
      )}
    </Col>
  );
};

BoardToDo.propTypes = {
  directSupervisor: PropTypes.string,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.any,
  refetch: PropTypes.func,
  isRefetching: PropTypes.bool,
  isMemberActive: PropTypes.bool,
};

export default BoardToDo;
