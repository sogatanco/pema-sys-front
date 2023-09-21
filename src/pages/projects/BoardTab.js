import React from 'react';
import { Row } from 'reactstrap';
import BoardToDo from './BoardToDo';
// import BoardInProgress from './BoardInProgress';
// import BoardDone from './BoardDone';
// import NewTaskModal from './NewTaskModal';

const BoardTab = () => {
  //   const [modal, setModal] = useState(false);
  //   const [newTaskOpen, setNewTaskOpen] = useState(false);
  //   const [addSubtaskOpen, setAddSubtaskOpen] = useState(false);

  //   const toggle = () => {
  //     setModal(!modal);
  //   };

  return (
    <Row>
      {/* <Col lg="12">
        <div className="search text-muted">
          <div className="search-input">
            <MaterialIcon icon="search" />
            <input type="text" placeholder="search task .." />
          </div>
          <button type="button" className="text-dark" onClick={toggle.bind(null)}>
            <MaterialIcon icon="add" />
            New Task
          </button>
          <NewTaskModal {...{ modal, setModal, toggle }} />
        </div>
      </Col> */}
      <BoardToDo />
      {/* <BoardInProgress /> */}
      {/* <BoardDone /> */}
    </Row>
  );
};

export default BoardTab;
