function Terbilang(number) {
    const angka = [
        'Nol', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan',
        'Sepuluh', 'Sebelas'
      ];
    
      if (number < 12) return angka[number];
    
      const divisor = [
        '',
        'Belas',
        'Puluh',
        'Ratus',
        'Ribu',
        'Juta',
        'Miliar',
        'Triliun',
      ];
    
      let result = '';
      const numStr = number.toString();
      const length = numStr?.length;
    
      if (length > 12) {
        return 'Angka terlalu besar';
      }
    
      for (let i = 0; i < length; i++) {
        const num = parseInt(numStr.charAt(i), 10);
        const pos = length - i - 1;
    
        // Jika angka adalah 0, kita langsung lanjutkan tanpa melakukan apa-apa
        if (num === 0) {
            result += ''; // Di sini menggunakan continue karena tidak ada tindakan lain
        }
    
        if (pos === 1 && num === 1 && numStr.charAt(i + 1) !== '0') {
          result += ' Sebelas';
          break;
        } else {
          result += ` ${angka[num]} ${divisor[pos]}`;
        }
      }
    
      return result.trim();
    }
  
  export default Terbilang;