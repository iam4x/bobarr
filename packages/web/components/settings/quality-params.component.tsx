import React, { useState, useEffect } from 'react';
import { Card, Button, notification, Popover } from 'antd';
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

function reorder<TList>({
  list,
  startIndex,
  endIndex,
}: {
  list: TList[];
  startIndex: number;
  endIndex: number;
}) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result.map((row, index) => ({ ...row, score: list.length - index }));
}

export function QualityParamsComponent() {
  const [qualities, setQualities] = useState<Quality[]>([]);

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
