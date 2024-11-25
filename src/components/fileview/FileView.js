import React, { useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import previewPdf from '../../utils/previewPdf';
import FetchingFile from '../fetchingFile/FetchingFile';
import { alert } from '../atoms/Toast';

const FileView = ({ companyId, title, filename, mode, action, file }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const api = useAxios();

  const downloadFile = async () => {
    setIsFetching(true);
    const splitBySlash = file.split('/');
    const fileName = splitBySlash[splitBySlash.length - 1];
    await api
      .get(`api/file/preview/${companyId}?type=null&file=${fileName}`, {
        responseType: 'arraybuffer',
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentage = total ? Math.floor((loaded / total) * 100) : null;
          setProgress(percentage);
        },
      })
      .then((res) => {
        setIsFetching(false);
        setProgress(0);
        previewPdf(res.data, fileName);
      })
      .catch(() => {
        setIsFetching(false);
        alert('error', 'Failed to fetch file');
      });
  };

  return (
    <Row className="align-items-center mb-4">
      <span>{title}</span>
      <Col sm="12" lg="12">
        <div className="d-flex rounded-2 border align-items-center justify-content-between overflow-hidden">
          <div className="h-100 d-flex p-3 bg-success">
            <MaterialIcon icon="text_snippet" style={{ color: 'white' }} />
          </div>
          <div className="d-flex w-100 px-3">
            <span className="fw-bold">{filename}</span>
          </div>
          <div className="d-flex p-2">
            {mode === 'preview' ? (
              isFetching ? (
                <FetchingFile progress={progress} />
              ) : (
                <Link to="#">
                  <Button type="button" size="sm" color="light" onClick={() => downloadFile()}>
                    Preview
                  </Button>
                </Link>
              )
            ) : (
              <Button type="button" size="sm" color="secondary" className="d-flex" onClick={action}>
                Edit
              </Button>
            )}
          </div>
        </div>
      </Col>
      {/* <Col sm="12" lg="1">
        <Button type="button" block outline>
          Edit
        </Button>
      </Col> */}
    </Row>
  );
};

FileView.propTypes = {
  companyId: PropTypes.string,
  title: PropTypes.string,
  filename: PropTypes.string,
  mode: PropTypes.string,
  action: PropTypes.func,
  file: PropTypes.any,
};

export default FileView;
