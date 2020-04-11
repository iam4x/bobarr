import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { orderBy } from 'lodash';

import {
  SortDescendingOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';

import { createSearchFunction } from '../../utils/create-search-function';

interface UseSortableProps<TEntity> {
  searchableAttributes: string[];
  sortAttributes: Array<{ label: string; key: string }>;
  rows?: TEntity[];
}

export function useSortable<TEntity>(props: UseSortableProps<TEntity>) {
  const { searchableAttributes, sortAttributes, rows } = props;

  const [results, setResults] = useState(rows || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderByAttribute, setOrderByAttribute] = useState(
    `${sortAttributes[0].key}:asc`
  );

  const [key, order] = orderByAttribute.split(':') as [string, 'desc' | 'asc'];
  const handleSort = (newSort: { label: string; key: string }) => {
    if (newSort.key === key) {
      return setOrderByAttribute(
        order === 'asc' ? `${newSort.key}:desc` : `${newSort.key}:asc`
      );
    }
    return setOrderByAttribute(`${newSort.key}:desc`);
  };

  useEffect(() => {
    const searchFn = createSearchFunction(searchableAttributes, searchQuery);
    const filteredAndOrdered = orderBy(rows, [key], [order]).filter((row) =>
      searchQuery.trim() && searchQuery.trim().length >= 3
        ? searchFn(row)
        : true
    );
    setResults(filteredAndOrdered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, searchQuery, orderByAttribute]);

  const renderSortable = () => (
    <div className="sortable">
      <div className="sort-buttons">
        {sortAttributes.map((sortAttr) => (
          <Button
            key={sortAttr.key}
            type={sortAttr.key === key ? 'default' : 'dashed'}
            onClick={() => handleSort(sortAttr)}
            icon={getSortIcon({
              forKey: sortAttr.key,
              activeKey: key,
              activeOrder: order,
            })}
          >
            {sortAttr.label}
          </Button>
        ))}
      </div>
      <div className="search-input">
        <Input.Search
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
        />
      </div>
    </div>
  );

  return { renderSortable, results };
}

function getSortIcon({
  forKey,
  activeKey,
  activeOrder,
}: {
  forKey: string;
  activeKey: string;
  activeOrder: string;
}) {
  if (activeKey === forKey) {
    return activeOrder === 'asc' ? (
      <SortDescendingOutlined />
    ) : (
      <SortAscendingOutlined />
    );
  }

  return undefined;
}
