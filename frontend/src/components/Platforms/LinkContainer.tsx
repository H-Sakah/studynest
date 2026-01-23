import React, { useEffect, useState } from 'react';
import ImagePlaceholder from '../../icons/imagePlaceholder.svg';
import axios from 'axios';

export type LinkContainerProps = {
  src?: string;
  title: string;
  link: string;
  onRemove: () => void; 
};

export function LinkContainer({
  src,
  title,
  link,
  onRemove,
}: LinkContainerProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);
  const [svgs, setSvgs] = useState<string[]>([]);
  const [titleImage, setTitleImage] = useState<string | undefined>();

  link = adjustLink(link);

  useEffect(() => {
    if (!src) {
      fetchImage(link).then((image) => {
        if (image) {
          testImage(image, (isValid) => {
            if (isValid) setImageSrc(image);
          });
        } else {
              const generatedImage = generateTitleImage(title);
              setTitleImage(generatedImage);
          }
      });
    }
  }, [link, src, title]);

  function adjustLink(link: string): string {
    if (!link.startsWith('http')) {
      return `http://${link}`;
    }
    if (!link.match(/\.[a-z]{2,3}$/)) {
      link = link.split('/')[0] + '//' + link.split('/')[2];
    }
    return link;
  }

  

  async function fetchImage(link: string): Promise<string> {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/extract-images',
        { url: link }
      );

      if (response.status !== 200) {
        console.log(`Failed to fetch image: ${response.status}`);
      }

      return response.data.image || '';
    } catch (error) {
      console.log('Error fetching image:', error);
      return '';
    }
  }

  function generateTitleImage(title: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return '';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL('image/png');
  }

 

  function testImage(url: string, callback: (isValid: boolean) => void) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = url;
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full"
        aria-label="Remove"
      >
        ×
      </button>

     
      <div className="w-25 h-25 flex items-center justify-center bg-gray-200 rounded-md overflow-hidden">
        <form
          action={link}
          method="get"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            type="submit"
            className="flex items-center justify-center w-40 h-40 bg-gray-200 rounded-md overflow-hidden"
          >
            {imageSrc ? (
              <img src={imageSrc} className="object-cover w-full h-full" />
            ) : svgs.length > 0 ? (
              <div
                dangerouslySetInnerHTML={{ __html: svgs[0] }}
                className="w-16 h-16 object-contain"
              />
            ) : titleImage ? (
              <img src={titleImage} className="object-contain w-full h-full" />
            ) : (
              <ImagePlaceholder className="w-16 h-16 text-gray-500" />
            )}
          </button>
        </form>
      </div>

      <h1 className="mt-4 text-center text-gray-700 font-medium text-sm">
        {title}
      </h1>
    </div>
  );
}
