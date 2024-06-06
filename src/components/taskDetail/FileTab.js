import MaterialIcon from '@material/react-material-icon';
import React from 'react';

const FileTab = () => {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Filename</th>
            <th>User</th>
            <th>Uploaded at</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>File pertama.pdf</td>
            <td>Muhammad Haikal Aulia</td>
            <td>20 Feb 2024, 10:15</td>
            <td>
              <MaterialIcon icon="download" style={{ fontSize: '18px' }} />
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>File kedua.pdf</td>
            <td>Fitria Syaifanur</td>
            <td>20 Feb 2024, 12:15</td>
            <td>
              <MaterialIcon icon="download" style={{ fontSize: '18px' }} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FileTab;
