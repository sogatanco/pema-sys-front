import React from 'react';
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from 'reactstrap';

import './TaskList.scss';

const TaskList = () => {
  const todos = [
    {
      id: 1,
      content: 'Task satu',
      time: 'Hari ini',
      status: 'To Do',
      completed: false,
    },
    {
      id: 2,
      content: 'Task dua',
      time: 'Kemarin',
      status: 'To Do',
      completed: false,
    },
    {
      id: 3,
      content: 'Task tiga',
      time: 'Kemarin',
      status: 'In Progress',
      completed: false,
    },
    {
      id: 4,
      content: 'Task empat',
      time: 'Kamis, 14 Okt 2023',
      status: 'Done',
      completed: false,
    },
    {
      id: 5,
      content: 'Task tujuh',
      time: 'Kamis, 14 Okt 2023',
      status: 'Done',
      completed: false,
    },
  ];

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Task List</CardTitle>
        <div className="todo-widget mt-3">
          <ListGroup className="list-task todo-list list-group mb-0" data-role="tasklist">
            {todos.map((todo) => (
              <ListGroupItem
                className={`d-flex align-items-center todo-item px-0 border-0 ${
                  todo.completed ? 'Done' : ''
                }`}
                key={todo.id}
              >
                <div className="d-flex gap-3 align-items-center">
                  {todo.status === 'In Progress' ? (
                    <i className="bi bi-file-play"></i>
                  ) : todo.status === 'To Do' ? (
                    <i className="bi bi-check2-square"></i>
                  ) : (
                    <i className="bi bi-pencil-square"></i>
                  )}
                  <div className="d-flex flex-column">
                    <span className="todo-desc ">{todo.content}</span>
                    <small className="text-muted">{todo.time}</small>
                  </div>
                </div>
                <div className="ms-auto gap-2 d-flex align-items-center">
                  {todo.status === 'In Progress' ? (
                    <span className="badge text-dark-white bg-warning rounded-pill d-inline-block fw-bold">
                      {todo.status}
                    </span>
                  ) : todo.status === 'To Do' ? (
                    <span className="badge text-dark-white bg-primary rounded-pill d-inline-block fw-bold">
                      {todo.status}
                    </span>
                  ) : (
                    <span className="badge text-dark-white bg-success rounded-pill d-inline-block fw-bold">
                      {todo.status}
                    </span>
                  )}
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
      </CardBody>
    </Card>
  );
};

export default TaskList;
