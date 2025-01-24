import { FunctionComponent, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, message } from 'antd';
import { setLocalStorage } from '@/utils';
import httpRequest, { adornUrl } from '@/utils/request';
import { updateSimpleUserData, updateToken } from '@/store/global';
import { useAppDispatch } from '@/store/store';
import './index.scss';

const Login: FunctionComponent = () => {
  // const { isLoading, adornUrl, httpRequest } = useHttpRequest();
  const dispatch = useAppDispatch();
  const [isLoading, startTransition] = useTransition();
  const history = useNavigate();

  // 表单提交
  const onFinish = (values: any) => {
    startTransition(
      async () =>
        await httpRequest({
          url: adornUrl(`/api/v1/accesstoken`),
          method: 'post',
          data: {
            accesstoken: values.token,
          },
        })
          .then(({ data }) => {
            setLocalStorage('loginName', data.loginname);
            setLocalStorage('token', values.token);
            dispatch(updateToken(values.token));
            dispatch(updateSimpleUserData({ ...data, loginName: data.loginname }));
            history('/');
          })
          .catch((e) => {
            message.error('登录失败');
            console.error(e);
          }),
    );
  };

  // 取消离开登录页面
  const onCancel = () => {
    history(-1);
  };

  return (
    <div className='login-wrapper'>
      <span className='login-slogan'>欢迎来到 CNode 中文社区</span>
      <Card title='token 登录' className='login-card'>
        <Form className='login-form' wrapperCol={{ offset: 0, span: 24 }} onFinish={onFinish}>
          <Form.Item
            name='token'
            label=''
            rules={[
              {
                required: true,
                message: '请输入token校验',
                type: 'string',
              },
            ]}
          >
            <Input placeholder='accesstoken 登录校验' autoComplete='off' />
          </Form.Item>
          <Form.Item className='is-last-item'>
            <Button loading={isLoading} type='primary' htmlType='submit' style={{ width: '100%' }}>
              登录
            </Button>
            <Button loading={isLoading} style={{ width: '100%' }} onClick={onCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
