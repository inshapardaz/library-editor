import dotenv from "dotenv";
import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import envFilePlugin from "esbuild-envfile-plugin";

dotenv.config({ debug: true, path: `.env.${process.env.NODE_ENV}` });
const args = process.argv;

const config = {
  logLevel: "info",
  entryPoints: ["src/index.jsx"],
  outfile: "public/build/bundle.js",
  bundle: true,
  plugins: [sassPlugin({ type: "style" }), envFilePlugin],
  loader: {
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".svg": "file",
    ".gif": "file",
    ".js": "jsx",
  },
  assetNames: "[dir]/[name]",
  define: {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production"),
  },
};

if (args.includes("--build")) {
  esbuild
    .build({
      ...config,
      minify: true,
      sourcemap: false,
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

if (args.includes("--start")) {
  esbuild
    .context({
      ...config,
      minify: false,
      sourcemap: true,
    })
    .then(async (ctx) => {
      await ctx.watch(); // this is needed only if live reloading will be used
      await ctx.serve({
        port: 4300,
        servedir: "public",
        fallback: `public/index.html`,
        onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
          console.info(
            remoteAddress,
            status,
            `"${method} ${path}" [${timeInMS}ms]`
          );
        },
      });
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
