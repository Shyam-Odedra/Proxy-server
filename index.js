const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const url = require('url');

const app = express();

// Function to parse the target URL from the query parameter
const getTargetUrl = (req) => {
    const queryObject = url.parse(req.url, true).query;
    return queryObject.url;
};

app.use('test', (req, res) => {
    res.send("Proxy Server is Running Completely Fine!!!");
})

// Proxy middleware
app.use('/proxy', (req, res, next) => {
    const targetUrl = getTargetUrl(req);
    console.log("Proxy", targetUrl);
    if (!targetUrl) {
        res.status(400).send('Target URL is required');
        return;
    }

    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            // Set custom headers or modify the request here
        },
        onProxyRes: (proxyRes, req, res) => {
            // Modify the response headers to allow CORS
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        },
        pathRewrite: {
            '^/proxy': '', // Remove /proxy from the URL path
        },
    })(req, res, next);
});

const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Proxy server running on Port - ${PORT}`);
});
