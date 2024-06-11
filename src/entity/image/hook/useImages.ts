import { ChangeEvent, useCallback, useState } from 'react';

import { useUploadImageMutation } from '../api/useUploadImageMutation';
import { ImageType } from '../model/types';

const MAX_IMAGES_COUNT = 3;

interface Options {
  maxCount?: number;
}

const useImages = ({ maxCount = MAX_IMAGES_COUNT }: Options = {}) => {
  const [images, setImages] = useState<ImageType[]>([]);

  const { mutate } = useUploadImageMutation();

  const updateImages = (images: ImageType[]) => {
    setImages(images);
  };

  const uploadFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = e.target.files;
    if (!uploadFiles) return;
    if (images.length >= maxCount) return;

    mutate(
      {
        uploadFiles,
      },
      {
        onSuccess: (data) => {
          setImages((prev) => [...prev, ...data.data]);
          e.target.value = '';
        },
      }
    );
  };

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  return { images, uploadFiles, clearImages, updateImages };
};

export { useImages };
