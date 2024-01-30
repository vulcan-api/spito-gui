import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./Layout/Header";
import Toaster from "./Layout/Toaster";
import Profile from "./Pages/Profile/Profile";
import RulesetPage from "./Pages/Ruleset/RulesetPage";
import Settings from "./Pages/Settings/Settings";
import EnvironmentPage from "./Pages/Environment/EnvironmentPage";
import Home from "./Pages/Home/Home";
import SavedEnvironments from "./Pages/SavedEnvironments/SavedEnvironments";

function App(): JSX.Element | null {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Header />,
            children: [
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "/environments/saved",
                    element: <SavedEnvironments />,
                },
                {
                    path: "/profile/:userId",
                    element: <Profile />,
                },
                {
                    path: "/ruleset/:rulesetId",
                    element: <RulesetPage />,
                },
                {
                    path: "/environments/:environmentId",
                    element: <EnvironmentPage />,
                },
                {
                    path: "/settings",
                    element: <Settings />,
                },
            ],
        },
    ]);

    return (
        <>
            <AnimatePresence mode="wait" initial={false}>
                <Toaster />
                <RouterProvider router={router} />
            </AnimatePresence>
        </>
    );
}

export default App;
