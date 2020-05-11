import React from 'react';
import { RatingStyles } from './rating.styles';

export function RatingComponent({ rating }: { rating: number }) {
  return (
    <RatingStyles className="vote--container" rating={rating}>
      <div className="vote" />
      <div className="percent">{rating}%</div>
    </RatingStyles>
  );
}
