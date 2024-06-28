/* eslint-disable */
import React from "react";
import Navigation from "../navigation/navigation";
import Menu from "../Menus/Menu";

function Layout(props) {
  return (
    <>
      <Navigation />
      <div className="flex flex-col md:flex-row">
        <Menu />
        <div className="flex-grow p-4 md:p-0">{props.children}</div>
      </div>
    </>
  );
}

export default Layout;
