import React from 'react';
import { Form, notification, Card, Input, Button } from 'antd';

import {
  useGetParamsQuery,
  useUpdateParamMutation,
  ParameterKey,
} from '../../utils/graphql';

export function SettingsFormComponent() {
  const [form] = Form.useForm();

  const { data, loading, refetch } = useGetParamsQuery();
  const [updateParam] = useUpdateParamMutation();

  const fields = Object.keys(data?.params || {}).filter(
    (key) => key !== '__typename'
  );

  const onFinish = async (values: any) => {
    try {
      await Promise.all(
        Object.entries(values).map(([key, value]) =>
          updateParam({
            variables: {
              key: key.toUpperCase() as ParameterKey,
              value: value as string,
            },
          })
        )
      );
      await refetch();
      notification.success({
        message: 'Settings updated',
        placement: 'bottomRight',
      });
    } catch (error) {
      notification.error({
        message: error?.message.replace('GraphQL error: ', ''),
        placement: 'bottomRight',
      });
    }
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
