import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { layoutActions, useAppDispatch, useAppSelector } from "@/redux";
// UI
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type ModeDropDownProps = {
  // eslint-disable-next-line no-unused-vars
  onSelect: (modelId: string | undefined) => void;
};

const ModeDropDown = ({ onSelect }: ModeDropDownProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const { currentModel, gptList } = useAppSelector((state) => state.gpt);
  const isDropdownVisible = useAppSelector(
    (state) => state.layout.isDropdownVisible
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0");

  useEffect(() => {
    if (isDropdownVisible && dropdownRef.current) {
      const fullHeight = dropdownRef.current.scrollHeight + "px";
      setMaxHeight(fullHeight);
    } else {
      setMaxHeight("0");
    }
  }, [isDropdownVisible]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    if (!isDropdownVisible) return;

    // Close the dropdown if the click is outside the modeDropDown component
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dispatch(layoutActions.toggleDropdown(false));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, isDropdownVisible]);

  // Transform gptList to prioritize 'name' over 'title'
  const transformedGptList = gptList.map((option) => {
    // Prioritize displaying 'name', fallback to 'title' if 'name' is not available
    const title = option.title || "Unnamed Assistant";
    const description = option.desc || "No description available";

    return {
      id: option.id,
      title,
      desc: description,
      urlPhoto: option.urlPhoto || "", // Default to an empty string if no photo is provided
    };
  });

  const onViewGPTs = () => {
    navigate(`/user/${userId}/gpts`);
    dispatch(layoutActions.toggleDropdown(false));
    console.log("Is Dropdown Visible: ", isDropdownVisible);
  };

  return (
    <div
      ref={dropdownRef}
      className="fixed mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-10 transition-max-height duration-500 ease-in-out"
      style={{ maxHeight }}
    >
      {isDropdownVisible &&
        transformedGptList.map((option) => (
          <div
            key={option.id}
            className="flex items-center pr-4 py-2 hover:bg-gray-300 hover:text-white"
          >
            <div className="pointer-events-none">
              <Avatar className="w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-110">
                <AvatarImage
                  src={option.urlPhoto || "/imgs/test.png"}
                  alt="Assistant Photo"
                />
              </Avatar>
            </div>
            <button
              onClick={() => onSelect(option.id)}
              className="flex justify-between items-center w-full ml-2 text-left text-sm text-gray-700"
            >
              {option.title} {/* Ensure the title or name is displayed */}
              <span
                className={`${
                  currentModel.id === option.id
                    ? "bg-blue-500"
                    : "bg-transparent border border-gray-400"
                } inline-block ml-2 rounded-full w-4 h-4`}
              ></span>
            </button>
          </div>
        ))}
      <button
        onClick={onViewGPTs}
        className="flex justify-between items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-900 hover:text-white"
      >
        View Assistant Details
      </button>
    </div>
  );
};

export default ModeDropDown;
