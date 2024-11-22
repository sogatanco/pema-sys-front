import * as pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import image from '../../../assets/image';
// import draft from '../../../assets/images/surat/160133.png';
import Terbilang from './Terbilang';
// import { height } from '@mui/system';

const pdfFonts = require('../../../assets/vfs_fonts');

const GenerateSurat = (dataSurat, htmlRef) => {
  return new Promise((resolve, reject) => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = {
      Archivo: {
        normal: 'Archivo-Regular.ttf',
        bold: 'Archivo-SemiBold.ttf',
        italics: 'Archivo-Italic.ttf',
        bolditalics: 'Archivo-SemiBoldItalic.ttf',
      },
    };
    const html = `<p style="margin-bottom:5px">Banda Aceh, ${new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dataSurat?.tglSurat))}</p>  
      
        <table style="border-collapse: collapse; width: 100%; border: 0px;" border="1"; padding="0";><colgroup><col style="width: 13%;"><col style="width: 2%;"><col style="width: 85%;"></colgroup>
        <tbody>
          <tr style="margin-left:-5">
            <td style="vertical-align: top; border: 0px; line-height: 1.2; " >Nomor</td>
            <td style="vertical-align: top; border: 0px; line-height: 1.2;" >:</td>
            <td style="vertical-align: top; border: 0px; line-height: 1.2;">${
              dataSurat?.nomorSurat
            }</td>
          </tr>
          <tr style="margin-left:-5">
            <td style="vertical-align: top; border: 0px; line-height: 1.2;">Lampiran</td>
            <td style="vertical-align: top; border: 0px; line-height: 1.2;">:</td>
            <td style="vertical-align: top; border: 0px; line-height: 1.2;">${
              Number(dataSurat?.lampiran) > 0
                ? `${dataSurat?.lampiran} (${Terbilang(Number(dataSurat?.lampiran))}) ${
                    dataSurat?.jenisLampiran || ' Eks'
                  }`
                : `-`
            }</td>
          </tr>
          <tr style="margin-left:-5">
            <td style="vertical-align: top; border: 0px; line-height: 1.2;">Perihal</td>
            <td style="vertical-align: top; border: 0px; line-height: 1.2;">:</td>
            <td style="vertical-align: top; border: 0px; line-height: 1.2;">${
              dataSurat?.perihal
            }</td>
          </tr>
        </tbody>
      </table>

        <div style="line-height: 1.2; margin-top:3; margin-bottom:-12">Kepada Yth<br>
            <strong style="line-height: 0.9!important;">${dataSurat?.kepada}</strong><br>
            di - <br>
            <span>          Tempat</span>
        </div>
       <span style="line-height: 1.3; text-align:justify">  ${dataSurat?.isiSurat}</span>
  
      `;

    if (htmlRef.current) {
      const canvas = htmlRef.current.querySelector('canvas');

      if (canvas) {
        const qrcode = canvas.toDataURL();

        const pdfContent = htmlToPdfmake(html, {
          defaultStyles: {
            p: { margin: [0, 3, 0, -12] },

            td: {
              verticalAlign: 'top',
              marginBottom: -4,
              heigt: 'auto',
            },
            ol: {
              margin: [0, 0, 0, -15],
              padding: [0, 0, 0, 0],
            },
            ul: { margin: [0, 0, 0, -15], padding: [0, 0, 0, 0] },
            li: {
              marginBottom: 2,
            },
            tr: {
              margin: [-5, 0, 0, 0],
            },
            table: {
              margin: [0, -3, 0, -7],
              width: '100%',
            },
            br: {
              margin: [0, 0, 0, 0],
            },
          },
          tableAutoSize: true,
        });

        const docDefinition = {
          pageOrientation: 'portrait',
          pageSize: 'A4',
          pageMargins: [50, 70, 50, 70],
          content: [
            pdfContent,

            {
              stack: [
                {
                  text: `Hormat Kami, `,
                  style: 'normal',
                },
                {
                  text: 'PT PEMBANGUNAN ACEH',
                  style: 'boldText',
                },
                {
                  image: `${dataSurat?.status === 'signed' ? qrcode : image.placeholder}`,
                  width: 60, // Sesuaikan lebar logo sesuai kebutuhan
                },
                {
                  text: `${dataSurat?.signer?.first_name}`,
                  style: 'boldText',
                },
                {
                  text: `${dataSurat?.signer?.position_name}`,
                  style: 'normal',
                },
              ],
              unbreakable: true, // This ensures the entire stack stays together on the same page
              margin: [0, 10],
            },
            {
              text: dataSurat?.tembusans?.length>0 ? 'Tembusan Yth : ':'',
              style: 'normal',
            },
            {
              ol: dataSurat?.tembusans
            }
          ],

          background: () => {
            return dataSurat?.draft
              ? {
                  image: image.draft,
                  width: 300,
                  height: 300,
                  opacity: 0.2,
                  marginTop: 250,
                  marginLeft: 150,
                }
              : '';
          },
          styles: {
            boldText: {
              bold: true,
            },
          },
          images: html.images,
          header: (page) => {
            if (page !== 1) return { text: '' };

            return {
              image: image.headSurat,
              width: '595',
            };
          },
          footer: (currentPage, pageCount) => {
            if (currentPage !== pageCount) return { text: '' };

            return {
              image: image.footSurat,
              width: '595',
            };
          },
          defaultStyle: {
            font: 'Archivo',
            fontSize: 10,
            color: '#000',
            ol: {
              margin: [0, 0, 0, 0],
              padding: [0, 0, 0, 0],
            },
          },
        };
        pdfMake.createPdf(docDefinition).getBase64((base64) => {
          if (base64) {
            resolve(base64); // Mengembalikan base64
          } else {
            reject(new Error('Error generating base64 PDF'));
          }
        });
      }
    }

    // Create a document definition for pdfmake
  });
};

export default GenerateSurat;
