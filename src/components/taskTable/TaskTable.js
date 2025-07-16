/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-use-before-define */
import React, { useState, useRef } from 'react';
import './TaskTable.scss';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MaterialIcon from '@material/react-material-icon';

const columns = ['', 'Aktifitas', 'Nama Task', 'Tipe', 'Jadwal', ''];

const initialColumnWidths = [30, 400, 250, 200, 200, 50];

const TaskTable = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      aktifitas: 'Frontend - Android App',
      name: 'Slicing Halaman Beranda',
      tipe: 'Non rutin',
      jadwal: '14 - 21 April',
    },
  ]);

  const [columnWidths, setColumnWidths] = useState(initialColumnWidths);
  const tableRef = useRef(null);
  const resizingColIndex = useRef(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      setTasks((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleMouseDown = (e, index) => {
    resizingColIndex.current = index;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (resizingColIndex.current === null) return;

    const tableLeft = tableRef.current?.getBoundingClientRect().left || 0;
    const newWidth = e.clientX - tableLeft;

    setColumnWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      newWidths[resizingColIndex.current] = Math.max(
        newWidth - prevWidths.slice(0, resizingColIndex.current).reduce((a, b) => a + b, 0),
        60,
      ); // Min width 60px
      return newWidths;
    });
  };

  const handleMouseUp = () => {
    resizingColIndex.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="task-table" ref={tableRef}>
      <div className="task-header">
        {columns.map((col, i) => (
          <div key={i} className="column" style={{ width: columnWidths[i] }}>
            {col}
            <div className="resizer" onMouseDown={(e) => handleMouseDown(e, i)} />
          </div>
        ))}
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="task-data">
            {tasks.map((task) => (
              <SortableTask key={task.id} task={task} columnWidths={columnWidths} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const SortableTask = ({ task, columnWidths }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="task-item" ref={setNodeRef} style={style}>
      <div className="column" style={{ width: columnWidths[0] }} {...attributes} {...listeners}>
        <MaterialIcon icon="drag_indicator" className="icon" />
      </div>
      <div className="column" style={{ width: columnWidths[1] }}>
        {task.aktifitas}
      </div>
      <div className="column" style={{ width: columnWidths[2] }}>
        {task.name}
      </div>
      <div className="column" style={{ width: columnWidths[3] }}>
        {task.tipe}
      </div>
      <div className="column" style={{ width: columnWidths[4] }}>
        {task.jadwal}
      </div>
      <div className="column" style={{ width: columnWidths[5] }}>
        <div className="more-btn">
          <MaterialIcon icon="more_horiz" className="icon" />
        </div>
      </div>
    </div>
  );
};

export default TaskTable;
