import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../../hooks/useAxios';
import user1 from '../../../../assets/images/users/user1.jpg';

const profileFile = process.env.REACT_APP_HCIS_BE;

const StaffDropdown = ({ handleFilterChange }) => {
  const api = useAxios();

  // === Fetch data utama ===
  const { data } = useQuery({
    queryKey: ['assignment-list'],
    queryFn: async () => {
      const res = await api.get(`api/daily/assignment-list`);
      return res.data;
    },
  });

  // === Data karyawan & staff ===
  const [myStaff, setMyStaff] = useState();
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    if (data) {
      setMyStaff(data?.saya);
      setStaffList(data?.list_bawahan);
    }
  }, [data]);

  // === Dropdown Staff ===
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  // === Filter staff selain diri sendiri ===
  const currentUserId = myStaff?.employe_id;
  const otherStaff = staffList?.filter((s) => s.employe_id !== currentUserId) || [];

  // === Filter hasil pencarian ===
  const filteredStaff = otherStaff.filter((staff) =>
    staff.first_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // === Pilih staff dari dropdown ===
  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    handleFilterChange('employe_id', staff.employe_id);
    setIsDropdownOpen(false);
  };

  // === Tentukan siapa staff aktif (yang sedang dilihat) ===
  const currentStaff = selectedStaff || myStaff || (staffList.length > 0 ? staffList[0] : null);

  // === Tutup dropdown kalau klik di luar ===
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <>
      {/* === Dropdown Staff === */}
      <div className="header-card" ref={dropdownRef} style={{ position: 'relative' }}>
        <div
          className="card-person dropdown"
          onClick={() => (staffList.length > 0 ? setIsDropdownOpen(!isDropdownOpen) : null)}
        >
          <img
            src={
              currentStaff?.image
                ? `${profileFile}employee/file?f=photo-profil&id=${currentStaff?.employe_id}`
                : user1
            }
            className="rounded-circle"
            alt="avatar"
            width="38"
            height="38"
          />
          <div className="person-info ms-2 text-start">
            <h6 className="mb-0">
              {currentStaff?.first_name || '-'}
              {staffList.length > 0 && (
                <span
                  className={`ms-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  style={{ fontSize: '0.8rem' }}
                >
                  ▼
                </span>
              )}
            </h6>
            <span className="text-muted">{currentStaff?.position_name || '-'}</span>
          </div>
        </div>

        {isDropdownOpen && (
          <div className="custom-dropdown">
            <div className="dropdown-search">
              <input
                type="search"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="dropdown-list">
              {/* === Bagian Saya === */}
              {myStaff && (
                <div
                  className={`dropdown-person-item self-item ${
                    currentStaff?.employe_id === myStaff.employe_id ? 'active' : ''
                  }`}
                  onClick={() => handleStaffSelect(myStaff)}
                >
                  <img
                    src={
                      myStaff?.image
                        ? `${profileFile}employee/file?f=photo-profil&id=${myStaff?.employe_id}`
                        : user1
                    }
                    className="rounded-circle"
                    alt="avatar"
                    width="32"
                    height="32"
                  />
                  <div className="person-info ms-2 text-start">
                    <h6 className="mb-0">
                      {myStaff.first_name} <span className="self-label">(Saya)</span>
                    </h6>
                    <span className="text-muted">{myStaff.position_name}</span>
                  </div>
                </div>
              )}

              {myStaff && <div className="dropdown-divider"></div>}

              {/* === Staff lain === */}
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <div
                    key={staff.employe_id}
                    className={`dropdown-person-item ${
                      currentStaff?.employe_id === staff.employe_id ? 'active' : ''
                    }`}
                    onClick={() => handleStaffSelect(staff)}
                  >
                    <img
                      src={
                        staff?.image
                          ? `${profileFile}employee/file?f=photo-profil&id=${staff?.employe_id}`
                          : user1
                      }
                      className="rounded-circle"
                      alt="avatar"
                      width="32"
                      height="32"
                    />
                    <div className="person-info ms-2 text-start">
                      <h6 className="mb-0">{staff.first_name}</h6>
                      <span className="text-muted">{staff.position_name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-result text-center">Tidak ditemukan</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

StaffDropdown.propTypes = {
  handleFilterChange: PropTypes.func,
};

export default StaffDropdown;
