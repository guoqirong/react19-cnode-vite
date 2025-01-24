import { FunctionComponent, ReactNode } from 'react';
import { Layout, theme } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './index.scss';

interface PageHeaderProps {
  className?: string;
  onBack?: () => void;
  title: string;
  operation?: ReactNode;
}

const PageHeader: FunctionComponent<PageHeaderProps> = ({ className, onBack, title, operation }) => {
  const { Header } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header className={`page-header-wrapper ${className}`} style={{ background: colorBgContainer }}>
      <div className='page-header'>
        {onBack && (
          <span className='back-btn' onClick={onBack}>
            <ArrowLeftOutlined />
          </span>
        )}
        <span className='title'>{title}</span>
      </div>
      {operation && <div>{operation}</div>}
    </Header>
  );
};

export default PageHeader;
