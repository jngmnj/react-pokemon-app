import React, { useEffect, useState } from "react";

const LazyImage = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [opacity, setOpacity] = useState('opacity-0');

  useEffect(() => {
    isLoading ? setOpacity("opacity-0") : setOpacity("opacity-100");
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <div className="absolute h-full  z-10 w-full flex items-center justify-center">
          ...loading
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width="100%"
        height="auto"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        className={`object-contain h-full ${opacity}`}
      />
    </>
  );
};

export default LazyImage;
