import React from 'react';
import { Form, notification, Card, Input, Button, Radio, Popover } from 'antd';

import {
  useGetParamsQuery,
  useUpdateParamsMutation,
  GetParamsDocument,
} from '../../utils/graphql';

export function SettingsFormComponent() {
  const [form] = Form.useForm();

  const { data, loading } = useGetParamsQuery();
  const [updateParams] = useUpdateParamsMutation({
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GetParamsDocument }],
    onCompleted: () =>
      notification.success({
        message: 'Settings updated',
        placement: 'bottomRight',
      }),
    onError: ({ message }) =>
      notification.error({
        message: message.replace('GraphQL error: ', ''),
        placement: 'bottomRight',
      }),
  });

  const fields = Object.keys(data?.params || {}).filter(
    (key) => key !== '__typename'
  );

  const onFinish = async (values: Record<string, string>) => {
    await updateParams({
      variables: {
        params: Object.entries(values).map(([key, value]) => ({
          key,
          value,
        })),
      },
    });
  };

  return (
    <Card loading={loading} title="Settings">
      <Form form={form} initialValues={data?.params || {}} onFinish={onFinish}>
        {fields.map((key) => (
          <ParamsInput key={key} inputName={key} />
        ))}
        <Button type="default" htmlType="submit">
          Update
        </Button>
      </Form>
    </Card>
  );
}

function ParamsInput({ inputName }: { inputName: string }) {
  if (inputName === 'organize_library_strategy') {
    return (
      <Form.Item
        name={inputName}
        label={inputName}
        rules={[{ required: true }]}
      >
        <Radio.Group>
          <Radio.Button value="link">
            <Popover
              content={
                <div>
                  It will create a symbolic link between the downloaded file and
                  your library folder.
                  <br />
                  This keeps the torrent seeding and deleting the file in your
                  library wont delete the original file.
                </div>
              }
            >
              <span>Link</span>
            </Popover>
          </Radio.Button>
          <Radio.Button value="copy">
            <Popover
              content={
                <div>
                  It will copy the downloaded file to your library, this is
                  useful when your system does not supports symbolic links.
                  <br />
                  This keeps the torrent seeding and deleting the file in your
                  library wont delete the original file.
                </div>
              }
            >
              <span>Copy</span>
            </Popover>
          </Radio.Button>
          <Radio.Button value="move">
            <Popover
              content={
                <div>
                  It will move the downloaded file to your library, this is
                  useful when your system does not supports symbolic links.
                  <br />
                  This wont keep the torrent seeding and deleting the file in
                  your library will be permanent.
                </div>
              }
            >
              <span>Move</span>
            </Popover>
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
    );
  }

  return (
    <Form.Item name={inputName} label={inputName} rules={[{ required: true }]}>
      <Input />
    </Form.Item>
  );
}
