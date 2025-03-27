// botPaths.js
const botPaths = [
  // WordPress related paths
  "/wp-admin/:path*",
  "/wordpress/:path*",
  "/wp-login.php",
  "/wp-content/:path*",
  "/wp-includes/:path*",
  "/wp-json/:path*",
  "/wp/:path*",

  // Common PHP files
  "/:path*.php",

  // Admin paths
  "/admin/:path*",
  "/administrator/:path*",
  "/install/:path*",
  "/cms/:path*",

  // Database and backup files
  "/:path*.sql",
  "/:path*.bak",

  // Shell and config files
  "/:path*.sh",
  "/:path*.config",

  // Common vulnerability scan targets
  "/phpinfo.php",
  "/php_info.php",
  "/phpinfo",
  "/phpmyadmin/:path*",
  "/mysql/:path*",

  // Catch all .env files in any directory
  "/:path*/.env",
  "/:path*/.env.local",
  "/:path*/.env.example",
  "/:path*/.env.prod",
  "/:path*/.env.save",
  "/:path*/.env.backup",
  "/config.js",
  "/:path*/phpinfo",

  "/favicon.ico",
  "/ispmgr",
  "/xmlrpc.php",

  "/.well-known/traffic-advice",
  "/old",
  "/backup",
  "/new",
  "/bc",
  "/bk",
  "/main",
  "/ads.txt",
  "/copyright-disclaimerManuport",
  "/about@locations",
  "/copyright-",
  "/images/home_spanish_OK.jpg",
  "/imagecache/blog_full/nXJJLVl38gLyYENXe3l1rOf3c64xjTRCLXFOv9Yz.jpg",
  "/.vscode/sftp.json",
  "/.well-known",
  "/sftp-config.json",
  "/images/logo-primary-2x.png",

  "/AutoDiscover/autodiscover.xml"
];

module.exports = botPaths;
