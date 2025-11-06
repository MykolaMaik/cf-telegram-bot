import { Form, Input, Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface FormValues {
  username: string;
  firstName?: string;
  lastName?: string;
}

interface UserFormProps {
  form: ReturnType<typeof Form.useForm<FormValues>>[0];
  onSubmit: (values: FormValues) => Promise<void>;
}

export const UserForm = ({ form, onSubmit }: UserFormProps) => {
  return (
    <Card title="Add user">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Enter username' },
            { 
              pattern: /^@?[a-zA-Z0-9_]{5,32}$/, 
              message: 'Username must be between 5 and 32 characters (letters, numbers, underscores)' 
            }
          ]}
          tooltip="Username of the user in Telegram (with @ or without)"
        >
          <Input placeholder="@username or username" />
        </Form.Item>
        <Form.Item
          label="First Name"
          name="firstName"
          tooltip="Optional - first name of the user"
        >
          <Input placeholder="Ivan" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
        >
          <Input placeholder="Ivanov" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Add user
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

