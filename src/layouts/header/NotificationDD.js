import { useState } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import newDate from '../../utils/formatDate';
import user1 from '../../assets/images/users/user1.jpg';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const NotificationDD = ({ data, refetch, setIsNotifOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifIdActive, setNotifIdActive] = useState();
  const navigate = useNavigate();
  const api = useAxios();
  const { auth } = useAuth();

  const handleNotif = async (projectId, notifId, category) => {
    setIsLoading(true);
    setNotifIdActive(notifId);
    await api
      .patch(`api/employe/notification/read/${notifId}`)
      .then(
        () => refetch(),
        setIsLoading(false),
        setIsNotifOpen(false),
        auth.user.roles.includes('Manager')
          ? category === 'project'
            ? navigate(`/projects/details/${projectId}?n=${notifId}&to=handover`)
            : category === 'bast'
            ? navigate(`/projects/details/${projectId}?n=${notifId}&to=overview`)
            : navigate(`/projects/details/${projectId}?n=${notifId}&to=review`)
          : navigate(`/projects/details/${projectId}`),
      )
      .catch((err) => console.log(err), setIsLoading(false), setIsNotifOpen(false));
  };

  return (
    <div>
      <ListGroup flush>
        {data?.map((msg) => (
          <ListGroupItem
            // action
            key={msg.id}
            tag="a"
            // href={`/projects/details/${msg.project_id}?n=${msg.id}&to=review`}
            onClick={() => handleNotif(msg.project_id, msg.id, msg.category)}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center gap-3 py-2">
              <img src={user1} className="rounded-circle" alt="avatar" width="35" height="35" />
              <div className="col-9">
                <h5 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>
                  {`${msg.first_name} - ${msg.title}`}
                </h5>
                <span className="text-muted text-truncate d-block" style={{ fontSize: '14px' }}>
                  {msg.desc}
                </span>
                {isLoading && msg.id === notifIdActive ? (
                  <small className="text-success" style={{ fontSize: '12px' }}>
                    loading...
                  </small>
                ) : (
                  <small className="text-muted" style={{ fontSize: '12px' }}>
                    {newDate(msg.created_at)}
                  </small>
                )}
              </div>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

NotificationDD.propTypes = {
  data: PropTypes.array,
  setIsNotifOpen: PropTypes.func,
  refetch: PropTypes.func,
};

export default NotificationDD;
