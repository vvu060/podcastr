import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';
import { Loader } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { GenerateThumbnailProps } from '@/types';
import { Input } from './ui/input';
import Image from 'next/image';
import { useToast } from './ui/use-toast';

import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const GenerateThumbnail = ({
  image,
  imagePrompt,
  setImage,
  setImagePrompt,
  setImageStorageId,
}: GenerateThumbnailProps) => {
  const { toast } = useToast();
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);

  const generateImage = async () => {};

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImage('');

    try {
      const file = new File([blob], fileName, {
        type: 'image/png',
      });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setIsImageLoading(false);
      toast({
        title: 'Thumbnail generate successfully',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error generating thumbnail',
        variant: 'destructive',
      });
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;

      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error generating thumbnail',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className='generate_thumbnail'>
        <Button
          type='button'
          variant='plain'
          className={cn('', { 'bg-black-6': isAiThumbnail })}
          onClick={() => setIsAiThumbnail(true)}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          type='button'
          variant='plain'
          className={cn('', { 'bg-black-6': !isAiThumbnail })}
          onClick={() => setIsAiThumbnail(false)}
        >
          Upload custom image
        </Button>
      </div>

      {isAiThumbnail ? (
        <div className='flex flex-col gap-5'>
          <div className='mt-5 flex flex-col gap-2.5'>
            <Label className='text-16 font-bold text-white-1'>
              AI Prompt to generate Thumbnail
            </Label>
            <Textarea
              className='input-class font-light focus-visible:ring-offset-orange-1 text-white-1'
              placeholder='Provide text to generate thumbnail'
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className='mt-5 w-full max-w-[200px]'>
            <Button
              type='submit'
              className='text-16 bg-orange-1 py-4 font-bold text-white-1'
              onClick={generateImage}
            >
              {isImageLoading ? (
                <>
                  <Loader size={20} className='animate-spin mr-4' />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className='image_div' onClick={() => imageRef?.current?.click()}>
          <Input
            type='file'
            className='hidden'
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image
              src='/icons/upload-image.svg'
              alt='upload'
              width={40}
              height={40}
            />
          ) : (
            <div className='text-16 flex-center font-medium text-white-1'>
              Uploading
              <Loader size={20} className='animate-spin ml-2' />
            </div>
          )}

          <div className='flex flex-col items-center gap-1'>
            <h2 className='text-12 font-bold text-orange-1'>Click to upload</h2>
            <p className='text-12 font-normal text-gray-1'>
              SVG, PNG, JPG, or GIF (max-1080x1080px)
            </p>
          </div>
        </div>
      )}

      {image && (
        <div className='flex-center w-full'>
          <Image
            src={image}
            width={200}
            height={200}
            className='mt-5'
            alt='thumbnail'
          />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
