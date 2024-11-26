import React from "react";
import './Rank.scss';

const Rank = ( { name, entries } ) => {
  return (
    <div className="container row u-margin-bottom-0">
      <div className="col-3-of-4">
        <div className='greet'>
          {`${name}, your current entry count is...`}
        </div>
        <div className='count'>
          #{entries}
        </div>
      </div>
      <div className="col-1-of-4"></div>
    </div>
  );
};

export default Rank;
