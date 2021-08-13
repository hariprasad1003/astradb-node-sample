/*

Resources - https://docs.datastax.com/en/dse/6.8/cql/cql/cql_reference/cqlsh_commands/cqlshCommandsTOC.html

mkdir <folder_name>

cd <folder_name>

npm init

npm install cassandra-driver

Download Secure Connect Bundle, enter the path in .env

Go to Settings -> Tokens -> / Organizations -> Token Management Give Role and Generate Token

Create Table using cqlsh in CQL

CREATE TABLE SampleKeyspace.SampleTable ( id UUID PRIMARY KEY, name text, prog_lang text );

Error - 

InvalidRequest: Error from server: code=2200 [Invalid query] message="Unknown keyspace samplekeyspace"

Solution - 

CREATE TABLE "SampleKeyspace".SampleTable ( id UUID PRIMARY KEY, name text, prog_lang text );

Error - 

node index.js

(node:378962) UnhandledPromiseRejectionWarning: Error: ENOENT: no such file or directory, open 'undefined'
(Use `node --trace-warnings ...` to show where the warning was created)
(node:378962) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:378962) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.

Solution - 

node --trace-warnings index.js
node --trace-warnings --unhandled-rejections=strict index.js

process.env is not worked, use dotenv to retrieve data from .env

npm install dotenv --save

describe keyspaces;

Error - 

describe SampleKeyspace;

'samplekeyspace' not found in keyspaces

Solution - 

describe "SampleKeyspace";

CREATE TABLE samplekeyspace.sampletable ( id UUID PRIMARY KEY, name text, prog_lang text );

Error - 

(node:27694) UnhandledPromiseRejectionWarning: NoHostAvailableError: All host(s) tried for query failed. First host tried, ac66d54f-7178-46ea-96d4-7ca14ed85b1b: AuthenticationError: We recently improved your database security. To find out more and reconnect, see https://docs.datastax.com/en/astra/docs/manage-application-tokens.html
    at authResponseCallback (/home/hp/Desktop/Subtop/experimental-space/astradb/node_modules/cassandra-driver/lib/connection.js:426:29)
    at /home/hp/Desktop/Subtop/experimental-space/astradb/node_modules/cassandra-driver/lib/connection.js:532:7
    at OperationState._swapCallbackAndInvoke (/home/hp/Desktop/Subtop/experimental-space/astradb/node_modules/cassandra-driver/lib/operation-state.js:160:5)
    at OperationState.setResult (/home/hp/Desktop/Subtop/experimental-space/astradb/node_modules/cassandra-driver/lib/operation-state.js:154:10)
    at Connection.handleResult (/home/hp/Desktop/Subtop/experimental-space/astradb/node_modules/cassandra-driver/lib/connection.js:693:15)
    at ResultEmitter.emit (events.js:400:28)
    at ResultEmitter.each (/home/hp/Desktop/Subtop/experimental-space/astradb/node_modules/cassandra-driver/lib/streams.js:537:17)
    at ResultEmitter._write (/home/hp/Desktop/Subtop/experimental-space/astradb/node_modules/cassandra-driver/lib/streams.js:521:10)
    at writeOrBuffer (internal/streams/writable.js:358:12)
    at ResultEmitter.Writable.write (internal/streams/writable.js:303:10) {
  info: 'Represents an authentication error from the driver or from a Cassandra node.',
  additionalInfo: [ResponseError]
}. See innerErrors.
    at ControlConnection._borrowFirstConnection (/home/hp/Desktop/Subtop/experimental-space/astradb/node_modules/cassandra-driver/lib/control-connection.js:301:15)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async ControlConnection._initializeConnection (/home/hp/Desktop/Subtop/experimental-space/astradb/node_modules/cassandra-driver/lib/control-connection.js:520:7)
    at async ControlConnection.init (/home/hp/Desktop/Subtop/experimental-space/astradb/node_modules/cassandra-driver/lib/control-connection.js:206:5)
    at async Client._connect (/home/hp/Desktop/Subtop/experimental-space/astradb/node_modules/cassandra-driver/lib/client.js:513:5)
    at async run (/home/hp/Desktop/Subtop/experimental-space/astradb/index.js:95:5)
(Use `node --trace-warnings ...` to show where the warning was created)
(node:27694) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:27694) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.


Solution - 

Check Crendentials or Generate new token and Change Crendentials

*/

const { Client } = require("cassandra-driver");

const environment = require('dotenv').config()

if (environment.error) {

    throw environment.error
  
}
  
// console.log(environment.parsed)

var SECURE_CONNECT_BUNDLE = String(process.env.SECURE_CONNECT_BUNDLE)
var CLIENT_ID             = String(process.env.CLIENT_ID)
var CLIEND_SECRET         = String(process.env.CLIEND_SECRET)
var TOKEN                 = String(process.env.TOKEN)
var KEYSPACE              = String(process.env.KEYSPACE)
var TABLE                 = String(process.env.TABLE)

// console.log(SECURE_CONNECT_BUNDLE, CLIENT_ID, CLIEND_SECRET, TOKEN)

async function run() {
    const client = new Client({
      cloud: {
        secureConnectBundle: SECURE_CONNECT_BUNDLE,
      },
      credentials: {
        username: CLIENT_ID,
        password: CLIEND_SECRET,
      },
    });
  
    await client.connect();

    const rs = await client
	.execute(`SELECT * FROM ${KEYSPACE}.${TABLE}`)
	.then(function(result){
        
    	console.log(result)

		client.shutdown()
      
    })
  	.catch(function(error){
      
      	console.log(error.message)
      
      	client.shutdown()

  	});
  }
  
  // Run the async function
  run();