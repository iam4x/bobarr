import React, { useCallback, useMemo } from 'react';
import { Form, Select, DatePicker, Slider, Button, Checkbox } from 'antd';
import { DiscoverFilterSectionComponent } from './discover-filter-section.component';
import {
  GetDiscoverQueryVariables,
  useGetLanguagesQuery,
  useGetGenresQuery,
} from '../../utils/graphql';

interface DiscoverFilterFormComponentProps {
  params: GetDiscoverQueryVariables;
  onFinish: (formParams: GetDiscoverQueryVariables) => void;
}
export function DiscoverFilterFormComponent(
  props: DiscoverFilterFormComponentProps
) {
  const languagesQuery = useGetLanguagesQuery();
  const genresQuery = useGetGenresQuery();

  const TMDBLanguages = languagesQuery.data?.languages;
  const TMDBMovieGenres = genresQuery.data?.genres.movieGenres;
  const [form] = Form.useForm();

  const options = useMemo(
    () =>
      TMDBLanguages?.map(({ language, code }) => {
        const prePopulatedLanguage = code === 'xx' ? 'Silent movie' : language;
        return (
          <Select.Option key={code} value={code}>
            {prePopulatedLanguage}
          </Select.Option>
        );
      }),
    [TMDBLanguages]
  );

  const onSearch = (values: GetDiscoverQueryVariables) => {
    props.onFinish(values);
  };

  const formatter = useCallback((score: number) => () => `${score}%`, []);

  return (
    <Form form={form} initialValues={props.params} onFinish={onSearch}>
      <DiscoverFilterSectionComponent title="Language">
        <Form.Item key="originLanguage" name="originLanguage">
          <Select
            allowClear
            showSearch
            style={{ width: '100%' }}
            placeholder="Language"
            optionFilterProp="children"
            size="middle"
          >
            {options}
          </Select>
        </Form.Item>
      </DiscoverFilterSectionComponent>
      <DiscoverFilterSectionComponent title="Release Year">
        <Form.Item key="primaryReleaseYear" name="primaryReleaseYear">
          <DatePicker picker="year" size="middle" />
        </Form.Item>
      </DiscoverFilterSectionComponent>
      <DiscoverFilterSectionComponent title="Genres">
        <Form.Item key="genres" name="genres">
          <Checkbox.Group
            className="discover--filter-genres"
            options={TMDBMovieGenres?.map(({ id, name }) => ({
              label: name,
              value: id,
            }))}
          />
        </Form.Item>
      </DiscoverFilterSectionComponent>
      <DiscoverFilterSectionComponent title="Minimum Score">
        <Form.Item key="score" name="score">
          <Slider tooltipVisible tipFormatter={formatter} />
        </Form.Item>
      </DiscoverFilterSectionComponent>
      <Button type="default" htmlType="submit">
        Search
      </Button>
    </Form>
  );
}
