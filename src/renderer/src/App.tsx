import { useLocation, useRoutes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { cloneElement } from "react";
import Header from "./Layout/Header";
import Toaster from "./Layout/Toaster";
import Profile from "./Pages/Profile";

function App(): JSX.Element | null {
  const element = useRoutes([
    {
      path: "/",
      element: <Header />,
      children: [
        {
          path: "/",
          element: <h1>Landing page</h1>
        },
        {
          path: "/marketplace",
          element: <h1>Marketplace</h1>
        },
        {
          path: "/myconfigs",
          element: <h1>My configs</h1>
        },
        {
          path: "/profile/:userId",
          element: <Profile />
        },
        {
          path: "/profile/:userId/rules",
          element: <Profile />
        },
        {
          path: "/profile/:userId/rulesets",
          element: <Profile />
        },
        {
          path: "/profile/:userId/configs",
          element: <Profile />
        }
      ]
    }
  ]);

  const location = useLocation();

  if (!element) return null;

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <Toaster />
        {cloneElement(element, { key: location.pathname })}
      </AnimatePresence>
    </>
  );
}

export default App;
