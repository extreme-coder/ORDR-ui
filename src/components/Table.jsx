import React from "react";

const Table = ({ seats, onViewSeat, round }) => {
  return <>{round ? <div>Round Table</div> : <div>Square Table</div>}</>;
};

export default Table;
