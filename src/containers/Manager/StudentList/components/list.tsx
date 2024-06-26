import React from 'react';
import { Typography, Table, Checkbox, Button } from 'antd';

const { Title } = Typography;

interface ListProps {
  users: Student[];
  onCheckboxChange: (id: number, checked: boolean) => void;
  handleButtonClick: () => void;
  listTitle: string;
  buttonName: string;
  assignStudentClick?: () => void;
}

const List: React.FC<ListProps> = ({
  users,
  onCheckboxChange,
  handleButtonClick,
  listTitle,
  buttonName,
  assignStudentClick,
}) => {
  const columns = [
    {
      title: '',
      dataIndex: 'convert',
      key: 'convert',
      width: '5%',
      render: (text: string, record: Student) => (
        <Checkbox onChange={(e) => onCheckboxChange(record.id, e.target.checked)} />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
  ];

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <Title level={2}>{listTitle}</Title>
      <Button className="mb-2" onClick={handleButtonClick}>
        {buttonName}
      </Button>
      {assignStudentClick && (
        <Button className="mb-2 ml-2" onClick={assignStudentClick}>
          Assign to Tutor
        </Button>
      )}
      <Table
        columns={columns}
        dataSource={users}
        pagination={false}
        scroll={{ x: 'max-content' }}
        className="bg-white"
      />
    </div>
  );
};

export default List;
