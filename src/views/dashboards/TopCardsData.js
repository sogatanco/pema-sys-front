import { Card, CardBody, CardSubtitle } from 'reactstrap';
import PropTypes from 'prop-types';

const TopCardsData = ({ bg, icon, title, subtitle, loading }) => {
  return (
    <Card className="rounded-3">
      <CardBody>
        <div className="d-flex align-items-center">
          <span className={`circle-box md-box text-dark-white bg-${bg}`}>
            <i className={`fs-2 bi bi-${icon}`} />
          </span>
          <div className="ms-3">
            <h2 className="mb-1 fw-normal">{loading ? '...' : title}</h2>
            <CardSubtitle className="fs-6 text-muted">{subtitle}</CardSubtitle>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TopCardsData;

TopCardsData.propTypes = {
  bg: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.number,
  subtitle: PropTypes.string,
  loading: PropTypes.bool,
};
