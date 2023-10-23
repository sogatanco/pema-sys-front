import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';

const TooltipHover = (props) => {
  const { title, id } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <span>
      <Tooltip placement="top" isOpen={tooltipOpen} target={`tooltip-${id}`} toggle={toggle}>
        {title}
      </Tooltip>
    </span>
  );
};

TooltipHover.propTypes = {
  title: PropTypes.string,
  id: PropTypes.number,
};

export default TooltipHover;
