export const storeNewDailies = (api, dailies) => api.post('api/module/daily/store', { dailies });

export const updateDaily = (api, daily) => api.put('api/module/daily/update', daily);

export const deleteDailies = (api, ids) =>
  api.delete(`api/module/daily/delete`, { data: { dailies: ids } });

export const updateDailiesProgress = (api, dailies) =>
  api.put('api/module/daily/change-progress', { dailies });

export const updateDailiesStatus = (api, dailies) =>
  api.post('api/module/daily/change-status', { dailies });
