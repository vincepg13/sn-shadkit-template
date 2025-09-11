/* eslint-disable @servicenow/sdk-app-plugin/file-extension-in-import */
import Layout from "./layout/Layout";
import HomePage from "./routes/HomePage";
import { createHashRouter } from "react-router";
// import { queryClient } from "./queryClient.ts";
import { DemoPage } from "./routes/DemoPage";
import NotFoundError from "./routes/errors/NotFoundError";
import GeneralError from "./routes/errors/GeneralError";

export function makeRouter() {
  return createHashRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <GeneralError />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "demo", element: <DemoPage /> },
        { path: "*", element: <NotFoundError /> },
      ],
    },
  ]);
}
