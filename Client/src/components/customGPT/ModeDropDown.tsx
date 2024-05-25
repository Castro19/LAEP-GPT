import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux";
// UI
import UserAvatar from "@/components/userProfile/UserAvatar";

type ModeDropDownProps = {
  // eslint-disable-next-line no-unused-vars
  onSelect: (modelId: string | undefined) => void;
};
const ModeDropDown = ({ onSelect }: ModeDropDownProps) => {
  const navigate = useNavigate();
  // Redux Store:
  const { currentModel, gptList } = useAppSelector((state) => state.gpt);
  const isDropdownVisible = useAppSelector(
    (state) => state.layout.isDropdownVisible
  );

  // To manage the dropdown effect of the mode dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0");
  console.log("GPTLIST: ", gptList);
  useEffect(() => {
    if (isDropdownVisible && dropdownRef.current) {
      const fullHeight = dropdownRef.current.scrollHeight + "px";
      setMaxHeight(fullHeight);
    } else {
      setMaxHeight("0");
    }
  }, [isDropdownVisible]);

  const onViewGPTs = () => {
    navigate("gpts");
  };

  return (
    <div
      ref={dropdownRef}
      className="fixed mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-10 transition-max-height duration-500 ease-in-out"
      style={{ maxHeight }}
    >
      {isDropdownVisible &&
        gptList.map((option) => (
          <div
            key={option.id}
            className="flex items-center pr-4 py-2 hover:bg-gray-300 hover:text-white"
          >
            <UserAvatar userPhoto={option.urlPhoto} />
            <button
              onClick={() => onSelect(option.id)}
              className="flex justify-between items-center w-full ml-2 text-left text-sm text-gray-700"
            >
              {option.title}
              <span
                className={`${
                  currentModel.id === option.id
                    ? "bg-blue-500" // Filled circle for selected option
                    : "bg-transparent border border-gray-400" // Empty circle for unselected option
                } inline-block ml-2 rounded-full w-4 h-4`}
              ></span>
            </button>
          </div>
        ))}
      <button
        onClick={onViewGPTs}
        className="flex justify-between items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-900 hover:text-white"
      >
        View more Assistants
      </button>
    </div>
  );
};

export default ModeDropDown;
