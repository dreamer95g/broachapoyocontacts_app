import { ContactList } from "../components/contacts/ContactList";
import { ContactForm } from "../components/contacts/ContactForm";
import { ContactScreen } from "../components/contacts/ContactScreen";
import { CategoryList } from "../components/categories/CategoryList";

import { OrganizationList } from "../components/organizations/OrganizationList";
import { OrganizationForm } from "../components/organizations/OrganizationForm";
import { OrganizationScreen } from "../components/organizations/OrganizationScreen";

import { Home } from "../components/ui/Home";

import React from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import { MainSearch } from "../components/search/MainSearch";
import { TrackingList } from "../components/trackings/TrackingList";
import { TrackingForm } from "../components/trackings/TrackingForm";
import { TrackingScreen } from "../components/trackings/TrackingScreen";

import { ForeignMissionList } from "../components/foreign_missions/ForeignMissionList";
import { ForeignMissionScreen } from "../components/foreign_missions/ForeignMissionScreen";
import { ForeignMissionForm } from "../components/foreign_missions/ForeignMissionForm";

export const DashBoardRoutes = () => {
  return (
    <Switch>
      <Route exact path="/dashboard/contacts" component={ContactList} />
      <Route exact path="/dashboard/contacts/form" component={ContactForm} />
      <Route
        exact
        path="/dashboard/contacts/form/:id"
        component={ContactForm}
      />
      <Route
        exact
        path="/dashboard/contacts/view/:id"
        component={ContactScreen}
      />
      <Route exact path="/dashboard/categories" component={CategoryList} />

      <Route
        exact
        path="/dashboard/organizations"
        component={OrganizationList}
      />

      <Route
        exact
        path="/dashboard/organizations/form"
        component={OrganizationForm}
      />
      <Route
        exact
        path="/dashboard/organizations/form/:id"
        component={OrganizationForm}
      />
      <Route
        exact
        path="/dashboard/organizations/view/:id"
        component={OrganizationScreen}
      />

      <Route exact path="/dashboard/search" component={MainSearch} />

      <Route exact path="/dashboard/trackings" component={TrackingList} />
      <Route exact path="/dashboard/trackings/form" component={TrackingForm} />
      <Route
        exact
        path="/dashboard/trackings/form/:id"
        component={TrackingForm}
      />
      <Route
        exact
        path="/dashboard/trackings/view/:id"
        component={TrackingScreen}
      />

      <Route exact path="/dashboard/missions" component={ForeignMissionList} />
      <Route
        exact
        path="/dashboard/missions/form"
        component={ForeignMissionForm}
      />
      <Route
        exact
        path="/dashboard/missions/form/:id"
        component={ForeignMissionForm}
      />
      <Route
        exact
        path="/dashboard/missions/view/:id"
        component={ForeignMissionScreen}
      />

      <Route exact path="/dashboard" component={Home} />

      <Redirect to="/dashboard" />
    </Switch>
  );
};
