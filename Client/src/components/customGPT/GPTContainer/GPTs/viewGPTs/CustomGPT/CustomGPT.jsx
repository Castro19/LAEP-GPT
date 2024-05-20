import React from "react";

const CustomGPT = ({ asst, urlPhoto, title, desc }) => {
  return (
    <div>
      <p>CustomGPT: {asst}</p>
      <p>urlphoto: {urlPhoto}</p>
      <p>Title: {title}</p>
      <p>Description: {desc}</p>
    </div>
  );
};

export default CustomGPT;
