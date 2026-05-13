import { Outlet } from "react-router-dom";
import Header from "./Header";

function Rootlayout() {
  return (
    <div>
      <Header />
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
}

export default Rootlayout;