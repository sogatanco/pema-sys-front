export const validateTaskForm = (form, index) => {
  const errors = [];
  const { activityName, startDate, endDate } = form;

  if (!activityName && !startDate && !endDate) {
    errors.push(
      `Task ${index + 1}: Nama aktivitas, tanggal mulai, dan tanggal berakhir wajib diisi.`,
    );
    return errors;
  }

  if (!activityName?.trim()) {
    errors.push(`Task ${index + 1}: Nama aktivitas wajib diisi.`);
  }

  if (!startDate) {
    errors.push(`Task ${index + 1}: Tanggal mulai wajib diisi.`);
  }

  if (!endDate) {
    errors.push(`Task ${index + 1}: Tanggal berakhir wajib diisi.`);
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    errors.push(`Task ${index + 1}: Tanggal mulai tidak boleh setelah tanggal berakhir.`);
  }

  return errors;
};

export const validateAllTaskForms = (forms) => {
  const allErrors = [];

  forms.forEach((form, index) => {
    const errors = validateTaskForm(form, index);
    allErrors.push(...errors);
  });

  return allErrors;
};

export const validateNoFullProgress = (tasks) => {
  return !tasks.some((t) => t.progress >= 100);
};

export const validateAllFullProgress = (tasks) => {
  return tasks.every((t) => t.progress >= 100);
};
