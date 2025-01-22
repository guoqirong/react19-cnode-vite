import { FunctionComponent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectGlobal } from '@/store/global';
import httpRequest, { adornUrl } from '@/utils/request';
import logoIcon from '@/assets/svg/logo.svg';
import './index.scss';

const HeaderComp: FunctionComponent = () => {
  const { token } = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();
  const history = useNavigate();

  // 前往首页
  const gotIndex = () => {
    history('/');
  };

  // 获取未读信息数
  const [count, setCount] = useState(0);
  const getMassageCount = () => {
    httpRequest({
      url: adornUrl(`/api/v1/message/count`),
      method: 'get',
      params: {
        accesstoken: token,
      },
    })
      .then(({ data }) => {
        setCount(data.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  // const [event] = useEventBus();
  // useEffect(() => {
  //   if (token) {
  //     getMassageCount();
  //     event.on('read-msg', getMassageCount);
  //   }
  //   return () => {
  //     event.off('read-msg', getMassageCount);
  //   };
  // }, [token]);

  // 退出登录
  const goLoginOut = () => {
    localStorage.clear();
    dispatch({
      type: 'global/updateToken',
      payload: '',
    });
    dispatch({
      type: 'global/updateSimpleUserData',
      payload: {},
    });
    history('/');
  };

  return (
    <Header className='header-wrapper'>
      <div className='site-header'>
        <img className='logo' onClick={gotIndex} src={logoIcon} alt='logo' />
        <span className='navbar-link navbar-noright-link'>
          <span>
            <Link to='/'>首页</Link>
          </span>
          {token ? (
            <Badge dot={true} count={count}>
              <span>
                <Link to='/message'>消息</Link>
              </span>
            </Badge>
          ) : (
            ''
          )}
          {token ? (
            <span>
              <Link to='/collect'>收藏</Link>
            </span>
          ) : (
            ''
          )}
          <span>
            <a href='https://github.com/guoqirong/react19-cnode-vite' rel='noopener noreferrer' target='_blank'>
              GitHub仓库
            </a>
          </span>
          {token ? (
            <span>
              <span className='login-out-btn' onClick={goLoginOut}>
                退出
              </span>
            </span>
          ) : (
            <span>
              <Link to='/login'>登录</Link>
            </span>
          )}
        </span>
      </div>
    </Header>
  );
};

export default HeaderComp;
