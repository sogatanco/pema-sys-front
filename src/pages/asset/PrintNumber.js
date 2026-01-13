import React from "react";
import PropTypes from "prop-types";
import QRCode from "qrcode";
import { Page, Text, Document, StyleSheet, View, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  text: {
    margin: 10,
    fontSize: 8,
    textAlign: "justify",
  },
  image: {
    width: 30,
    height: 30,
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    border: "1px solid #000",
    padding: 1,
    width: "33.33%",
    boxSizing: "border-box",
    minHeight: 25,
  },
  info: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 3,
    justifyContent: "center",    // vertical center
    // alignItems: "center",        // horizontal center
    height: 30,                  // pastikan tinggi cukup untuk centering
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
});

// Fungsi untuk generate QR Code menjadi base64
const generateQRCode = async (text) => {
  try {
    return await QRCode.toDataURL(text, {
      type: 'image/png',
      rendererOpts: {
        quality: 1
      },
      dotsOptions: {
        type: 'dots', // gunakan tipe dots jika library mendukung
        color: '#1582dbff'
      }
    });
  } catch (err) {
    console.error("Error generating QR Code:", err);
    return null;
  }
};

const PrintNumber = ({ acet }) => {
  const baseURL1 = process.env.REACT_APP_FRONTEND;
  const [qrCodes, setQrCodes] = React.useState({});

  React.useEffect(() => {
    const generateAllQRCodes = async () => {
      // Gunakan map() untuk eksekusi paralel
      const qrPromises = acet.map(async (ast) => {
        return {
          id: ast.id,
          qrCode: await generateQRCode(`${baseURL1}asset/v/${ast.id}`),
        };
      });

      // Tunggu semua proses selesai dengan Promise.all()
      const qrResults = await Promise.all(qrPromises);

      // Konversi array hasil menjadi objek (id -> qrCode)
      const qrMap = Object.fromEntries(qrResults.map((item) => [item.id, item.qrCode]));

      setQrCodes(qrMap);
    };

    generateAllQRCodes();
  }, [acet, baseURL1]);

  return (
    <Document>
      <Page style={{ ...styles.body, backgroundColor: "#fff" }}>
        <View style={styles.wrap}>
          {acet?.map((ast) => (
            <View style={styles.item} key={ast.id}>
              {qrCodes[ast.id] ? (
                <Image style={styles.image} src={qrCodes[ast.id]} />
              ) : (
                <Text>Loading QR...</Text>
              )}
              <View style={styles.info}>
                <Text style={{ fontSize: 8, fontWeight: "extrabold", overflow: "hidden", marginBottom:1 }}>{ast?.number}</Text>
                <Text style={{ fontSize: 7, width: 150, height: 12, overflow: "hidden" }}>
                  {ast?.name}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

PrintNumber.propTypes = {
  acet: PropTypes.array,
};

export default PrintNumber;
