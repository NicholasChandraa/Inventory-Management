/* eslint-disable */
import React from "react";
import Navigation from "../navigation/navigation";
import Menu from "../Menus/Menu";

function Layout(props) {
  return (
    <>
        <Navigation />
        <div className="flex">
          <Menu />
          <div className="flex-grow">{props.children}</div>
        </div>
    </>
  );
}

export default Layout;
