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
  Entertainment,
} from '../../utils/graphql';

import { reorder } from './settings.helpers';
import { RadioChangeEvent } from 'antd/lib/radio';

export function QualityParamsComponent() {
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [type, setType] = useState<Entertainment>(Entertainment.Movie);
  const { data, loading } = useGetQualityQuery({
    variables: { type },
  });
  const [saveQuality, { loading: saveLoading }] = useSaveQualityMutation({
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
          list: qualities,
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
        qualities: qualities.map((q) => ({ id: q.id, score: q.score })),
      },
    });
  };

  const onTypeChange = (event: RadioChangeEvent) => {
    event.preventDefault();
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
      loading={loading && !qualities?.length}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Radio.Group
          onChange={onTypeChange}
          value={type}
          style={{ paddingBottom: '20px' }}
        >
          <Radio value={Entertainment.Movie}>{Entertainment.Movie}</Radio>
          <Radio value={Entertainment.TvShow}>TV Show</Radio>
        </Radio.Group>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {qualities.map((quality, index) => (
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
