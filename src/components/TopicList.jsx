import React from "react";
import ListCard from "./ListCard";
import {Link} from "react-router-dom";

const TopicList = ({ items, topicId }) => {
  return (
    <div className="py-4 max-w-4xl mx-auto ">

      {items.map((item, index) => (
        <ListCard>
          <Link
            to={`/topic/${item.id}`}
            className="block font-semibold text-gray-900"
          >
            {item.title}
          </Link>
          <p className="mt-1 text-gray-600">{item.description}</p>
        </ListCard>
      ))}
    </div>
  );
};

export default TopicList;
