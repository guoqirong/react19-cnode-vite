import { FunctionComponent, useEffect, useState, useTransition } from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import ClientQtCode from '@/components/client-qr-code';
import ListComp from '@/components/list';
import { topicListItemType } from '@/components/list-item';
import PageWrapper from '@/components/page-wrapper';
import UserInfo from '@/components/user-info';
import httpRequest, { adornUrl } from '@/utils/request';
import { useAppSelector } from '@/store/store';
import { selectGlobal } from '@/store/global';
import './index.scss';

const Collect: FunctionComponent = () => {
  const { simpleUserData } = useAppSelector(selectGlobal);
  const history = useNavigate();
  // 列表数据获取
  const [isLoading, startTransition] = useTransition();
  const [collect, setCollect] = useState<topicListItemType[]>([]);
  const getData = () => {
    if (simpleUserData && simpleUserData?.loginName) {
      startTransition(
        async () =>
          await httpRequest({
            url: adornUrl(`/api/v1/topic_collect/${simpleUserData?.loginName}`),
            method: 'get',
          })
            .then(({ data }) => {
              setCollect(data.data);
            })
            .catch((e) => {
              message.error('请求失败');
              console.error(e);
            }),
      );
    } else {
      history('/index');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // 查看详情
  const goDetail = (data: topicListItemType) => {
    history(`/detail?id=${data.id}`);
  };

  return (
    <PageWrapper
      right={
        <>
          <UserInfo />
          <ClientQtCode />
        </>
      }
    >
      <>
        <Card className='collect-card' title='我的收藏'>
          <ListComp dataList={collect} listLoading={isLoading} onItemClick={goDetail} />
        </Card>
      </>
    </PageWrapper>
  );
};

export default Collect;
