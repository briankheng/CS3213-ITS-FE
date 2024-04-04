'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Editor from '@monaco-editor/react';
import Markdown from 'react-markdown';
import { Button, Typography } from 'antd';
import { useGetQuestionDetailQuery, usePostCodeSubmissionMutation } from '@/redux/apis/student';
const { Text } = Typography;

type PropsType = {
  qn_id: string;
};

const QuestionDetailContainer: React.FC<PropsType> = ({ qn_id }: PropsType) => {
  const pathname = usePathname();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [editor, setEditor] = React.useState<any>();
  const [monaco, setMonaco] = React.useState<any>();
  const [code, setCode] = React.useState<string | undefined>('# Write your code here\n');
  const { data } = useGetQuestionDetailQuery({ qn_id: Number(qn_id) });
  const [postCodeSubmission] = usePostCodeSubmissionMutation();

  const problemStatement = `
  # **${data?.question_title}**

  ${data?.question_statement}
  `;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (code) {
        const result = await postCodeSubmission({
          qn_id: Number(qn_id),
          language: data?.language || '',
          program: code,
        });

        if ('data' in result && result.data) {
          window.location.href = `${pathname}/past-submissions`;
        }
      }
    } catch (error) {
      alert('Error in submitting the code');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (editor && monaco) {
      const markers = [
        {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: editor.getModel().getLineLength(1) + 1,
          message: 'This is a possible error',
          severity: monaco.MarkerSeverity.Error,
        },
      ];
      monaco.editor.setModelMarkers(editor.getModel(), 'owner', markers);
    }
  }, [editor, monaco]);

  return (
    <div className="flex bg-gray-100 h-full">
      <div className="w-[50%] p-10">
        {/* Problem Statement */}
        <div className="h-[80vh] overflow-auto">
          <Markdown>{problemStatement}</Markdown>
        </div>
      </div>
      {/* Code Editor */}
      <div className="w-[50%] bg-gray-400">
        <div className="h-[4%] flex justify-between">
          <Button type="link">
            <Link href={`${pathname}/past-submissions`}>Submissions</Link>
          </Button>
          <Text className="mr-4 mt-1">{data?.language}</Text>
        </div>
        <Editor
          height="90%"
          defaultLanguage={data?.language}
          value={code}
          onChange={(newValue, e) => setCode(newValue)}
          onMount={(editor, monaco) => {
            setEditor(editor);
            setMonaco(monaco);
          }}
        />
        <div className="h-[6%] w-full flex justify-center items-center">
          <Button
            id="submit-button"
            type="primary"
            className="bg-blue-500"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
export default QuestionDetailContainer;
