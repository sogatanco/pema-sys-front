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
    fontSize: 10,
    textAlign: "justify",
  },
  image: {
    width: 50,
    height: 50,
  },
});

// Fungsi untuk generate QR Code menjadi base64
const generateQRCode = async (text) => {
  try {
    return await QRCode.toDataURL(text);
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
        <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          {acet?.map((ast) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "2px",
                width: "50%",
                border: "1px solid #000",
              }}
              key={ast.id}
            >
              {qrCodes[ast.id] ? (
                <Image style={styles.image} src={qrCodes[ast.id]} />
              ) : (
                <Text>Loading QR...</Text>
              )}
              <View style={{ display: "flex", flexDirection: "column", gap: "5px", marginVertical: 7 }}>
                <Text style={{ fontSize: "13px", fontWeight: "bold" }}>{ast?.number}</Text>
                <Text style={{ fontSize: "10px", overflow: "hidden", textOverflow: "ellipsis", width: "170px", height: "18px" }}>
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
