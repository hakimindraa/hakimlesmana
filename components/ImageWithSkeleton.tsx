"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps extends ImageProps {
  containerClassName?: string;
  skeletonClassName?: string;
}

export default function ImageWithSkeleton({
  src,
  alt,
  className,
  containerClassName,
  skeletonClassName,
  fill,
  onLoad,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Content of skeleton shimmer
  const skeletonNode = !isLoaded && (
    <div
      className={cn(
        "absolute inset-0 z-10 bg-slate-200/90 dark:bg-slate-800/90 overflow-hidden pointer-events-none transition-opacity duration-300",
        skeletonClassName
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
    </div>
  );

  // If using Next.js 'fill' property
  if (fill) {
    return (
      <>
        {skeletonNode}
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "transition-opacity duration-500 ease-out",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={(e) => {
            setIsLoaded(true);
            if (onLoad) onLoad(e);
          }}
          {...props}
        />
      </>
    );
  }

  // If using explicit width/height
  return (
    <div className={cn("relative overflow-hidden inline-block", containerClassName)}>
      {skeletonNode}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500 ease-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={(e) => {
          setIsLoaded(true);
          if (onLoad) onLoad(e);
        }}
        {...props}
      />
    </div>
  );
}

