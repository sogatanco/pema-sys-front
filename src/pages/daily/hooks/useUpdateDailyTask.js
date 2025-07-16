import { useEffect, useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import { alert } from '../../../components/atoms/Toast';
import { updateDaily } from '../services/dailyService';
import { validateTaskForm } from '../validations/dailyValidations';

export const useUpdateDailyTask = ({ task, refetch, setIsEditTaskOpen }) => {
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [updateData, setUpdateData] = useState({
    id: '',
    activity_name: '',
    category: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (task) {
      setUpdateData({
        id: task.id,
        activity_name: task.activity_name || '',
        category: task.category || 'non-rutin',
        start_date: `${task.start_date.date}T${task.start_date.time}`,
        end_date: `${task.start_date.date}T${task.end_date.time}`,
      });
    }
  }, [task]);

  const toggleEditTask = () => {
    setIsEditTaskOpen((prev) => !prev);
  };

  const handleChange = (event) => {
    setUpdateData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdate = async () => {
    const errors = validateTaskForm(
      {
        id: updateData.id,
        activityName: updateData.activity_name,
        startDate: updateData.start_date,
        endDate: updateData.end_date,
      },
      0,
    );

    if (errors.length > 0) {
      alert('error', errors.join('\n'));
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateDaily(api, updateData);
      refetch();
      toggleEditTask();
      alert('success', res.data.message);
    } catch (err) {
      toggleEditTask();
      alert('error', 'Something went wrong sdsdfsds');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    toggleEditTask,
    handleChange,
    handleUpdate,
  };
};

export default useUpdateDailyTask;
