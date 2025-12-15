import React, { useState } from 'react';
import './Type.scss';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import Button from '../button/Button';
import useAxios from '../../../../hooks/useAxios';
import { alert } from '../../../../components/atoms/Toast';
import Label from '../label/Label';

const Type = ({ taskId, type, isChange, refetch }) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedType, setSelectedType] = useState(type);
  const [isLoading, setIsLoading] = useState(false);
  const api = useAxios();

  const toggleUpdate = () => setIsUpdate(!isUpdate);

  const handleOverlayClick = () => {
    toggleUpdate();
    setSelectedType(type);
  };

  const handleChangeType = (e) => {
    setSelectedType(e.target.value);
  };

  const handleSaveType = async () => {
    setIsLoading(true);
    await api
      .put(`api/module/daily/change-type`, {
        id: taskId,
        is_priority: selectedType,
      })
      .then(() => {
        refetch();
        toggleUpdate();
        setIsLoading(false);
        alert('success', 'Tipe tugas berhasil diperbarui!');
      })
      .catch(() => {
        alert('error', 'Terjadi kesalahan, coba lagi.');
        setIsLoading(false);
      });
  };

  return (
    <div className="type-container">
      {isUpdate && (
        <>
          <div className="type-popup-overlay" onClick={handleOverlayClick}></div>
          <div className="type-popup">
            <div className="type-popup-body">
              <div className="input">
                {/* <label htmlFor="typeSelect">Pilih Tipe:</label> */}
                <select id="typeSelect" value={selectedType} onChange={handleChangeType}>
                  <option value="0">Biasa</option>
                  <option value="1">Mendesak</option>
                </select>
              </div>
              {isLoading ? (
                <div className="d-flex gap-2 align-items-center">
                  <Spinner color="primary" size="sm" />
                  <span>Menyimpan...</span>
                </div>
              ) : (
                <Button color="green" size="sm" text="Simpan" actionFn={handleSaveType} />
              )}
            </div>
          </div>
        </>
      )}

      <div
        className={`type-body ${type === '1' ? 'red' : 'info'} ${isChange ? 'change' : ''}`}
        onClick={isChange ? toggleUpdate : null}
      >
        <span>
          {type === '1' ? (
            <Label color="red" text="Mendesak" />
          ) : (
            <Label color="blue" text="Biasa" />
          )}
        </span>
      </div>
    </div>
  );
};

Type.propTypes = {
  taskId: PropTypes.number,
  type: PropTypes.string,
  isChange: PropTypes.bool,
  refetch: PropTypes.func,
};

export default Type;
