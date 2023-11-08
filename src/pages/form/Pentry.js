import React from 'react';
import JotformEmbed from 'react-jotform-embed';
import { Row } from 'reactstrap';
import './Form.scss';

const Pentry = () => {
  return (
    <Row>
      <div className="form-conteiner">
        <div className="form-content">
          <JotformEmbed src="https://form.jotform.com/233040333516040" />
        </div>
        <div className="mask" />
      </div>
    </Row>
  );
};

export default Pentry;
