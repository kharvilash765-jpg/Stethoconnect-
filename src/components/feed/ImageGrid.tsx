interface ImageGridProps {
  images: string[];
  alt: string;
}

export function ImageGrid({ images, alt }: ImageGridProps) {
  if (images.length === 0) return null;
  const count = images.length;
  const spanFirst = count === 3 || count === 5;

  return (
    <div
      className={`mt-3 grid gap-1.5 overflow-hidden rounded-2xl ${count === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${alt} image ${i + 1}`}
          loading="lazy"
          className={`w-full bg-slate-100 dark:bg-slate-800 object-cover ${
            count === 1 ? 'max-h-[480px]' : 'aspect-square'
          } ${spanFirst && i === 0 ? 'col-span-2 aspect-[16/10]' : ''}`}
        />
      ))}
    </div>
  );
}
