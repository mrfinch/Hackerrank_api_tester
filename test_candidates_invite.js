var https = require('https');
var querystring = require('querystring');
var tv4 = require('tv4');
var program = require('commander');
var host = "";
var query = {};
var test_id = -1;
var errors = []
var failed=0;
var total=0;
errors.push("----------------------------------------------------");

function makeApiReq(test_id,data,host){
	var post_data = JSON.stringify(data);
	var post_path = "/x/api/v2/tests/" + test_id + "/candidates";
	var headers = {};
	var options = {
		host: host,
		path: post_path, 
		method: 'POST',
		headers: headers
	};
	console.log(post_data);
	console.log(post_path);
	var req = https.request(options,function(res){
		var response = "";
		res.on('data',function(data){
			response += data;
		});
		console.log("Status:"+res.statusCode);
		res.on('end',function(data){
			console.log(response);
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
	req.write(post_data);
	req.end();
}

function getSchema(){
	var schema = 
	{
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates",
	  "type": "object",
	  "properties": {
	    "data": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/data",
	      "type": "object",
	      "properties": {
	        "username": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/data/username",
	          "type": "string"
	        },
	        "password": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/data/password",
	          "type": "string"
	        },
	        "test_link": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/data/test_link",
	          "type": "string"
	        },
	        "status": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/data/status",
	          "type": "boolean"
	        },
	        "error": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/data/error",
	          "type": ["null","integer"]
	        }
	      },
	      "required": [
	        "username",
	        "password",
	        "test_link",
	        "status",
	        "error"
	      ]
	    },
	    "status": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/status",
	      "type": "boolean"
	    },
	    "message": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/message",
	      "type": "string"
	    },
	    "http_status": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/http_status",
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
	.option('-s,--subject [value]','Subject')
	.option('-m,--message [value]','Message')
	.option('-e,--evaluator_email [value]','Evaluator email')
	.option('-f,--test_finish_url [value]','Candidate will be redirected to this URL when the test gets over. By default, they are sent to the feedback page.')
	.option('-r,--test_result_url [value]','Webhook URL for candidate report. When the report is processed the report data will be sent to this URL as a webhook. By default, the inviter will get the report by email')
	.option('-s,--send_email [value]','Flag to send the invite email to the candidate. Can be true/false.Default-false')
	.option('-g,--tags [value]','Comma separated list of candidate tags')
	.option('-c,--force [value]','Flag which forces sending an email even when the candidate has already been invited. Can be true/false,Default-false')
	.option('-h,--hide_login_credentials [value]','Flag to hide candidate details in the test URL. Can be true/false.Default-True')
	.option('-x,--host [value]','Hostname')
	.parse(process.argv)

if(program.access_token)
	query['access_token']= program.access_token;
else
{
	console.log('Access token required');
	process.exit(1);
}

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

if(program.subject)
	query['subject'] = program.subject;

if(program.message)
	query['message'] = program.message;

if(program.evaluator_email)
	query['evaluator_email'] = program.evaluator_email

if(program.test_finish_url)
	query['test_finish_url'] = program.test_finish_url

if(program.test_result_url)
	query['test_result_url'] = program.test_result_url

if(program.send_email)
	query['send_email'] = program.send_email
else
	query['send_email'] = "false";

if(program.tags)
	query['tags'] = program.tags

if(program.force)
	query['force'] = program.force
else
	query['force'] = "false";

if(program.hide_login_credentials)
	query['hide_login_credentials'] = program.hide_login_credentials
else
	query['hide_login_credentials'] = "true";

if(program.host)
	host = program.host
else
	host = "www.hackerrank.com"

startTesting();