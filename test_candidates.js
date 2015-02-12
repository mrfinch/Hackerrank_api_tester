var https = require('https');
var querystring = require('querystring');
var tv4 = require('tv4');
var program = require('commander');
var host = "www.hackerrank.com";
var query = {};
var test_id = -1;
var total = 0;
var failed = 0;
var total_sum = 0;
var failed_sum = 0;
var total_arr = [];
var failed_arr = [];
var errors = []
errors.push("----------------------------------------------------");
var notify = [];
var warn=0;

function makeApiReq(test_id,data,callhelper){
	console.log('************************************************');
	console.log("New Request");
	console.log(data);
	console.log('Test id:'+test_id);

	var endpoint = "/x/api/v2/tests/" + test_id + "/candidates/?" + querystring.stringify(data);
	//var endpoint = "/36234/candidates/?limit=1&access_token=ec33e7479826452ce0a28941be55bc9e44d9a68583a669e00b1403fd90914afd";
	console.log(endpoint);
	var headers = {};
	var options = {
		host: host,
		path: endpoint,
		method: "GET",
		headers: headers
	};

	var req = https.request(options,function(res){
		var response = "";
		res.on('data',function(data){
			response += data;
		});
		res.on('end',function(){
			console.log('Status:'+res.statusCode);
			if(res.statusCode == 200){
				var jresp = JSON.parse(response);
				var strt = query['start'] ? query['start'] : 0;
				total++;
				checkSchema(jresp,query['limit'],jresp.total,strt);
				helperTesting(jresp,callhelper+1);
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
	req.end();
}

function getBaseSchema(){
base_schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates",
	  "type": "object",
	  "properties": {
	    "data": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/data",
	      "type": "array",
	      "items": []
	    },
	    "status": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/status",
	      "type": "boolean"
	    },
	    "message": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/message",
	      "type": "string"
	    },
	    "total": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/total",
	      "type": "integer"
	    },
	    "http_status": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/http_status",
	      "type": "integer"
	    },
	    "length": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/length",
	      "type": "integer"
	    }
	  },
	  "required": [
	    "data",
	    "status",
	    "message",
	    "total",
	    "http_status",
	    "length"
	  ]
	}
return base_schema;

}

function getDataSchema(){
	var dataSchema =
	{
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates",
	  "type": "object",
	  "properties": {
	    "id": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/id",
	      "type": "integer"
	    },
	    "email": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/email",
	      "type": "string"
	    },
	    "tid": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/tid",
	      "type": "integer"
	    },
	    "score": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/score",
	      "type": "integer"
	    },
	    "starttime": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/starttime",
	      "type": "string"
	    },
	    "endtime": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/endtime",
	      "type": "string"
	    },
	    "status": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/status",
	      "type": "integer"
	    },
	    "ats_state": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/ats_state",
	      "type": "integer"
	    },
	    "report_url": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/report_url",
	      "type": "string"
	    },
	    "pdf_url": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/pdf_url",
	      "type": "string"
	    },
	    "questions_array": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/questions_array",
	      "type": "array",
	      "items": {
	        "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/questions_array/3",
	        "type": "string"
	      },
	      "additionalItems": false
	    },
	    "ip_address": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/ip_address",
	      "type": "string"
	    },
	    "scores_tags_split": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/scores_tags_split",
	      "type": ["array","object"],
	      "items": []
	    },
	    "scores_questions_split": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/scores_questions_split",
	      "type": "object",
	      "properties": {}
	    },
	    "added_time_buffer": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/added_time_buffer",
	      "type": "integer"
	    },
	    "candidate_details": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/candidate_details",
	      "type": "array",
	      "items": {
	        "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/candidate_details/2",
	        "type": "object",
	        "properties": {
	          "field_name": {
	            "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/candidate_details/2/field_name",
	            "type": "string"
	          },
	          "title": {
	            "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/candidate_details/2/title",
	            "type": "string"
	          },
	          "value": {
	            "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/candidate_details/2/value",
	            "type": "string"
	          }
	        }
	      },
	      "additionalItems": false
	    },
	    "invited": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/invited",
	      "type": "boolean"
	    },
	    "invite_details": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/invite_details",
	      "type": "object",
	      "properties": {}
	    },
	    "questions": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/questions",
	      "type": "array",
	      "items": {
	        "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/questions/3",
	        "type": "object",
	        "properties": {
	          "qid": {
	            "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/questions/3/qid",
	            "type": "string"
	          },
	          "answered": {
	            "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/questions/3/answered",
	            "type": "boolean"
	          },
	          "score": {
	            "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/questions/3/score",
	            "type": "integer"
	          },
	          "answer": {
	            "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/questions/3/answer",
	            "type": "string"
	          }
	        }
	      },
	      "additionalItems": false
	    },
	    "plagiarism_details": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/plagiarism_details",
	      "type": "object",
	      "properties": {}
	    },
	    "plagiarism": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/plagiarism",
	      "type": "boolean"
	    },
	    "feedback": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/feedback",
	      "type": "string"
	    },
	    "rating": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/rating",
	      "type": "string"
	    },
	    "total_time_taken": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/total_time_taken",
	      "type": "string"
	    }
	  },
	  "required": [
	    "id",
	    "email",
	    "tid",
	    "score",
	    "starttime",
	    "endtime",
	    "status",
	    "ats_state",
	    "report_url",
	    "pdf_url",
	    "questions_array",
	    "ip_address",
	    "scores_tags_split",
	    "scores_questions_split",
	    "added_time_buffer",
	    "candidate_details",
	    "invited",
	    "invite_details",
	    "questions",
	    "plagiarism_details",
	    "plagiarism",
	    "feedback",
	    "rating",
	    "total_time_taken"
	  ]
	}
	return dataSchema;
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

function checkSchema(response,exp_num,total_num,strt){
	var baseSchema = getBaseSchema();
	var baseResult = tv4.validateResult(response,baseSchema);
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
	var dataSchema = getDataSchema();
	var data = response.data;
	var count = 0;
	for(item in data){
		var dataResult = tv4.validateResult(data[item],dataSchema);
		if(dataResult.valid == false){
			//console.log(dataResult.error);
			errors.push("FAIL-DATA field");
			errors.push("ID:"+data[item].id);
			errors.push(dataResult.error);
			errors.push("----------------------------------------------------");
			failed++;
			total++;
		}
		else{
			total++;
		}
		count++;
		if(data[item].scores_tags_split.length>0){
			notify.push("ID:"+data[item].id + ".Scores tags split array schema not checked and is non empty for this id");
			warn++;
		}
		if(!isEmpty(data[item].scores_questions_split)){
			notify.push("ID:"+data[item].id + ".Scores questions split object schema not checked and is non empty for this id");
			warn++;
		}
		if(!isEmpty(data[item].invite_details)){
			notify.push("ID:"+data[item].id + ".Invite details object schema not checked and is non empty for this id")
			warn++;
		}
		if(!isEmpty(data[item].plagiarism_details)){
			notify.push("ID:"+data[item].id + ".Plagiarism details object schema not checked and is non empty for this id")
			warn++;
		}
	}
	if(exp_num==-1){
		if(count!=(total_num-strt)){
			errors.push("Output does not satisy the limit");
			errors.push("Expected:"+(total_num-strt)+",Found:"+count,",Total:"+total_num);
			errors.push("----------------------------------------------------");
			failed++;total++;
		}
		else{
			total++;
		}
	}
	else{
		if(count!=exp_num){
			if(strt+count!=total_num){
				errors.push("Output does not satisy the limit");
				errors.push("Expected:"+exp_num+",Found:"+count);
				errors.push("----------------------------------------------------");
				failed++;total++;
			}
			else{
				total++;
			}
		}
		else{
			total++;
		}
	}
	/*if(count != exp_num && count != -1){
		errors.push("Output does not satisy the limit");
		errors.push("Expected:"+exp_num+",Found:"+count);
		errors.push("----------------------------------------------------");
		failed++;total++;
	}
	else if(exp_num == -1 && count != (total_num-strt)){
		errors.push("Output does not satisy the limit");
		errors.push("Expected:"+exp_num+",Found:"+count,",Total:"+total_num);
		errors.push("----------------------------------------------------");
		failed++;total++;
	}
	else{
		total++;
	}*/
	finalResult();
	//helperTesting(response);
}

function startTesting(){
	makeApiReq(test_id,query,0);
}

function helperTesting(resp,callhelper){
	//console.log(resp);
	query['limit'] = resp.total;
	query['start'] = 0;
	if(callhelper==1)
		makeApiReq(test_id,query,1);
}

function finalResult(){
	console.log('-----------------------------------------------');
	var l=notify.length;
	for(var i=0;i<l;i++){
		console.log(notify[i]);
	}
	console.log('-----------------------------------------------');
	var l=errors.length;
	for(var i=0;i<l;i++){
		console.log(errors[i]);
	}
	console.log("FAILED:"+failed+",TOTAL:"+total+",WARNINGS:"+warn);
	total_arr.push(total);
	failed_arr.push(failed);
	total_sum += total;
	failed_sum += failed;
	console.log("TOTAL FAILED:"+failed_sum+",TOTAL TESTS:"+total_sum);
	console.log('************************************************'+'\n');
	total=0;failed=0;warn=0;
	empty = [];
	notify = [];
}

program
	.version('0.0.1')
	.option('-a,--access_token [value]','*Access Token-Required')
	.option('-t,--testid <n>','*Test id-Required',parseInt)
	.option('-l,--limit <n>','Limit',parseInt)
	.option('-s,--startnum <n>','Start',parseInt)
	.option('-st,--starttime [value]','Starttime')
	.option('-et,--endtime [value]','Endtime')
	.parse(process.argv)

/*
if(program.access_token)console.log('accesstoken: %j',program.access_token)
if(program.testid)console.log('Test id: %j',program.testid);
if(program.limit)console.log('limit: %j',program.limit);
if(program.startnum || program.startnum==0)console.log('start: %j',program.startnum);
*/
//var args = process.argv.slice(2);
//var prop = ['access_token','start','limit','starttime','endtime'];

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

if(program.limit)
	query['limit'] = program.limit
else
	query['limit'] = -1;
if(program.startnum || program.startnum==0)
	query['start'] = program.startnum
else
	query['start'] = 0;
if(program.starttime)
	query['starttime'] = program.starttime
if(program.endtime)
	query['endtime'] = program.endtime
/*args.forEach(function(val,index,array){
	if(index==0){
		test_id = val;
		return;
	}
	query[prop[index-1]] = val;
	console.log(index+' '+val);
});*/
//console.log(args.join(' '));
startTesting();
