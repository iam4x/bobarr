import React from 'react';
import { Form, Input, Button, Card, notification } from 'antd';

import {
  useGetParamsQuery,
  useUpdateParamMutation,
  ParameterKey,
  useStartScanLibraryMutation,
} from '../../utils/graphql';

import { SettingsComponentStyles } from './settings.styles';

export function SettingsComponent() {
  const [form] = Form.useForm();

  const { data, loading, refetch } = useGetParamsQuery();
  const [updateParam] = useUpdateParamMutation();
  const [scanLibrary] = useStartScanLibraryMutation({
    onCompleted: () =>
      notification.success({ message: 'Scan library folder started' }),
  });

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
    <SettingsComponentStyles>
      <div className="wrapper">
        <div className="flex">
          <Card loading={loading} title="Settings">
            <Form
              form={form}
              initialValues={data?.params || {}}
              onFinish={onFinish}
            >
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
          <Card title="Actions">
            <Button type="default" onClick={() => scanLibrary()}>
              Scan library folder
            </Button>
          </Card>
        </div>
      </div>
    </SettingsComponentStyles>
  );
}
