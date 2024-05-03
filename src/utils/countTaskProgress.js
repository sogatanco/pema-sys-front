export const level2Progress = (val) => {
  const level3 = val?.level_3;

  let sum = 0;
  let total = 0;
  if (level3?.length > 0) {
    for (let i = 0; i < level3?.length; i++) {
      sum += level3[i].task_progress;
    }

    total = sum / level3.length;
  } else {
    total = val?.task_progress;
  }

  return total;
};

export const level1Progress = (val) => {
  const level2 = val?.level_2;

  let sum = 0;
  let total = 0;

  if (level2?.length > 0) {
    for (let i = 0; i < level2.length; i++) {
      sum += level2Progress(level2[i]);
    }

    total = sum / level2.length;
  } else {
    total = val?.task_progress;
  }

  return total;
};
