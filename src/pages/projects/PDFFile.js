import React, { Fragment } from 'react';
import { Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 10,
    textAlign: 'center',
  },
  text: {
    margin: 10,
    fontSize: 10,
    textAlign: 'justify',
  },
  image: {
    marginVertical: 4,
    marginHorizontal: 15,
    width: 50,
    height: 50,
  },
  header: {
    fontSize: 10,
    marginBottom: 5,
    textAlign: 'left',
    color: '#3f3f3f',
    fontWeight: 'bold',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  printAt: {
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    left: 35,
    right: 0,
    textAlign: 'left',
    color: 'grey',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    color: '#3f3f3f',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    // margin: 'auto',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 3,
    marginRight: 3,
    fontSize: 10,
  },
});

const today = () => {
  const currentDate = new Date();
  return `${currentDate.toDateString()}, ${currentDate.toLocaleString().split(',')[1]}`;
};

const PDFFile = ({ projectTitle, data }) => {
  const pageColor = '#fff';

  return (
    <Document>
      <Page style={{ ...styles.body, backgroundColor: pageColor }}>
        <Text style={styles.header} fixed>
          Project : {projectTitle?.project_name}
        </Text>
        <Text style={styles.header} fixed>
          Partner : {projectTitle?.partner}
        </Text>
        <Text style={styles.header} fixed>
          Division : {projectTitle?.division}
        </Text>
        <Text style={styles.header} fixed>
          Phase : {projectTitle?.phase}
        </Text>
        <Text style={styles.header} fixed>
          Schema : {projectTitle?.schema === 'jo' ? 'Join Operational' : 'Join Venture'}
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: '5%' }}>
              <Text style={styles.tableCell}>No.</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '35%' }}>
              <Text style={styles.tableCell}>Task Title</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.tableCell}>Status</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.tableCell}>Deadline</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '30%' }}>
              <Text style={styles.tableCell}>PIC</Text>
            </View>
          </View>
          {data?.map((item, i) => (
            <Fragment key={item.task_id}>
              <View style={styles.tableRow}>
                <View style={{ ...styles.tableCol, width: '5%' }}>
                  <Text style={{ ...styles.tableCell, textAlign: 'center' }}>{i + 1}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: '35%' }}>
                  <Text style={styles.tableCell}>{item.task_title}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: '15%' }}>
                  <Text style={{ ...styles.tableCell, fontSize: '10px' }}>
                    {item.status === 0
                      ? 'To do'
                      : item.status === 1
                      ? 'In progress'
                      : item.status === 2
                      ? 'Under review'
                      : item.status === 3
                      ? 'Approved'
                      : 'Revision'}
                  </Text>
                </View>
                <View style={{ ...styles.tableCol, width: '15%' }}>
                  <Text style={styles.tableCell}>{item.end_date}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: '30%' }}>
                  {item.pics.map((p) => (
                    <Text style={styles.tableCell} key={p.id}>
                      {p.first_name}
                    </Text>
                  ))}
                </View>
              </View>
              {item.level_2.map((st) => (
                <View style={styles.tableRow} key={st.task_id}>
                  <View style={{ ...styles.tableCol, width: '5%' }}>
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '35%' }}>
                    <Text style={styles.tableCell}>{st.task_title}</Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '15%' }}>
                    <Text style={styles.tableCell}>-</Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '15%' }}>
                    <Text style={styles.tableCell}>{st.end_date}</Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '30%' }}>
                    {st.pics.map((p) => (
                      <Text style={styles.tableCell} key={p.id}>
                        {p.first_name}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </Fragment>
          ))}
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
        <Text style={styles.printAt} render={today} />
      </Page>
    </Document>
  );
};

PDFFile.propTypes = {
  projectTitle: PropTypes.object,
  data: PropTypes.array,
};

export default PDFFile;
