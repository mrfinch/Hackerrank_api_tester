var https = require('https');
var querystring = require('querystring');
var tv4 = require('tv4');
var program = require('commander');
var _ = require('lodash');
var host = "www.hackerrank.com";
var query = {}
var errors = []
errors.push("----------------------------------------------------");
var failed=0,total=0;

function makeApiReq(testid,data){
	console.log(data);
	console.log('Test id:'+testid);
	var endpoint = '/x/api/v1/tests/' + testid + '/attempts?' + querystring.stringify(data);
	console.log(endpoint);
	var headers = {};
	var options = {
		host: host,
		path: endpoint,
		method: 'GET',
		headers: headers
	};
	var req = https.request(options,function(res){
		var response = "";
		res.on('data',function(data){
			response += data;
		});
		res.on('end',function(){
			console.log('Status:'+res.statusCode);
			//console.log(response);
			if(res.statusCode==200){
				var jresp = JSON.parse(response);
				total++;
				checkSchema(jresp);
			}
			else{
				failed++;total++;
			}
		});
	});
	req.end();	
}

function getSchema(){
	var schema = 
	{
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts",
	  "type": "object",
	  "properties": {
	    "models": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/models",
	      "type": "array",
	      "items": {
	        "id": "auto-generated-schema-537"
	      },
	      "additionalItems": false
	    },
	    "status": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/status",
	      "type": "boolean"
	    },
	    "message": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/message",
	      "type": "string"
	    },
	    "total": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/total",
	      "type": "integer"
	    },
	    "total_visible": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/total_visible",
	      "type": "integer"
	    },
	    "offset": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/offset",
	      "type": "integer"
	    },
	    "limit": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/limit",
	      "type": "integer"
	    },
	    "params": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/params",
	      "type": "object",
	      "properties": {
	        "access_token": {
	          "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/params/access_token",
	          "type": "string"
	        },
	        "state": {
	          "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/params/state",
	          "type": "string"
	        },
	        "ats": {
	          "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/params/ats",
	          "type": "string"
	        },
	        "action": {
	          "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/params/action",
	          "type": "string"
	        },
	        "controller": {
	          "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/params/controller",
	          "type": "string"
	        },
	        "test_id": {
	          "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/params/test_id",
	          "type": "string"
	        }
	      }
	    },
	    "all_ids": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/all_ids",
	      "type": "object",
	      "properties": {
	        "Average": {
	          "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/all_ids/Average",
	          "type": "array",
	          "items": {
	            "id": "auto-generated-schema-146",
	            "type": "integer"
	          }//,
	          //"additionalItems": false
	        }
	      }
	    }
	  },
	  "required": [
	    "models",
	    "status",
	    "message",
	    "total",
	    "total_visible",
	    "offset",
	    "limit",
	    "params",
	    "all_ids"
	  ]
	};
	return schema;
}

function getModelSchema(){
	var modelSchema =
	{
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts",
	  "type": "object",
	  "properties": {
	    "id": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/id",
	      "type": "integer"
	    },
	    "email": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/email",
	      "type": "string"
	    },
	    "score": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/score",
	      "type": "integer"
	    },
	    "endtime": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/endtime",
	      "type": "string"
	    },
	    "starttime": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/starttime",
	      "type": "string"
	    },
	    "status": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/status",
	      "type": "integer"
	    },
	    "ats_state": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/ats_state",
	      "type": "integer"
	    },
	    "full_name": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/full_name",
	      "type": ["null","string"]
	    },
	    "added_time_buffer": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/added_time_buffer",
	      "type": ["null","integer"]
	    },
	    "plagiarism": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/plagiarism",
	      "type": ["null","boolean"]
	    },
	    "anonymize": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/anonymize",
	      "type": "null"
	    },
	    "tags": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/tags",
	      "type": ["null","array"]
	    },
	    "time_left": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/time_left",
	      "type": "integer"
	    },
	    "rating": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/rating",
	      "type": "string"
	    },
	    "invited_by": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/invited_by",
	      "type": "string"
	    },
	    "tags_score": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/tags_score",
	      "type": "object",
	      "properties": {}
	    },
	    "question_types_score": {
	      "id": "https://www.hackerrank.com/x/api/v1/tests/{id}/attempts/question_types_score",
	      "type": "object",
	      "properties": {}
	    }
	  },
	  "required": [
	    "id",
	    "email",
	    "score",
	    "endtime",
	    "starttime",
	    "status",
	    "ats_state",
	    "full_name",
	    "added_time_buffer",
	    "plagiarism",
	    "anonymize",
	    "tags",
	    "time_left",
	    "rating",
	    "invited_by",
	    "tags_score",
	    "question_types_score"
	  ]
	}; 
	return modelSchema;
}

function checkSchema(response){
	var schema = getSchema();
	var baseResult = tv4.validateResult(response,schema);
	//console.log(response);
	//console.log(baseResult.error);
	if(baseResult.valid == false){
		//console.log(baseResult.error);
		errors.push("FAIL-Base Schema");
		errors.push(baseResult.error);
		errors.push("----------------------------------------------------");
		failed++;
		total++;
	}
	else{
		total++;
	}

	var models = response.models;
	var modelSchema = getModelSchema();
	for(item in models){
		//console.log(models[item]);
		var res = tv4.validateResult(models[item],modelSchema);
		//console.log(res.error);
		if(res.valid==false){
			errors.push("FAIL-MODEL field");
			errors.push("ID:"+models[item].id);
			errors.push(res.error);
			errors.push("----------------------------------------------------");
			failed++;
			total++;
		}
		else{
			total++;
		}
	}
	finalResult();
}

function finalResult(){
/*	console.log('-----------------------------------------------');
	var l=notify.length;
	for(var i=0;i<l;i++){
		console.log(notify[i]);
	}
	console.log('-----------------------------------------------');
*/	var l=errors.length;
	for(var i=0;i<l;i++){
		console.log(errors[i]);
	}
	console.log("FAILED:"+failed+",TOTAL:"+total/*+",WARNINGS:"+warn*/);
/*	total_arr.push(total);
	failed_arr.push(failed);
	total_sum += total;
	failed_sum += failed;
	console.log("TOTAL-FAILED:"+failed_sum+",TOTAL-TESTS:"+total_sum);
	console.log('************************************************'+'\n');
	total=0;failed=0;warn=0;
	empty = [];
	notify = [];*/
}


function startTesting(){
	makeApiReq(test_id,query);
}

program
	.version('0.0.1')
	.option('-a,--access_token [value]','*Access Token-Required')
	.option('-t,--testid <n>','*Test id-Required',parseInt)
	.option('-s,--state <n>','Limit',parseInt)
	.option('-ats,--ats <n>','Start',parseInt)
	.option('-q,--query [value]','Name/email')
	.option('-t,--tags [value]','Tags')
	.option('-sd,--start_date [value]','Start Date')
	.option('-ed,--end_date [value]','End date')
	.option('-is,--isortcol <n>','iSortCol_0',parseInt)
	.option('-ss,--ssortdir [value]','sSortDir_0')
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

if(program.state)
	query['state'] = program.state
else
	query['state'] = -1

if(program.ats)
	query['ats'] = program.ats
else
	query['ats'] = -1

if(program.query)
	query['q'] = program.query

if(program.tags)
	query['tags'] = program.tags

if(program.start_date)
	query['start_date'] = program.start_date

if(program.end_date)
	query['end_date'] = program.end_date

if(program.isortcol)
	query['iSortCol_0'] = program.isortcol

if(program.ssortdir)
	query['sSortDir_0'] = program.sSortDir_0

startTesting();