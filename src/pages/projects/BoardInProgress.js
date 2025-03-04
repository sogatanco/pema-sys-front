import React from 'react';
import { Col } from 'reactstrap';
// import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import BoardTask from './BoardTask';
// import TaskForm from './TaskForm';

const BoardInProgress = ({
  directSupervisor,
  data,
  isLoading,
  error,
  refetch,
  isRefetching,
  isMemberActive,
}) => {
  // const [newTaskOpen, setNewTaskOpen] = useState(false);

  const { projectId } = useParams();

  return (
    <Col lg="4" className="mt-1">
      <div className="d-flex align-items-center justify-content-between bg-light-warning text-warning py-1 px-2 mb-2 rounded-3">
        <span className="fw-bold">In progress</span>
        <span className="fw-bold">{data?.length}</span>
      </div>
      {isLoading ? (
        'Loading...'
      ) : error ? (
        'Something went wrong.'
      ) : (
        <>
          {/* {!newTaskOpen ? (
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
          )} */}
          <BoardTask
            {...{ directSupervisor, data, projectId, refetch, isRefetching, isMemberActive }}
          />
        </>
      )}
    </Col>
  );
};

BoardInProgress.propTypes = {
  directSupervisor: PropTypes.string,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.any,
  refetch: PropTypes.func,
  isRefetching: PropTypes.bool,
  isMemberActive: PropTypes.bool,
};

export default BoardInProgress;
