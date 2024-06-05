const { createProxyMiddleware } = require('http-proxy-middleware');
const SERVER_IP = process.env.REACT_APP_SERVER_IP;

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: SERVER_IP, //  서버 URL or localhost:설정한포트번호
            changeOrigin: true,
        })
    );
};