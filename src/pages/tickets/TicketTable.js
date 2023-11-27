import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Table } from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import TicketPopup from './TicketPopup';

const TicketTable = ({ data, tab, refetch }) => {
  const [isOpen, setIsOpen] = useState();
  const [ticket, setTicket] = useState({});

  const handleChoose = (selectedTicket) => {
    setIsOpen(true);
    setTicket(selectedTicket);
  };

  return (
    <>
      <Table className="no-wrap mt-3 align-middle" responsive hover>
        <thead>
          <tr>
            <th>#</th>
            <th>{tab === 'requests' ? 'Requester' : 'To'}</th>
            <th>Number</th>
            <th>Title</th>
            <th>Priority</th>
            <th>Subject</th>
            <th colSpan="2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((tic, i) => (
            <tr key={tic.id} style={{ cursor: 'pointer' }} onClick={() => handleChoose(tic)}>
              <td>{i + 1}</td>
              <td>
                <div className="d-flex flex-column">
                  {tab === 'requests' ? (
                    <>
                      {tic.requester}
                      <div>
                        <span className="badge bg-light text-muted rounded-pill d-inline-block fw-bold">
                          {tic.requester_division}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {tic.pic}
                      <div>
                        <span className="badge bg-light text-muted rounded-pill d-inline-block fw-bold">
                          {tic.pic_division}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </td>
              <td className="text-dark">{tic.ticket_number}</td>
              <td className="text-dark">{tic.title}</td>
              <td className="text-dark">
                <div className="d-flex">
                  {tic.priority === 'minor' ? (
                    <MaterialIcon icon="expand_more" className="text-primary" />
                  ) : tic.priority === 'major' ? (
                    <MaterialIcon icon="expand_less" className="text-danger" />
                  ) : (
                    <MaterialIcon icon="keyboard_double_arrow_up" className="text-danger" />
                  )}
                  {tic.priority}
                </div>
              </td>
              <td className="text-dark">
                <Badge color={`${tic.subject === 'request' ? 'success' : 'info'}`}>
                  {tic.subject}
                </Badge>
              </td>
              <td className="text-dark">
                <span
                  className={`badge bg-light-${
                    tic.status === 'submitted'
                      ? 'primary'
                      : tic.status === 'onprocess'
                      ? 'info'
                      : tic.status === 'pending'
                      ? 'danger'
                      : 'success'
                  } text-${
                    tic.status === 'submitted'
                      ? 'primary'
                      : tic.status === 'onprocess'
                      ? 'info'
                      : tic.status === 'pending'
                      ? 'danger'
                      : 'success'
                  } rounded-pill d-inline-block fw-bold`}
                >
                  {tic.status}
                </span>
              </td>
              {/* <td width="10">
              <MaterialIcon icon="more_horiz" />
            </td> */}
            </tr>
          ))}
        </tbody>
      </Table>
      <TicketPopup {...{ ticket, isOpen, setIsOpen, refetch }} />
    </>
  );
};

TicketTable.propTypes = {
  data: PropTypes.array,
  tab: PropTypes.string,
  refetch: PropTypes.func,
};

export default TicketTable;
