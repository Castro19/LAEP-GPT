import { Button } from "@/components/ui/button";

interface DeletableTagsProps {
  tags: string[];
  // eslint-disable-next-line no-unused-vars
  onRemove: (tag: string) => void;
}

export function DeletableTags({ tags, onRemove }: DeletableTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Button
          key={tag}
          variant="outline"
          className="inline-flex items-center gap-2 dark:bg-black dark:text-white rounded-full "
          onClick={() => onRemove(tag)}
        >
          <div className="text-xl">&times;</div>
          <span className="p-1">{tag}</span>
        </Button>
      ))}
    </div>
  );
}
