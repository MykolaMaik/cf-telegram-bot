import { Input, Button, Card, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface LoginFormProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onLogin: () => void;
}

export const LoginForm = ({ password, onPasswordChange, onLogin }: LoginFormProps) => {
  return (
    <Card style={{ width: 400 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <UserOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
        <h2>Admin panel</h2>
        <Input.Password
          placeholder="Enter password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onPressEnter={onLogin}
          size="large"
        />
        <Button type="primary" block onClick={onLogin} size="large">
          Login
        </Button>
      </Space>
    </Card>
  );
};

