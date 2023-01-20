var http = require("http"),
    fs = require("fs"),
    port = 8080,
    pathToJSONFile = './hello.json';

http.createServer(function(request, response)
{
    
        var body = [];

        request.on('data', function(chunk)
        {
            body.push(chunk);
        });

        request.on('end', function()
        {
            body = Buffer.concat(body).toString();
            var myJSONdata = body.split("=")[1];
            fs.writeFileSync(pathToJSONFile, myJSONdata); //default: 'utf8'
        });
}).listen(port);