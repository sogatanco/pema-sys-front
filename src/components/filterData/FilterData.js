import React, { useEffect, useState } from 'react';
import { Input } from 'reactstrap';

const FilterData = () => {
  const [value, setValue] = useState();

  const handleChange = (val) => {
    setValue(val);
  };

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div className="w-75">
      <Input type="select" name="filter" bsSize="sm" onChange={(e) => handleChange(e.target.value)}>
        <option value="all">Filter</option>
        <option value="Month">Month</option>
        <option value="Priority">Priority</option>
      </Input>
    </div>
  );
};

export default FilterData;
