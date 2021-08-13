/*

CREATE TABLE samplekeyspace.sampletable ( id, name text, prog_lang text );

INSERT INTO  (id, name, prog_lang) VALUES (1, "Hari Prasad", "YAML");

DROP TABLE samplekeyspace.sampletable;

*/

const { Client } = require("cassandra-driver");
const fs = require('fs');

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

    // Table Creation
    const rs = await client
    .execute(`CREATE TABLE ${KEYSPACE}.${TABLE}  ( id int PRIMARY KEY, name text, prog_lang text )`)
    .then(function(result){
        
      	console.log(result)

		client.shutdown()
      
    })
  	.catch(function(error){
      
      	console.log(error.message)
      
      	client.shutdown()
		  
  	});

    // Insertion Creation
    const rs = await client
    .execute(`INSERT INTO ${KEYSPACE}.${TABLE} (id, name, prog_lang) VALUES (1, 'Hari Prasad', 'Python')`)
    .then(function(result){
        
      	console.log(result)

		client.shutdown()
      
    })
  	.catch(function(error){
      
      	console.log(error.message)
      
      	client.shutdown()
		  
  	});
    
    // Update
    const rs = await client
    .execute(`UPDATE ${KEYSPACE}.${TABLE} SET prog_lang='js' WHERE id=1`)
    .then(function(result){
        
      	console.log(result)

		client.shutdown()
      
    })
  	.catch(function(error){
      
      	console.log(error.message)
      
      	client.shutdown()
		  
  	});

    // Select
    const rs = await client.execute(`SELECT * FROM ${KEYSPACE}.${TABLE}`).then(function(result){
        
        result.rows.forEach(row => {
        
            console.log(row.id.toString(), row.name, row.prog_lang)
        
        })
        
        client.shutdown()
        
    })
    .catch(function(error){
        
        console.log(error.message)
        
        client.shutdown()
        
    });
    
  }
  
  // Run the async function
  run();