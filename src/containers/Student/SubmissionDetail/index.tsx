'use client';

import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { useGetSubmissionDetailQuery } from '@/redux/apis/student';
import { Editor } from '@monaco-editor/react';

const { Paragraph } = Typography;

type SubmissionDetailProps = {
  submission_id: string;
};

const SubmissionDetailContainer: React.FC<SubmissionDetailProps> = ({ submission_id }) => {
  const [editor, setEditor] = React.useState<any>();
  const [monaco, setMonaco] = React.useState<any>();
  const [hints, sethints] = React.useState<any>([]);

  const { data } = useGetSubmissionDetailQuery({
    id: Number(submission_id),
  });

  React.useEffect(() => {
    if (data) {
      sethints(JSON.parse(data.its_feedback_hint_student));
    }
  }, [data]);

  React.useEffect(() => {
    if (editor && monaco && hints) {
      const markers: any = [];
      hints?.hints?.map((hint: any) => {
        markers.push({
          startLineNumber: hint.lineNumber,
          startColumn: editor.getModel().getLineFirstNonWhitespaceColumn(hint.lineNumber),
          endLineNumber: hint.lineNumber,
          endColumn: editor.getModel().getLineLength(hint.lineNumber) + 1,
          message: hint.hintStrings ? hint.hintStrings[0] : 'no hint available',
          severity: monaco.MarkerSeverity.Error,
        });
      });
      monaco.editor.setModelMarkers(editor.getModel(), 'owner', markers);
    }
  }, [editor, monaco, hints]);

  return (
    <div className="h-full p-5 bg-[#f0f2f5]">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title="Submission Program"
            bordered
            className="h-full border-solid border-[1px] border-[#d9d9d9]"
          >
            <Editor
              height="70vh"
              defaultLanguage={data?.language}
              value={data?.program}
              onMount={(editor, monaco) => {
                setEditor(editor);
                setMonaco(monaco);
              }}
            />
            <div>
              <h1 className="font-bold">Hints:</h1>
              {hints?.hints?.length === 0 && <p>No hints available</p>}
              <ul>
                {hints?.hints?.map((hint: any) => (
                  <li key={hint.lineNumber}>
                    <p>
                      - <span className="text-red-400">Line {hint.lineNumber}</span>:{' '}
                      {hint.hintStrings[0]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Tutor Feedback"
            bordered
            className="h-full border-solid border-[1px] border-[#d9d9d9]"
          >
            <Paragraph> {data?.tutor_feedback} </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SubmissionDetailContainer;
