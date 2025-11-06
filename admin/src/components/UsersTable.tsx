import { Table, Button, Card, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { IUser } from '../types/api.types';
import { deleteUser } from '../api';

interface UsersTableProps {
  users: IUser[];
  loading: boolean;
  onUserDeleted: () => void;
}

export const UsersTable = ({ users, loading, onUserDeleted }: UsersTableProps) => {
  const handleDeleteUser = async (user: IUser): Promise<void> => {
    try {
      const identifier = user.telegramId || user.username;
      const response = await deleteUser(identifier);
      if (response.data.success) {
        message.success('User deleted');
        onUserDeleted();
      }
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      message.error('Error deleting user');
    }
  };

  const columns: ColumnsType<IUser> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => text ? `@${text}` : '-',
    },
    {
      title: "First Name",
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text: string | undefined) => text || '-',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (text: string | undefined) => text || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: IUser) => (
        <Popconfirm
          title="Delete user?"
          onConfirm={() => handleDeleteUser(record)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title={`List of users (${users.length})`}>
      <Table
        dataSource={users}
        columns={columns}
        loading={loading}
        rowKey="telegramId"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

