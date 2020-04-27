import React, { useState, useEffect } from 'react';
import { Card, Button, notification, Popover, Radio } from 'antd';
import { FaQuestionCircle } from 'react-icons/fa';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

import {
  useGetQualityQuery,
  Quality,
  useSaveQualityMutation,
  GetQualityDocument,
} from '../../utils/graphql';

import { reorder } from './settings.helpers';
import { RadioChangeEvent } from 'antd/lib/radio';

export function QualityParamsComponent() {
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [type, setType] = useState<'tvShow' | 'movie'>('tvShow');
  const { data, loading } = useGetQualityQuery();
  const [saveQuality, { loading: saveLoading }] = useSaveQualityMutation({
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GetQualityDocument }],
    onError: ({ message }) =>
      notification.error({
        message: message.replace('GraphQL error: ', ''),
        placement: 'bottomRight',
      }),
    onCompleted: () =>
      notification.success({
        message: 'Quality params saved',
        placement: 'bottomRight',
      }),
  });

  const handleDragEnd = (result: DropResult) => {
    if (result.destination) {
      setQualities(
        reorder<Quality>({
          list: qualities.filter((q) => q.type === type),
          startIndex: result.source.index,
          endIndex: result.destination.index,
        })
      );
    }
  };

  const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    saveQuality({
      variables: {
        qualities: qualities
          .filter((q) => q.type === type)
          .map((q) => ({ id: q.id, score: q.score })),
      },
    });
  };

  const onTypeChange = (event: RadioChangeEvent) => {
    setType(event.target.value);
  };

  useEffect(() => {
    if (data?.qualities) setQualities(data.qualities);
  }, [data]);

  return (
    <Card
      title={
        <>
          <div className="title">Quality preference</div>
          <div className="help">
            <Popover content="Drag and drop to re-order the list">
              <FaQuestionCircle />
            </Popover>
          </div>
        </>
      }
      className="quality-preference"
      loading={loading}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Radio.Group
          onChange={onTypeChange}
          value={type}
          style={{ paddingBottom: '20px' }}
        >
          <Radio value="movie">Movie</Radio>
          <Radio value="tvShow">Tv Show</Radio>
        </Radio.Group>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {qualities
                .filter((q) => q.type === type)
                .map((quality, index) => (
                  <Draggable
                    key={quality.id}
                    index={index}
                    draggableId={quality.name}
                  >
                    {(provided2) => (
                      <div
                        ref={provided2.innerRef}
                        {...provided2.draggableProps}
                        {...provided2.dragHandleProps}
                      >
                        <div className="ant-btn ant-btn-dashed">
                          {quality.name}
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
      <Button
        type="default"
        className="save-btn"
        onClick={handleSave}
        loading={saveLoading}
      >
        Save
      </Button>
    </Card>
  );
}
