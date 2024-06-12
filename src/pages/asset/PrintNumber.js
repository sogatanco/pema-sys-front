import React from 'react';
import PropTypes from 'prop-types';
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  text: {
    margin: 10,
    fontSize: 10,
    textAlign: 'justify',
  },
  image: {
    marginVertical: 4,
    marginHorizontal: 4,
    width: 50,
    height: 50,
  },
});

const PrintNumber = ({ acet }) => {
  return (
    <Document>
      <Page style={{ ...styles.body, backgroundColor: '#fff' }}>
        <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {acet?.map((ast) => (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                width: '50%',
                border: '1px solid #000',
              }}
              key={ast.id}
            >
              <Image style={styles.image} src={`https://products.aspose.app/barcode/embed/image.Png?BarcodeType=QR&Content=https://sys.ptpema.co.id/asset/${ast.id}&TextLocation=None&Height=118&Width=118`} />
              <View
                style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginVertical: 8 }}
              >
                <Text style={{ fontSize: '15px', fontWeight: 'demibold'}}>{ast?.number}</Text>
                <Text style={{ fontSize: '12px', overflow:'hidden', textOverflow:'ellipsis', width:'170px', height:'18px' }}>{ast?.name}</Text>
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
