'use client';

import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { usePathname } from 'next/navigation';
import {
  useGetQuestionsQuery,
  useLazyGetQuestionsQuery,
  useDeleteQuestionMutation,
} from '@/redux/apis/tutor/Questions';
import NavButton from '../AddQuestion/components/Buttons/NavButton';
import QuestionList from './components/QuestionList';
import getLocale from '@/common/utils/extractLocale';

const QuestionsContainer: React.FC<ITutorQuestionDetailRequest> = ({ qn_id }) => {
  const pathname = usePathname();
  const locale = getLocale(pathname);
  const [questionList, setQuestionList] = useState();
  const [getQuestions] = useLazyGetQuestionsQuery();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const fetchQuestionList = async () => {
    const result = await getQuestions().unwrap();
    // @ts-ignore
    setQuestionList(result.questions);
  };

  useEffect(() => {
    fetchQuestionList();
  }, []);

  const handleDeleteQuestion = async (pk: any) => {
    try {
      await deleteQuestion(pk).unwrap();
      message.success('Question deleted successfully'); // Temporarily replacing message.success
      fetchQuestionList();
    } catch (err) {
      message.success('Error deleting question'); // Temporarily replacing message.error
    }
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <NavButton
        buttonText="Back to Dashboard"
        href={`/${locale}/tutor/`}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
      />

      <h4 className="text-lg font-semibold mb-4">Here you can see ALL questions.</h4>
      <QuestionList
        questionList={questionList}
        pathname={pathname}
        handleDeleteQuestion={handleDeleteQuestion}
      />
    </div>
  );
};

export default QuestionsContainer;
