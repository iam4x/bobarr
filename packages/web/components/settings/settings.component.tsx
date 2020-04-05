import React from 'react';
import styled from 'styled-components';
import { Skeleton, Form, Input, Button, Card, notification } from 'antd';

import {
  useGetParamsQuery,
  useUpdateParamMutation,
  ParameterKey,
} from '../../utils/graphql';

const SettingsComponentStyles = styled.div`
  padding-top: 48px;

  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }
`;

export function SettingsComponent() {
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
    <SettingsComponentStyles>
      <div className="wrapper">
        <Skeleton active={true} loading={loading}>
          <Card style={{ width: 600 }}>
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
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form>
          </Card>
        </Skeleton>
      </div>
    </SettingsComponentStyles>
  );
}
