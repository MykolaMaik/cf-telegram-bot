import { useState, useEffect } from 'react';
import { Layout, Button, message, Space } from 'antd';
import { Form } from 'antd';
import './App.css';
import { getUsers, addUser } from './api';
import { IUser, CreateUserData } from './types/api.types';
import { LoginForm } from './components/LoginForm';
import { UserForm } from './components/UserForm';
import { UsersTable } from './components/UsersTable';

const { Header, Content } = Layout;

interface FormValues {
  username: string;
  firstName?: string;
  lastName?: string;
}

function App() {
  const [form] = Form.useForm<FormValues>();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [password, setPassword] = useState<string>('');

  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  const handleLogin = (): void => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      message.success('Login successful');
    } else {
      message.error('Invalid password');
    }
  };

  const handleLogout = (): void => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    message.info('You have been logged out');
  };

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getUsers();
      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (error: unknown) {
      console.error('Error loading users:', error);
      let errorMsg = 'Error loading users';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        errorMsg = axiosError.response?.data?.error || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (values: FormValues): Promise<void> => {
    try {
      const normalizedUsername = values.username.replace(/^@/, '').trim();
      
      const userData: CreateUserData = {
        username: normalizedUsername,
        firstName: values.firstName,
        lastName: values.lastName
      };
      
      const response = await addUser(userData);
      if (response.data.success) {
        message.success(response.data.message || 'User added');
        form.resetFields();
        fetchUsers();
      }
    } catch (error: unknown) {
      console.error('Error adding user:', error);
      let errorMsg = 'Error adding user';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        errorMsg = axiosError.response?.data?.error || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      message.error(errorMsg);
    }
  };


  if (!isAuthenticated) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoginForm
            password={password}
            onPasswordChange={setPassword}
            onLogin={handleLogin}
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: 'white', margin: 0 }}>Admin panel - User management</h2>
        <Button onClick={handleLogout}>Logout</Button>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <UserForm form={form} onSubmit={handleAddUser} />
          <UsersTable users={users} loading={loading} onUserDeleted={fetchUsers} />
        </Space>
      </Content>
    </Layout>
  );
}

export default App;