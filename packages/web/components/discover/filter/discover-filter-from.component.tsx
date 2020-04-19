import React from 'react';
import { Form, Select, DatePicker, Slider, Button, Checkbox } from 'antd';
import { FilterDiscoverySectionComponent } from './discover-filter-section.component';
import {
  GetDiscoverQueryVariables,
  useGetLanguagesQuery,
  useGetGenresQuery,
} from '../../../utils/graphql';
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
  const { Option } = Select;
  const { onFinish } = props;

  const options = TMDBLanguages?.map((l) => (
    <Option key={l.code} value={l.code}>
      {l.language}
    </Option>
  ));

  const onSearch = (values: GetDiscoverQueryVariables) => {
    onFinish(values);
  };

  function formatter(score: number) {
    return `${score}%`;
  }

  return (
    <Form form={form} initialValues={props.params} onFinish={onSearch}>
      <FilterDiscoverySectionComponent title="Countries">
        <Form.Item key="originLanguage" name="originLanguage">
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Select the language"
            optionFilterProp="children"
            size="middle"
          >
            {options}
          </Select>
        </Form.Item>
      </FilterDiscoverySectionComponent>
      <FilterDiscoverySectionComponent title="Year">
        <Form.Item key="year" name="year">
          <DatePicker picker="year" size="middle" />
        </Form.Item>
      </FilterDiscoverySectionComponent>
      <FilterDiscoverySectionComponent title="Genres">
        <Form.Item key="genres" name="genres">
          <Checkbox.Group
            className="discover--filter-genres"
            options={TMDBMovieGenres?.map(({ id, name }) => ({
              label: name,
              value: id,
            }))}
          />
        </Form.Item>
      </FilterDiscoverySectionComponent>
      <FilterDiscoverySectionComponent title="Minimum Score">
        <Form.Item key="score" name="score">
          <Slider tooltipVisible tipFormatter={formatter} />
        </Form.Item>
      </FilterDiscoverySectionComponent>
      <Button type="default" htmlType="submit">
        Search
      </Button>
    </Form>
  );
}
