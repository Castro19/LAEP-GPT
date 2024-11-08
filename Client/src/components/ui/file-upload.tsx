import React, { useEffect, useRef } from "react";
import { MdOutlineFileUpload as IconUpload } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector, useAppDispatch, messageActions } from "@/redux";

export const FileUpload = ({
  onChange,
  selectedFile,
}: {
  // eslint-disable-next-line no-unused-vars
  onChange?: (file: File | null) => void;
  selectedFile?: File | null;
}) => {
  const dispatch = useAppDispatch();
  const { isSidebarVisible } = useAppSelector((state) => state.layout);
  const { error } = useAppSelector((state) => state.message);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconStyles = selectedFile ? "text-emerald-500" : "text-white";
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && files.length > 0 ? files[0] : null;

    // Check file size (1MB = 1000000 bytes)
    if (file && file.size > 1000000) {
      dispatch(
        messageActions.updateError(
          "File size limit exceeded. Please upload a file smaller than 1MB."
        )
      );
      return;
    } else if (error) {
      dispatch(messageActions.clearError());
    }

    if (onChange) {
      onChange(file);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    fileInputRef.current?.click();
  };

  useEffect(() => {
    // 1MB Limit
    if (selectedFile?.size && selectedFile.size > 10000000) {
      dispatch(
        messageActions.updateError(
          "File size limit exceeded. Please upload a smaller file."
        )
      );
    }
  }, [selectedFile, dispatch]);

  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClick}
              className="p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
            >
              <IconUpload className={`h-5 w-5 ${iconStyles}`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <span
              className={`text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs ${
                isSidebarVisible ? "ml-10" : ""
              }`}
            >
              {selectedFile ? selectedFile.name : "Upload a PDF"}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
