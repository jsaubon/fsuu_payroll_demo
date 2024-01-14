require("./bootstrap");

import { render } from "react-dom";
import React, { useContext, useReducer } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import LayoutContent from "./components/layout/layoutContent";
import "antd/dist/antd.css";
import "./style/custom.css";
import Login from "./components/pages/public/login";
import ClientsContext from "./contexts/clientsContext";
import AppContext from "./contexts/appContext";
import ClientsReducer from "./reducers/clientsReducer";
import AppReducer from "./reducers/appReducer";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
const App = () => {
    let isLogged = localStorage.getItem("token");

    const appState = useContext(AppContext);
    const [stateApp, dispatchApp] = useReducer(AppReducer, appState);

    const clientState = useContext(ClientsContext);
    const [stateClients, dispatchClients] = useReducer(
        ClientsReducer,
        clientState
    );
    return (
        <AppContext.Provider value={{ stateApp, dispatchApp }}>
            <QueryClientProvider client={queryClient}>
                <ClientsContext.Provider
                    value={{ stateClients, dispatchClients }}
                >
                    <Router>
                        <Switch>
                            <Route
                                path="/"
                                name="Home"
                                component={isLogged ? LayoutContent : Login}
                            />
                            <Route
                                exact
                                path="/login"
                                name="Login Page"
                                render={props => <Login {...props} />}
                            />
                        </Switch>
                    </Router>
                </ClientsContext.Provider>
            </QueryClientProvider>
        </AppContext.Provider>
    );
};

export default App;

render(<App />, document.getElementById("app"));
