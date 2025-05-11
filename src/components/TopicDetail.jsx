import React, { useEffect, useState } from "react";
import { getDocumentById, getQuizByTopicId } from "../services/firestoreServices";
import { useParams } from "react-router-dom";
import QuizList from "./QuizList";

const TopicDetail = () => {
  const { topicId } = useParams();
  const [topic, setTopic] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const topic = await getDocumentById("topics", topicId);
        const quizzes = await getQuizByTopicId(topicId);
        setQuizzes(quizzes)
        setTopic(topic);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDocument();
  }, [topicId]);

  return (
    <div>
     
            <div className="flex items-baseline justify-between border-b border-gray-200 pt-7 pb-6 sm:px-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {topic.title}
              </h1>
            </div>
            
            <QuizList items={quizzes} />
     
      
    </div>
  );
};

export default TopicDetail;
