import { useLocation, useRoutes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./Layout/Header";
import Toaster from "./Layout/Toaster";
import Profile from "./Pages/Profile/Profile";
import RulesetPage from "./Pages/Ruleset/RulesetPage";
import Settings from "./Pages/Settings/Settings";
import EnvironmentPage from "./Pages/Environment/EnvironmentPage";
import Home from "./Pages/Home/Home";
import SavedEnvironments from "./Pages/SavedEnvironments/SavedEnvironments";
import { cloneElement, useState } from "react";
import { listen, Event } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";

function App(): JSX.Element | null {
    const [log, setLog] = useState("");
    const element = useRoutes([
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

    const location = useLocation();
    if (!element) return null;

    // TODO: move it
    listen("Echo", (event: Event<{ mess_type: string; message: string }>) => {
        setLog(
            "[" + event.payload.mess_type + "]" + " " + event.payload.message
        );
    });

    return (
        <>
            <AnimatePresence mode="wait" initial={false}>
                <Toaster />
                {/*TODO: remove it*/}
                <div
                    style={{
                        position: "absolute",
                        background: "white",
                        color: "black",
                        top: 0,
                        left: 0,
                    }}
                >
                    <button
                        onClick={() => {
                            invoke("start_spito_cli", {
                                ruleset: "avorty/spito-ruleset",
                                rule: "info",
                            });
                        }}
                    >
                        Run spito
                    </button>
                    {log}
                </div>
                {/**/}
                {cloneElement(element, { key: location.pathname })}
            </AnimatePresence>
        </>
    );
}

export default App;
