import React from 'react';
import {src} from "../../data/imgSrc.ts"

const Features = () => {
 const min=0;
 const max =src.length;
 const imgIndex= Math.floor(Math.random() * (max - min) + min);
  return (
    <div className="w-full h-full">
      <img
        className="w-full h-full object-cover"
        src={src[imgIndex]}
        alt="Feature Background"
      />
    </div>
  );
  
};

export default Features;
