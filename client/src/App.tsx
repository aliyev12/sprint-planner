import { useContext, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import M from "materialize-css";
import { Home } from "./components/Home";
import { Join } from "./components/Join";
import { Room } from "./components/Room";
import { Context } from "./global/Context";
import { Layout } from "./global/Layout";
import { Overview } from "./components/Overview";
import { getEndpoint } from "./common";

function App() {
  useEffect(() => {
    // Initialize Materialize components
    M.AutoInit();
  }, []);

  // Create router with data-driven routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: ":roomId",
          element: <RoomOrJoin />,
        },
        {
          path: ":roomId/overview",
          element: <Overview />,
        },
        {
          path: "*",
          element: <Navigate to="/" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

// Create a wrapper component that decides which component to render
function RoomOrJoin() {
  const { roomState } = useContext(Context);

  // This will be evaluated when the route is accessed
  return roomState && roomState.userName ? <Room /> : <Join />;
}
