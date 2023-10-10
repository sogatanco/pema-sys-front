import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const INITIAL_STATE = {
  task: ['satu', 'dua'],
};

export const TaskContext = createContext(INITIAL_STATE);

const TaskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASK':
      return {
        task: action.payload,
      };

    default:
      return state;
  }
};

export const TaskContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(TaskReducer, INITIAL_STATE);

  return (
    <TaskContext.Provider
      value={{
        task: state.task,
        dispatch,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

TaskContextProvider.propTypes = {
  children: PropTypes.element,
};
