import { FunctionComponent, useEffect, useState, useTransition } from 'react';
import { preinit } from 'react-dom';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Card, Form, Input, message, Select } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import ClientQtCode from '@/components/client-qr-code';
import PageWrapper from '@/components/page-wrapper';
import UserInfo from '@/components/user-info';
import PageHeader from '@/components/page-header';
import { topicTypeList } from '@/constant';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectGlobal, updateListParm } from '@/store/global';
import httpRequest, { adornUrl } from '@/utils/request';
import { changeLtGt } from '@/utils';
import './index.scss';

const EditTopic: FunctionComponent = () => {
  preinit('https://cdn.tiny.cloud/1/mh2f2ffdlr2zzaky3yk52tx8rtxrxnbt1a6p7p7jx96hy70r/tinymce/5/tinymce.min.js', {
    as: 'script',
  });
  const { token } = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();
  const history = useNavigate();
  // 富文本初始配置项
  const init = {
    height: 500, //富文本高度
    width: '100%', //富文本宽度
    // language_url: './tinymce-langs/zh_CN.js', //中文包
    language: 'zh_CN', //中文
    browser_spellcheck: true, // 拼写检查
    branding: false, // 去水印
    elementpath: true, //禁用编辑器底部的状态栏
    statusbar: true, // 隐藏编辑器底部的状态栏
    paste_data_images: true, // 是否允许粘贴图像
    menubar: false, // 隐藏最上方menu
    fontsize_formats: '14px 16px 18px 20px 24px 26px 28px 30px 32px 36px', //字体大小
    font_formats:
      '微软雅黑=Microsoft YaHei,Helvetica Neue;PingFang SC;sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun;serifsans-serif;Terminal=terminal;monaco;Times New Roman=times new roman;times', //字体
    file_picker_types: 'image',
    images_upload_credentials: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount',
    ],
    toolbar:
      'fontselect fontsizeselect link lineheight forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | image quicklink h2 h3 blockquote table numlist bullist preview fullscreen',
  };
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [searchParams] = useSearchParams();
  const { id } = useParams();

  // 数据获取
  const [isLoading, startTransition] = useTransition();
  const getData = () => {
    startTransition(
      async () =>
        await httpRequest({
          url: adornUrl(`/api/v1/topic/${searchParams.get('id') ?? id}`),
          method: 'get',
          params: {
            mdrender: true,
            accesstoken: token,
          },
        })
          .then(({ data }) => {
            data.data.content = changeLtGt(data.data.content);
            setContent(data.data.content);
            form.setFieldsValue({
              topic_id: data.data.id,
              title: data.data.title,
              content: data.data.content,
              tab: data.data.tab,
            });
          })
          .catch((e) => {
            message.error('请求失败');
            console.error(e);
          }),
    );
  };
  useEffect(() => {
    if (searchParams.get('id') || id) getData();
  }, [searchParams.get('id'), id]);

  // 返回
  const goback = () => {
    if (location.pathname.includes('add-topic')) {
      dispatch(updateListParm(searchParams.get('listParm') ?? ''));
      history('/');
    } else if (searchParams.get('userName')) {
      history(`/detail?id=${searchParams.get('id') ?? id}&userName=${searchParams.get('userName')}`);
    } else {
      history(`/detail?id=${searchParams.get('id') ?? id}&listParm=${searchParams.get('listParm')}`);
    }
  };

  // 添加或修改请求
  const [isSubmitLoading, startTransitionSubmit] = useTransition();
  const onFinish = (values: any) => {
    startTransitionSubmit(
      async () =>
        await httpRequest({
          url: adornUrl(`/api/v1/topics${location.pathname.includes('add-topic') ? '' : '/update'}`),
          method: 'post',
          data: {
            topic_id: searchParams.get('id') ?? id,
            title: values.title,
            content: values.content,
            tab: 'dev',
            accesstoken: token,
          },
        })
          .then(({ data }) => {
            if (data?.success) {
              message.success(location.pathname.includes('add-topic') ? '发布成功' : '修改成功');
              goback();
            }
          })
          .catch((e) => {
            message.error(location.pathname.includes('add-topic') ? '发布失败' : '修改失败');
            console.error(e);
          }),
    );
  };

  return (
    <PageWrapper
      right={
        <>
          <UserInfo isTopicsRepliesList={false} />
          <ClientQtCode />
        </>
      }
    >
      <Card
        size='small'
        className='edit-card'
        loading={isLoading}
        cover={<PageHeader className='site-page-header' onBack={goback} title='发布话题' />}
      >
        <Form
          className='edit-topic-form'
          layout='vertical'
          wrapperCol={{ offset: 0, span: 24 }}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name='tab'
            label='版块'
            rules={[
              {
                required: true,
                message: '请选择版块',
                type: 'string',
              },
            ]}
          >
            <Select style={{ width: 214 }}>
              {topicTypeList
                .filter((item) => !['all', 'good'].includes(item.key))
                .map((opt) => {
                  return (
                    <Select.Option value={opt.key} key={opt.key}>
                      {opt.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item
            name='title'
            label='标题'
            rules={[
              {
                required: true,
                message: '请输入标题',
                type: 'string',
              },
            ]}
          >
            <Input autoComplete='off' />
          </Form.Item>
          <Form.Item
            name='content'
            label='内容'
            getValueFromEvent={() => {
              return form.getFieldValue('content');
            }}
            getValueProps={(value) => {
              return value;
            }}
            rules={[
              {
                required: true,
                message: '请输入内容',
              },
            ]}
          >
            {(!searchParams.get('id') || content) && (
              <Editor
                api-key='mh2f2ffdlr2zzaky3yk52tx8rtxrxnbt1a6p7p7jx96hy70r'
                init={init}
                value={content}
                onEditorChange={(v) => {
                  setContent(v);
                  form.setFieldsValue({
                    content: v,
                  });
                }}
              ></Editor>
            )}
          </Form.Item>
          <Form.Item className='is-last-item'>
            <Button loading={isSubmitLoading} type='primary' htmlType='submit'>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageWrapper>
  );
};

export default EditTopic;
