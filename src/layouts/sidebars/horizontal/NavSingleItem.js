import { NavLink, NavItem } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ToggleMobileSidebar } from '../../../store/customizer/CustomizerSlice';

const NavSingleItem = ({ to, icon, title, toggle, className, suffix, suffixColor }) => {
  const isMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);
  const dispatch = useDispatch();
  return (
    <NavItem onClick={toggle} className={className}>
      {title === 'Manual Book' ? (
        <NavLink
          tag={Link}
          to={to}
          target="_blank"
          className="gap-3"
          onClick={() => dispatch(ToggleMobileSidebar())}
        >
          <span className="sidebarIcon d-flex align-items-center">{icon}</span>
          <div className="d-flex flex-grow-1 align-items-center gap-2">
            <span>{title}</span>
            {suffix ? <span className={`badge ms-auto ${suffixColor}`}>{suffix}</span> : ''}
          </div>
        </NavLink>
      ) : (
        <NavLink
          tag={Link}
          to={to}
          className="gap-3"
          onClick={() => isMobileSidebar && dispatch(ToggleMobileSidebar())}
        >
          <span className="sidebarIcon d-flex align-items-center">{icon}</span>
          <div className="d-flex flex-grow-1 align-items-center gap-2">
            <span>{title}</span>
            {suffix ? <span className={`badge ms-auto ${suffixColor}`}>{suffix}</span> : ''}
          </div>
        </NavLink>
      )}
    </NavItem>
  );
};
NavSingleItem.propTypes = {
  title: PropTypes.string,
  to: PropTypes.string,
  icon: PropTypes.node,
  toggle: PropTypes.func,
  className: PropTypes.string,
  suffix: PropTypes.any,
  suffixColor: PropTypes.string,
};

export default NavSingleItem;
