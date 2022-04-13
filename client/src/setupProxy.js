const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(function (req, res, next) {
    // this enables cross-origin isolation, which is necessary
    // for SharedArrayBuffer (which ffmpeg-wasm uses)
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  });

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
    })
  );
};