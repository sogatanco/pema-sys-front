import { useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import { alert } from '../../../components/atoms/Toast';
import {
  updateDailiesProgress,
  updateDailiesStatus,
  deleteDailies,
} from '../services/dailyService';
import {
  validateAllFullProgress as isAllFullProgress,
  validateNoFullProgress as isNoFullProgress,
} from '../validations/dailyValidations';

export const useDaily = (task, refetch) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [visiblePopup, setVisiblePopup] = useState({ delete: false, update: false, review: false });
  const [deleting, setDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const api = useAxios();

  const handleCheckItem = (dt) => {
    setSelectedTasks((prev) => {
      const exists = prev.some((t) => t.id === dt.id);
      if (exists) return prev.filter((t) => t.id !== dt.id);
      return [...prev, { id: dt.id, progress: dt.progress, status: dt.status }];
    });
  };

  const handleCheckForAll = () => {
    if (selectedTasks.length > 0 || isAllChecked) {
      setSelectedTasks([]);
      setIsAllChecked(false);
    } else {
      const filteredTasks = task.daily.map(({ id, progress, status }) => ({
        id,
        progress,
        status,
      }));
      setSelectedTasks(filteredTasks);
      setIsAllChecked(true);
    }
  };

  const togglePopup = (type) => {
    setVisiblePopup((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const validateNoFullProgress = () => {
    const valid = isNoFullProgress(selectedTasks);
    if (!valid) {
      togglePopup('update');
      alert('error', 'Terdapat task dengan progress 100%.');
    }
    return valid;
  };

  const validateAllFullProgress = () => {
    const valid = isAllFullProgress(selectedTasks);
    if (!valid) {
      togglePopup('review');
      alert('error', 'Terdapat task dengan progress kurang dari 100%.');
    }
    return valid;
  };

  const resetSelection = () => {
    setSelectedTasks([]);
    setIsAllChecked(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const ids = selectedTasks.map((dt) => dt.id);
    try {
      await deleteDailies(api, ids);
      refetch();
      alert('success', `${ids.length} task berhasil dihapus!`);
    } catch {
      alert('error', 'Something went wrong');
    } finally {
      resetSelection();
      setDeleting(false);
      togglePopup('delete');
    }
  };

  const handleBulkUpdateProgress = async () => {
    if (!validateNoFullProgress()) return;
    setIsLoading(true);
    try {
      await updateDailiesProgress(
        api,
        selectedTasks.map(({ id }) => ({ id, progress: 100 })),
      );
      refetch();
      alert('success', 'Task berhasil diubah menjadi 100%!');
    } catch {
      alert('error', 'Gagal mengubah progress');
    } finally {
      setIsLoading(false);
      resetSelection();
      togglePopup('update');
    }
  };

  const handleBulkUpdateStatus = async () => {
    if (!validateAllFullProgress()) return;
    setIsLoading(true);
    try {
      await updateDailiesStatus(
        api,
        selectedTasks.map(({ id, progress }) => ({
          id,
          progress,
          status: 'review',
        })),
      );
      refetch();
      alert('success', 'Berhasil mengubah task ke Review!');
    } catch {
      alert('error', 'Gagal mengubah status task');
    } finally {
      setIsLoading(false);
      resetSelection();
      togglePopup('review');
    }
  };

  return {
    isNewTaskOpen,
    setIsNewTaskOpen,
    handleCheckItem,
    handleCheckForAll,
    isAllChecked,
    selectedTasks,
    resetSelection,
    togglePopup,
    visiblePopup,
    handleDelete,
    deleting,
    handleBulkUpdateStatus,
    handleBulkUpdateProgress,
    isLoading,
  };
};

export default useDaily;
