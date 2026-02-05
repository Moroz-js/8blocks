import { Tag } from '@/components/ui/Tag';

interface TagListProps {
  tags: Array<{
    id: string;
    name: string;
  }>;
  maxTags?: number;
}

export function TagList({
  tags,
  maxTags,
}: TagListProps) {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;

  if (displayTags.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-[0.625rem] items-center flex-wrap">
      {displayTags.map((tag) => (
        <Tag key={tag.id} variant="default">
          {tag.name}
        </Tag>
      ))}
    </div>
  );
}
