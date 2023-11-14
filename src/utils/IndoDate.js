const IndoDate = (d) => {
  const date = new Date(d);
  //   const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Des',
  ];

  return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
};

export default IndoDate;
