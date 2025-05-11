import React, { useEffect, useState } from "react";
import { getAllDocuments } from "../services/firestoreServices";
import TopicList from "../components/TopicList";

const TopicPage = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await getAllDocuments("topics");
        setTopics(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDocument();
  }, []);

  return (
    <>
      <div className="flex items-baseline justify-between border-b border-gray-200 pt-7 pb-6 sm:px-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          All Available topics
        </h1>
      </div>
      <TopicList items={topics} />
    </>
  );
};

export default TopicPage;
