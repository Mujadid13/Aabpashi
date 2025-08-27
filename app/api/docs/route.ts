import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="AabPashi API Documentation" />
    <title>AabPashi API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js" crossorigin></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js" crossorigin></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/api/openapi',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                validatorUrl: null,
                docExpansion: "list",
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
                tryItOutEnabled: true,
                requestInterceptor: function(request) {
                    // Add API key to requests if available
                    const apiKey = localStorage.getItem('aabpashi_api_key');
                    if (apiKey) {
                        request.headers['Authorization'] = 'Bearer ' + apiKey;
                    }
                    return request;
                }
            });
            
            // Add API key input
            const apiKeyInput = document.createElement('div');
            apiKeyInput.innerHTML = \`
                <div style="padding: 20px; background: #f0f0f0; border-bottom: 1px solid #ccc;">
                    <label for="api-key-input" style="font-weight: bold; margin-right: 10px;">API Key:</label>
                    <input type="password" id="api-key-input" placeholder="Enter your API key" style="width: 300px; padding: 5px; margin-right: 10px;">
                    <button onclick="setApiKey()" style="padding: 5px 10px;">Set API Key</button>
                    <button onclick="clearApiKey()" style="padding: 5px 10px; margin-left: 5px;">Clear</button>
                </div>
            \`;
            document.body.insertBefore(apiKeyInput, document.getElementById('swagger-ui'));
            
            // Load saved API key
            const savedApiKey = localStorage.getItem('aabpashi_api_key');
            if (savedApiKey) {
                document.getElementById('api-key-input').value = savedApiKey;
            }
        };
        
        function setApiKey() {
            const apiKey = document.getElementById('api-key-input').value;
            if (apiKey) {
                localStorage.setItem('aabpashi_api_key', apiKey);
                alert('API key set successfully!');
                location.reload();
            } else {
                alert('Please enter an API key');
            }
        }
        
        function clearApiKey() {
            localStorage.removeItem('aabpashi_api_key');
            document.getElementById('api-key-input').value = '';
            alert('API key cleared!');
            location.reload();
        }
    </script>
</body>
</html>`;

  return new NextResponse(swaggerHtml, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 