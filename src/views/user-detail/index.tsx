import { FunctionComponent, useEffect, useState, useTransition } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Card, message } from 'antd';
import ClientQtCode from '@/components/client-qr-code';
import ListComp from '@/components/list';
import PageWrapper from '@/components/page-wrapper';
import UserInfo from '@/components/user-info';
import { recentDataItemType, userDataType } from '@/store/global';
import httpRequest, { adornUrl } from '@/utils/request';
import './index.scss';

const UserDetail: FunctionComponent = () => {
  const history = useNavigate();
  // 列表数据获取
  const { userName } = useParams();
  const [isLoading, startTransition] = useTransition();
  const [userData, setUserData] = useState<userDataType>();
  const getUserData = () => {
    startTransition(
      async () =>
        await httpRequest({
          url: adornUrl(`/api/v1/user/${userName}`),
          method: 'get',
        })
          .then(({ data }) => {
            setUserData(data.data);
          })
          .catch((e) => {
            message.error('请求失败');
            console.error(e);
          }),
    );
  };

  useEffect(() => {
    getUserData();
  }, []);

  // 查看详情
  const goDetail = (data: recentDataItemType) => {
    history(`/detail?id=${data.id}&userName=${userName}`);
  };

  return (
    <PageWrapper
      right={
        <>
          <UserInfo isTopicsRepliesList={false} userInfo={userData} />
          <ClientQtCode />
        </>
      }
    >
      <>
        <Card title='基本信息' className='user-detail-card' loading={isLoading}>
          <div>
            <Avatar shape='square' size='large' src={userData?.avatar_url}>
              {userData?.loginname}
            </Avatar>
            <span className='user-name'>{userData?.loginname}</span>
          </div>
          {userData?.score && <div className='user-score'>积分：{userData?.score || ''}</div>}
        </Card>
        <Card title='我的话题' className='user-detail-card no-padding' loading={isLoading}>
          <ListComp dataList={(userData && userData.recent_topics) || []} isSimpleItem={true} onItemClick={goDetail} />
        </Card>
        <Card title='我的参与' className='user-detail-card no-padding is-last' loading={isLoading}>
          <ListComp dataList={(userData && userData.recent_replies) || []} isSimpleItem={true} onItemClick={goDetail} />
        </Card>
      </>
    </PageWrapper>
  );
};

export default UserDetail;
