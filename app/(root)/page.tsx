import PodcastCard from '@/components/PodcastCard';
import { podcastData } from '@/constants';
import React from 'react';

const Home = () => {
  return (
    <div className='mt-9 flex flex-col gap-9'>
      <section className='flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Trending podcasts</h1>
        {podcastData.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            imgURL={podcast.imgURL}
            title={podcast.title}
            description={podcast.description}
            podcastId={podcast.id}
          />
        ))}
      </section>
    </div>
  );
};

export default Home;
