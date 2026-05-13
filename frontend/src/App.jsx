import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/Rootlayout";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";

function App() {
  const browserRouterObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Login />
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "user-profile",   
          element: <UserProfile />,
        },
      ],
    },
  ]);

  return <RouterProvider router={browserRouterObj} />;
}

export default App;
