<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  <xsl:output method="html" indent="yes" encoding="UTF-8" />
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap | Avalanche.report</title>
        <style>
          body {
            font-family: "Open Sans", Arial, Helvetica, sans-serif;
            background-color: #f2f7fa;
            background: url("images/colorbar.svg") no-repeat 0 0;
          }
          h1,
          a,
          a:visited {
            color: #19abff;
          }
          a:hover {
            color: #1489cc;
          }
          .logo {
            float: right;
          }
        </style>
      </head>
      <body>
        <img class="logo" src="images/logo.png" />
        <h1>Sitemap | Avalanche.report</h1>
        <ul>
          <xsl:for-each select="sm:urlset/sm:url">
            <li>
              <a href="{sm:loc}"><xsl:value-of select="sm:loc" /></a>
            </li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
