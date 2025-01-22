import { FunctionComponent, useEffect, useTransition } from 'react';
import { FloatButton, Layout, message } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';
import FooterComp from './components/footer';
import HeaderComp from './components/header';
import AppRouter from './components/appRouter';
import { selectGlobal, updateLoading, updateUserData } from '@/store/global';
import { useAppDispatch, useAppSelector } from '@/store/store';
import httpRequest, { adornUrl } from '@/utils/request';
import './index.scss';

const Layouts: FunctionComponent = () => {
  const { token, simpleUserData } = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();
  // 用户获取状态
  const [isPendingUser, startTransitionUser] = useTransition();

  // 获取用户信息
  const getUserData = (loginname: string) => {
    startTransitionUser(
      async () =>
        await httpRequest({
          url: adornUrl(`/api/v1/user/${loginname}`),
          method: 'get',
        })
          .then(({ data }) => {
            dispatch(updateUserData(data.data));
          })
          .catch((e) => {
            message.error('请求失败');
            console.error(e);
          }),
    );
  };

  // 加载中状态设置
  useEffect(() => {
    dispatch(updateLoading(isPendingUser));
  }, [isPendingUser]);

  // 根据登录态判断是否需要获取用户信息
  useEffect(() => {
    if (token && simpleUserData?.loginName) {
      getUserData(simpleUserData.loginName);
    } else {
      dispatch(updateUserData({}));
    }
  }, [simpleUserData]);

  return (
    <Layout className='components-layout-index'>
      <HeaderComp />
      <Content className='site-layout'>
        <AppRouter />
      </Content>
      <FooterComp />
      <FloatButton.BackTop className='back-top-btn' visibilityHeight={200}>
        <CaretUpOutlined />
      </FloatButton.BackTop>
    </Layout>
  );
};

export default Layouts;
