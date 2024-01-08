# EDAP Backend

## Setting up the server for data collection

Preparing the backend server and simulation to talk with each other requires three steps:

- Host this backend server
- Connect this server with a database
- Connect the simulation with the server

### Hosting this server
1. Clone this repository to a server (an EC2 instance using Ubuntu on AWS, for example)
2. Install the required packages
   > In the directory with the server, run `npm install`
3. In this same directory, create a file called `.env`
   > On a linux server through the terminal, as an example, you can run the command:
   >
   > `touch .env`
4. Add the database connection string to the `.env` file in the form of `MongoConnectionURI=<string>`, where `<string>` is replaced with the connection string (see the [database section](#connecting-to-a-database)).
   > Example:
   >
   > `vim .env`
   >
   > Press `I` to insert text
   >
   > Type `MongoConnectionURI=<insert connection string here>`
   >
   > Press `esc`
   >
   > Type `:wq` to save and close the file
5. Run the server
   > In the terminal, run `npm run go`
   
### Connecting to a database
1. Create a database with MongoDB (you should have a connection string that contains a username and password for the database)
2. Add this connection string to the server's `.env` file
   > Example:
   >
   > `vim .env`
   >
   > Press `I` to insert text
   >
   > Type `MongoConnectionURI=<insert connection string here>`
   >
   > Press `esc`
   >
   > Type `:wq` to save and close the file

### Connect the simulation
With the server running, you should have a URL that allows you to connect to the server.
1. Open the Unity project in Unity
2. In [TelemetryManager.cs](https://github.com/AlexWills37/Dumpling-Manatee-Simulation/blob/main/Dumpling%20Manatee%20Simulation/Assets/Scripts/Telemetry/TelemetryManager.cs),
   change the first line of the TelemetryManager class (currently line 39) to contain the backend server's URL
   > `public static string url = "<insert server URL here>";`
3. Build the project to the headset
