import React from 'react';

type PodcastCardProps = {
  imgURL: string;
  title: string;
  description: string;
  podcastId: number;
};

const PodcastCard = ({
  imgURL,
  title,
  description,
  podcastId,
}: PodcastCardProps) => {
  return <div>PodcastCard</div>;
};

export default PodcastCard;
