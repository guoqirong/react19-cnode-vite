import { FunctionComponent, useEffect, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, message, Pagination } from 'antd';
import { AxiosResponse } from 'axios';
import ClientQtCode from '@/components/client-qr-code';
import ListComp from '@/components/list';
import { topicListItemType } from '@/components/list-item';
import PageWrapper from '@/components/page-wrapper';
import UserInfo from '@/components/user-info';
import { topicTypeList } from '@/constant';
import { useAppSelector } from '@/store/store';
import { selectGlobal } from '@/store/global';
import httpRequest, { adornUrl, resDataType } from '@/utils/request';
import './index.scss';

interface getTopicListType {
  page?: number;
  tab?: string;
  limit?: number;
  mdrender?: boolean;
}

const IndexPage: FunctionComponent = () => {
  const { listParm } = useAppSelector(selectGlobal);
  const history = useNavigate();
  // 类别
  const [activeTypeName, setActiveTypeName] = useState<string>('all');
  const [page, setPage] = useState<number>(1); // 页码
  const [limit, setLimit] = useState<number>(20); // 页码显示条数
  // 列表数据获取
  const [isLoading, startTransition] = useTransition();
  const [listData, setListData] = useState<topicListItemType[]>([]);
  const getTopicList = (data?: getTopicListType) => {
    startTransition(async () => {
      await httpRequest({
        url: adornUrl('/api/v1/topics'),
        method: 'get',
        params: {
          page: page ?? 1,
          tab: activeTypeName ?? 'all',
          limit: limit ?? 20,
          mdrender: false,
          ...data,
        },
      })
        .then((res: AxiosResponse<resDataType<topicListItemType[]>>) => {
          if (res?.data?.success) {
            setListData(res?.data.data ?? []);
          }
        })
        .catch((e) => {
          message.error('请求失败');
          console.error(e);
        });
    });
  };

  useEffect(() => {
    const [tab, pageNum, limitNum] = listParm?.split('|') ?? [];
    if (tab && pageNum && limitNum) {
      setActiveTypeName(tab);
      setPage(Number(pageNum));
      setLimit(Number(limitNum));
    }
    getTopicList(
      tab && pageNum && limitNum
        ? {
            page: Number(pageNum),
            tab: tab,
            limit: Number(limitNum),
          }
        : undefined,
    );
  }, []);

  // 发布话题
  const addTopic = () => {
    history(`/add-topic?listParm=${activeTypeName}|${page}|${limit}`);
  };

  // 查看详情
  const goDetail = (data: topicListItemType) => {
    history(`/detail?id=${data.id}&listParm=${activeTypeName}|${page}|${limit}`);
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
        <Card
          size='small'
          className='list-card'
          tabList={topicTypeList.map((item) => {
            return {
              key: item.key,
              tab: item.name,
            };
          })}
          activeTabKey={activeTypeName}
          onTabChange={(key) => {
            setActiveTypeName(key);
            setPage(1);
            getTopicList({
              tab: key,
              page: 1,
            });
          }}
          tabBarExtraContent={
            <Button type='primary' onClick={addTopic}>
              发布话题
            </Button>
          }
        >
          <ListComp
            dataList={listData}
            listLoading={isLoading}
            footer={
              <Pagination
                total={400}
                showSizeChanger={false}
                current={page}
                defaultPageSize={limit}
                onChange={(page, pageSize) => {
                  setPage(page);
                  setLimit(pageSize);
                  getTopicList({
                    page: page,
                    limit: pageSize,
                  });
                }}
              />
            }
            onItemClick={goDetail}
          />
        </Card>
      </>
    </PageWrapper>
  );
};

export default IndexPage;
