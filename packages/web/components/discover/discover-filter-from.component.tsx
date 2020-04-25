import React, { useCallback, useMemo, useState } from 'react';
import {
  Form,
  Select,
  DatePicker,
  Slider,
  Button,
  Checkbox,
  Radio,
} from 'antd';
import { DiscoverFilterSectionComponent } from './discover-filter-section.component';
import {
  GetDiscoverQueryVariables,
  useGetLanguagesQuery,
  useGetGenresQuery,
  Entertainment,
} from '../../utils/graphql';
import { RadioChangeEvent } from 'antd/lib/radio';

interface DiscoverFilterFormComponentProps {
  params: GetDiscoverQueryVariables;
  onFinish: (formParams: GetDiscoverQueryVariables) => void;
}
export function DiscoverFilterFormComponent(
  props: DiscoverFilterFormComponentProps
) {
  const languagesQuery = useGetLanguagesQuery();
  const genresQuery = useGetGenresQuery();

  const [entertainment, setEntertainment] = useState<Entertainment>(
    Entertainment.Movie
  );

  const TMDBLanguages = languagesQuery.data?.languages;
  const TMDBMovieGenres = useMemo(
    () =>
      genresQuery.data?.genres.movieGenres?.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
    [genresQuery.data]
  );

  const TMDBTvShowGenres = useMemo(
    () =>
      genresQuery.data?.genres.tvShowGenres.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
    [genresQuery.data]
  );

  const [form] = Form.useForm();

  const languageOptions = useMemo(
    () =>
      TMDBLanguages?.map((l) => (
        <Select.Option key={l.code} value={l.code}>
          {l.language}
        </Select.Option>
      )),
    [TMDBLanguages]
  );

  const onSearch = (values: GetDiscoverQueryVariables) => {
    props.onFinish(values);
  };

  const onEntertainmentChange = (event: RadioChangeEvent) => {
    event.preventDefault();
    setEntertainment(event.target.value);
    form.setFieldsValue({
      genres: undefined,
    });
  };

  const formatter = useCallback((score: number) => () => `${score}%`, []);

  return (
    <Form form={form} initialValues={props.params} onFinish={onSearch}>
      <DiscoverFilterSectionComponent>
        <Form.Item key="entertainment" name="entertainment">
          <Radio.Group
            onChange={onEntertainmentChange}
            className="discover--filter-entertainment"
          >
            <Radio value={Entertainment.Movie}>Movie</Radio>
            <Radio value={Entertainment.TvShow}>Tv Show</Radio>
          </Radio.Group>
        </Form.Item>
      </DiscoverFilterSectionComponent>
      <DiscoverFilterSectionComponent title="Language">
        <Form.Item key="originLanguage" name="originLanguage">
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Language"
            optionFilterProp="children"
            size="middle"
          >
            {languageOptions}
          </Select>
        </Form.Item>
      </DiscoverFilterSectionComponent>
      <DiscoverFilterSectionComponent title="Year">
        <Form.Item key="year" name="year">
          <DatePicker picker="year" size="middle" />
        </Form.Item>
      </DiscoverFilterSectionComponent>
      <DiscoverFilterSectionComponent title="Genres">
        <Form.Item key="genres" name="genres">
          <Checkbox.Group
            className="discover--filter-genres"
            options={
              entertainment === Entertainment.Movie
                ? TMDBMovieGenres
                : TMDBTvShowGenres
            }
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
