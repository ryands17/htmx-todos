import { FC } from 'hono/jsx';

export const Layout: FC = (props) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Express + HTMX</title>
        <link rel="stylesheet" href="/static/index.css" />
        <script src="/static/htmx@1.9.8.js"></script>
        <script src="/static/hyperscript@0.9.12.js"></script>
      </head>
      <body>{props.children}</body>
      <script>
        htmx.config.globalViewTransitions = true;
        htmx.config.useTemplateFragments = true;
      </script>
    </html>
  );
};
