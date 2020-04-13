import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Popover, Button, Input, notification } from 'antd';
import { FaQuestionCircle, FaPlus } from 'react-icons/fa';
import { orderBy } from 'lodash';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

import { useGetTagsQuery, useSaveTagsMutation } from '../../utils/graphql';

import { reorder } from './settings.helpers';
import { DeleteOutlined } from '@ant-design/icons';

export const TagsComponentStyles = styled.div`
  .add-input {
    display: flex;

    .ant-btn {
      margin-left: 4px;
      margin-bottom: 0;
      width: 80px;
    }
  }
`;

interface PartialTag {
  id?: number;
  name: string;
  score: number;
}

export function TagsComponent() {
  const [tags, setTags] = useState<PartialTag[]>([]);
  const [addValue, setAddValue] = useState('');

  const { data, loading } = useGetTagsQuery();
  const [saveTags, { loading: saveLoading }] = useSaveTagsMutation({
    onError: ({ message }) =>
      notification.error({
        message: message.replace('GraphQL error: ', ''),
        placement: 'bottomRight',
      }),
    onCompleted: () =>
      notification.success({
        message: 'Tags saved',
        placement: 'bottomRight',
      }),
  });

  const handleDragEnd = (result: DropResult) => {
    if (result.destination) {
      setTags(
        reorder<PartialTag>({
          list: tags,
          startIndex: result.source.index,
          endIndex: result.destination.index,
        })
      );
    } else {
      // delete tag
      setTags(tags.filter((_tag, index) => index !== result.source.index));
    }
  };

  const handleAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (addValue && addValue.trim() && addValue.length > 1) {
      const nextTags = [...tags, { name: addValue, score: 0 }].map(
        (tag, index) => {
          return { ...tag, score: tags.length + 1 - index };
        }
      );

      setTags(orderBy(nextTags, ['score'], ['desc']));
      setAddValue('');
    }
  };

  const handleSave = async () => {
    await saveTags({
      variables: {
        tags: tags.map((tag) => ({ name: tag.name, score: tag.score })),
      },
    });
  };

  useEffect(() => {
    if (data?.tags) setTags(data.tags);
  }, [data]);

  return (
    <TagsComponentStyles>
      <Card
        title={
          <>
            <div className="title">Tags whitelist</div>
            <div className="help">
              <Popover
                content={
                  <>
                    Only search results with one of those tags will be
                    downloaded.
                    <br />
                    You can re-order tags in order of preference.
                  </>
                }
              >
                <FaQuestionCircle />
              </Popover>
            </div>
          </>
        }
        className="quality-preference"
        loading={loading}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tags.map((tag, index) => (
                  <Draggable
                    key={tag.name}
                    index={index}
                    draggableId={tag.name}
                  >
                    {(provided2, { isDragging, draggingOver }) => (
                      <div
                        ref={provided2.innerRef}
                        {...provided2.draggableProps}
                        {...provided2.dragHandleProps}
                      >
                        <div className="ant-btn ant-btn-dashed">
                          {isDragging && !draggingOver && (
                            <DeleteOutlined style={{ marginRight: 12 }} />
                          )}
                          {tag.name}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <form onSubmit={handleAddSubmit} className="add-input">
          <Input
            type="text"
            value={addValue}
            onChange={({ target }) => setAddValue(target.value)}
          />
          <Button type="default" htmlType="submit">
            <FaPlus />
          </Button>
        </form>
        <Button
          type="default"
          className="save-btn"
          onClick={handleSave}
          loading={saveLoading}
        >
          Save
        </Button>
      </Card>
    </TagsComponentStyles>
  );
}
