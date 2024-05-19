import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import UserAvatar from "../userProfile/UserAvatar";
const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <UserAvatar />
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: -1 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute bottom-full transform translate-x-2 -translate-y-16">
              {" "}
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth zanimation
                className="bg-white dark:bg-gray-800 backdrop-blur-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative rounded-full  bg-white shadow-lg flex justify-center w-10 h-10" // Adjusted for circle
    >
      {children}
    </nav>
  );
};

export const HoveredLink = ({ children, onClick, ...rest }: any) => {
  return (
    <Link
      {...rest}
      onClick={onClick}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black "
    >
      {children}
    </Link>
  );
};
