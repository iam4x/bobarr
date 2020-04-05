import { NextPageContext } from 'next';

export function redirect(ctx: NextPageContext, path: string) {
  if (ctx.res) {
    ctx.res.writeHead(301, { Location: path });
    ctx.res.end();
  }
}
