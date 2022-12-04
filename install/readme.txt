Installing your service
execute 
qckwinsvc2 install name="ExpressJS" description="Greets the world" path="C:\myapp\bin\server.js" args="-a -c" now

Start and stop your service
 qckwinsvc2 start name="ExpressJS"
 qckwinsvc2 stop name="ExpressJS"

Uninstalling your service
 qckwinsvc2 uninstall name="ExpressJS"



qckwinsvc --name "ExpressJS" --description "Greets the world" --script "C:\myapp\bin\server.js" --startImmediately


node C:\myapp\bin\server.js