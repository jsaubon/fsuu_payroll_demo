import React, { useEffect, useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Layout, Breadcrumb } from "antd";
import LayoutHeader from "./LayoutHeader";
import LayoutFooter from "./LayoutFooter";
import PageClients from "../pages/private/PageClients";
import PageClientInfo from "../pages/private/pageClientInfo";
import PagePayrolls from "../pages/private/pagePayrolls";
import PageReports from "../pages/private/pageReports";
import PageUsers from "../pages/private/pageUsers";

const LayoutContent = () => {
    const { Content } = Layout;

    return (
        <Layout className="layout">
            <LayoutHeader />
            <Content
                className="site-layout"
                style={{ padding: "0 50px", marginTop: 64 }}
            >
                <div
                    className="site-layout-background"
                    style={{ padding: 24, minHeight: 380 }}
                >
                    <Switch>
                        <Route
                            exact
                            path="/employees"
                            component={PageClients}
                        />
                        <Route
                            exact
                            path="/payrolls"
                            component={PagePayrolls}
                        />
                        <Route exact path="/reports" component={PageReports} />
                        <Route exact path="/users" component={PageUsers} />
                        <Route
                            exact
                            path="/employees/:id"
                            component={PageClientInfo}
                        />
                        <Route path="/" exact>
                            <Redirect to="/employees" />
                        </Route>
                    </Switch>
                </div>
            </Content>
            <LayoutFooter />
        </Layout>
    );
};

export default LayoutContent;
