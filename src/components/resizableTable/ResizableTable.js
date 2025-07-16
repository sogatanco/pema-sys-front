/* eslint-disable react/no-array-index-key */
/* eslint-disable no-return-assign */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import './ResizableTable.scss';

const ResizableTable = ({ columns = [], data = [] }) => {
  const columnRefs = useRef([]);

  useEffect(() => {
    columnRefs.current.forEach((col, i) => {
      if (!col) return;

      const resizer = col.querySelector('.resizer');
      let startX;
      let startWidth;

      const onMouseMove = (e) => {
        const newWidth = startWidth + (e.pageX - startX);
        col.style.width = `${newWidth}px`;

        // Apply same width to all cells with same index
        document.querySelectorAll(`.column[data-index="${i}"]`).forEach((cell) => {
          cell.style.width = `${newWidth}px`;
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      const onMouseDown = (e) => {
        startX = e.pageX;
        startWidth = col.offsetWidth;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };

      resizer.addEventListener('mousedown', onMouseDown);

      return () => {
        resizer.removeEventListener('mousedown', onMouseDown);
      };
    });
  }, [columns]);

  return (
    <div className="resizable-table">
      <div className="task-header">
        {columns.map((col, i) => (
          <div className="column" data-index={i} key={i} ref={(el) => (columnRefs.current[i] = el)}>
            {col}
            <div className="resizer" />
          </div>
        ))}
      </div>

      <div className="task-data">
        {data.map((row, rowIndex) => (
          <div className="task-item" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <div className="column" data-index={colIndex} key={colIndex}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResizableTable;
