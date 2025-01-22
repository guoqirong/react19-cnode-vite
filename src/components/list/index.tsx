import { FunctionComponent, ReactNode } from 'react';
import { Empty, List } from 'antd';
import ListItem, { topicListItemType } from '@/components/list-item';
import { recentDataItemType } from '@/store/global';

interface ListCompProps {
  dataList: topicListItemType[] | recentDataItemType[];
  isSimpleItem?: boolean;
  listLoading?: boolean;
  onItemClick: Function;
  footer?: ReactNode;
}

const ListComp: FunctionComponent<ListCompProps> = ({
  dataList,
  isSimpleItem = false,
  listLoading,
  footer,
  onItemClick,
}) => {
  return (
    <List
      size='small'
      style={{ width: '100%' }}
      locale={{ emptyText: <Empty /> }}
      dataSource={dataList}
      loading={listLoading}
      footer={footer}
      renderItem={(item) => (
        <ListItem topicItem={item} isSimpleItem={isSimpleItem} onItemClick={onItemClick}></ListItem>
      )}
    ></List>
  );
};

export default ListComp;
