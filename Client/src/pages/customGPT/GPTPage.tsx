import { Outlet } from "react-router-dom";

import GPTContainer from "../../components/customGPT/GPTContainer/GPTContainer";

const GPTPage = () => {
  return (
    <div>
      <GPTContainer />
      <Outlet />
    </div>
  );
};

export default GPTPage;
