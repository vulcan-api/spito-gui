import { useLocation, useRoutes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { cloneElement } from "react";
import Header from "./Layout/Header";
import Toaster from "./Layout/Toaster";
import Profile from "./Pages/Profile/Profile";
import RulesetPage from "./Pages/Ruleset/RulesetPage";

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
          path: "/myenviroments",
          element: <h1>My configs</h1>
        },
        {
          path: "/profile/:userId",
          element: <Profile />
        },
        {
          path: "/ruleset/:rulesetId",
          element: <RulesetPage />
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
