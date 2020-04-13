import React from 'react';
import { Form, notification, Card, Input, Button } from 'antd';

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

  const onFinish = async (values: any) => {
    await updateParams({
      variables: {
        params: Object.entries(values).map(([key, value]) => ({
          key: key.toUpperCase(),
          value: value as string,
        })),
      },
    });
  };

  return (
    <Card loading={loading} title="Settings">
      <Form form={form} initialValues={data?.params || {}} onFinish={onFinish}>
        {fields.map((key) => (
          <Form.Item
            key={key}
            name={key}
            label={key}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        ))}
        <Button type="default" htmlType="submit">
          Update
        </Button>
      </Form>
    </Card>
  );
}
