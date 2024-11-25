const newBlob = (val, filename) => {
  const blob = new Blob([val], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  window.open(
    url,
    filename || 'document',
    'height=500,width=800,left=50,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes',
  );
};

export default newBlob;
