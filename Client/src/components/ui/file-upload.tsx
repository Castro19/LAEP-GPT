import React, { useRef } from "react";
import { IconUpload } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const FileUpload = ({
  onChange,
  selectedFile,
}: {
  // eslint-disable-next-line no-unused-vars
  onChange?: (file: File | null) => void;
  selectedFile?: File | null;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconStyles = selectedFile ? "text-green-500" : "text-white";
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (onChange) {
      onChange(files && files.length > 0 ? files[0] : null);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <button
              type="button"
              onClick={handleClick}
              className="p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
            >
              <IconUpload className={`h-5 w-5 ${iconStyles}`} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <TooltipContent>
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                {selectedFile ? selectedFile.name : "Upload a PDF"}
              </span>
            </TooltipContent>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
