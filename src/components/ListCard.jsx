import React from "react";

const ListCard = ({children}) => {
  return (
    <div className="mt-3 overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-gray-900/5">
      <div className="p-4">
          <div className="mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default ListCard;
