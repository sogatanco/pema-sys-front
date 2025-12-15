import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const notify = (type, msg) =>
  type === 'success'
    ? toast.success(msg)
    : type === 'create'
    ? toast(msg, {
        icon: '🤗',
      })
    : type === 'start'
    ? toast('Lets get started, cheer up!', {
        icon: '💪',
      })
    : type === 'done'
    ? toast('Horeee, task done!', {
        icon: '👏',
      })
    : type === 'info'
    ? toast(msg, {
        icon: '💡',
      })
    : toast.error(msg);

export const Toast = () => {
  return (
    <Toaster
      toastOptions={{
        className: '',
        style: {
          //   border: '1px solid #713200',
          //   padding: '16px',
          //   color: '#713200',
          //   width: '800px',
        },
      }}
    />
  );
};

export const alert = (type, msg) => {
  notify(type, msg);
};
