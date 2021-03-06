var https = require('https');
var querystring = require('querystring');
var tv4 = require('tv4');
var program = require('commander');
var host = "";
var query = {};
var tst_id = -1;
var errors = []
var failed=0;
var total=0;
errors.push("----------------------------------------------------");

function makeApiReq(test_id,data,host){
	var put_data = JSON.stringify(data);
	var put_path = "/x/api/v2/tests/" + test_id + "/candidates/set_ats_state";
	console.log(put_path);
	console.log(put_data);
	var headers = {"Content-Type": "application/json"};
	var options = {
		host: host,
		path: put_path,
		method: 'PUT',
		headers: headers,
	}
	var req = https.request(options,function(res){
		var response = "";
		res.on('data',function(data){
			response += data;
		});
		res.on('end',function(data){
			console.log(response);
			console.log(res.statusCode);
			if(res.statusCode==200){
				var jresp = JSON.parse(response);
				total++;
				checkSchema(jresp);
			}
			else{
				errors.push("FAIL-STATUS CODE returned:"+res.statusCode);
				errors.push("----------------------------------------------------");
				failed++;
				total++;
				finalResult();
			}
		});
	});
	req.write(put_data);
	req.end();
}

function getSchema(){
	var schema = 
	{
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/set_ats_state",
	  "type": "object",
	  "properties": {
	    "data": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/set_ats_state/data",
	      "type": "object",
	      "properties": {}
	    },
	    "status": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/set_ats_state/status",
	      "type": "boolean"
	    },
	    "message": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/set_ats_state/message",
	      "type": "string"
	    },
	    "http_status": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/set_ats_state/http_status",
	      "type": "integer"
	    }
	  },
	  "required": [
	    "data",
	    "status",
	    "message",
	    "http_status"
	  ]
	};
	return schema;
}

function checkSchema(response){
	var schema = getSchema();
	var result = tv4.validateResult(response,schema);
	if(result.valid==false){
		errors.push("FAIL-Schema");
		errors.push(result.error);
		errors.push("----------------------------------------------------");
		failed++;
		total++;	
	}
	else{
		total++;
	}
	finalResult();
	console.log(result);	
}

function finalResult(){
	var l=errors.length;
	for(var i=0;i<l;i++){
		console.log(errors[i]);
	}
	console.log("FAILED:"+failed+",TOTAL:"+total);
}

function startTesting(){
	makeApiReq(test_id,query,host);
}

program
	.version('0.0.1')
	.option('-a,--access_token [value]','*Access Token-Required')
	.option('-t,--testid <n>','*Test id-Required',parseInt)
	.option('-u,--username [value]','*Username/email-Required')
	.option('-s,--ats_state <n>','*ATS State (http://hr.gs/ats_states)-Required',parseInt)
	.option('-x,--host [value]','Hostname')
	.parse(process.argv)


if(program.testid)
	test_id = program.testid;
else
{
	console.log('Test id requried');
	process.exit(1);
}

if(program.username)
	query['username'] = program.username;
else
{
	console.log('Username requried');
	process.exit(1);
}

if(program.access_token)
	query['access_token']= program.access_token;
else
{
	console.log('Access token required');
	process.exit(1);
}


if(program.ats_state)
	query['ats_state'] = program.ats_state;
else
{
	console.log('Ats_state requried');
	process.exit(1);
}

if(program.host)
	host = program.host
else
	host = "www.hackerrank.com"

startTesting();