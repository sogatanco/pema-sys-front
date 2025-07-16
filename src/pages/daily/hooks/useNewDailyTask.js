import { useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import { alert } from '../../../components/atoms/Toast';
import { storeNewDailies } from '../services/dailyService';
import { validateTaskForm } from '../validations/dailyValidations';

export const useNewDailyTask = ({ taskId, category, refetch, setIsNewTaskOpen }) => {
  const api = useAxios();
  const [taskForms, setTaskForms] = useState([
    { taskId: taskId || null, activityName: '', category, startDate: '', endDate: '' },
  ]);
  const [countCopy, setCountCopy] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toggleNewTask = () => {
    setIsNewTaskOpen((prev) => !prev);
    setCountCopy(0);
  };

  const handleCopyChange = (value) => {
    const count = parseInt(value, 10);
    if (Number.isNaN(count) || count < 0 || count > 10) return;

    const currentCopies = taskForms.length - 1;
    const diff = count - currentCopies;

    if (diff > 0) {
      const original = taskForms[0];
      const newCopies = Array.from({ length: diff }, () => ({ ...original }));
      setTaskForms([...taskForms, ...newCopies]);
    } else if (diff < 0) {
      setTaskForms(taskForms.slice(0, 1 + count));
    }

    setCountCopy(count);
  };

  const handleChange = (index, field, value) => {
    const updatedForms = [...taskForms];
    updatedForms[index][field] = value;
    setTaskForms(updatedForms);
  };

  const deleteCopy = (index) => {
    setTaskForms((prev) => prev.filter((_, i) => i !== index));
    if (index !== 0) {
      setCountCopy((prev) => Math.max(0, prev - 1));
    }
  };

  const handleSubmit = async () => {
    const allErrors = taskForms.flatMap((form, index) => validateTaskForm(form, index));

    if (allErrors.length > 0) {
      alert('error', allErrors.join('\n'));
      return;
    }

    setIsLoading(true);
    try {
      const res = await storeNewDailies(api, taskForms);
      refetch();
      toggleNewTask();
      alert('success', res.data.message);
    } catch (err) {
      toggleNewTask();
      alert('error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    taskForms,
    isLoading,
    countCopy,
    toggleNewTask,
    handleCopyChange,
    handleChange,
    deleteCopy,
    handleSubmit,
  };
};

export default useNewDailyTask;
