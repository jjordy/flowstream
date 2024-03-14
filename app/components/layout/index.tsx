import { FC } from "hono/jsx";
import { Nav } from "./nav";

export const Layout: FC = (props) => {
  return (
    <html lang="en">
      <head>
        <title>FlowStream</title>
        <link href="/public/app.css" rel="stylesheet" />
        <script
          src="https://unpkg.com/htmx.org@1.9.10"
          integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
          crossorigin="anonymous"
        ></script>
        <script src="https://unpkg.com/sortablejs@1.15.2"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
        <script src="/public/main.js"></script>
        <link rel="shortcut icon" type="image/svg" href="/public/favicon.svg" />
      </head>
      <Nav />
      <body>{props.children}</body>
    </html>
  );
};
