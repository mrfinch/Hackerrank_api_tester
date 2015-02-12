var https = require('https');
var querystring = require('querystring');
var tv4 = require('tv4');
var program = require('commander');
var host = "www.hackerrank.com";
var test_id = -1;
var query = {};
var errors = [];
var total = 0;
var failed = 0;
errors.push("----------------------------------------------------");

function makeApiReq(test_id,data,callhelper){
	console.log('************************************************');
	console.log("New Request");
	console.log(data);
	console.log('Test id:'+test_id);
	var endpoint = "/x/api/v2/tests/" + test_id + "/candidates/view/?" + querystring.stringify(data);
	console.log(endpoint);
	var headers = {};
	var options = {
		host: host,
		path: endpoint,
		method: "GET",
		headers: headers 
	}	

	var req = https.request(options,function(res){
		var response = "";
		res.on('data',function(data){
			response += data;
		});
		res.on('end',function(){
			console.log('Status:'+res.statusCode);
			console.log(response);
			if(res.statusCode == 200){
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
	req.end();	
}

function getSchema(){
	var schema = 
	{
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}",
	  "type": "object",
	  "properties": {
	    "data": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data",
	      "type": "object",
	      "properties": {
	        "id": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/id",
	          "type": "integer"
	        },
	        "email": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/email",
	          "type": "string"
	        },
	        "tid": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/tid",
	          "type": "integer"
	        },
	        "score": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/score",
	          "type": "integer"
	        },
	        "starttime": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/starttime",
	          "type": "string"
	        },
	        "endtime": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/endtime",
	          "type": "string"
	        },
	        "status": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/status",
	          "type": "integer"
	        },
	        "ats_state": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/ats_state",
	          "type": "integer"
	        },
	        "report_url": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/report_url",
	          "type": "string"
	        },
	        "pdf_url": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/pdf_url",
	          "type": "string"
	        },
	        "questions_array": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions_array",
	          "type": "array",
	          "items": {
	            "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions_array/2",
	            "type": "string"
	          },
	          "additionalItems": false
	        },
	        "ip_address": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/ip_address",
	          "type": "string"
	        },
	        "scores_questions_split": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/scores_questions_split",
	          "type": "object",
	          "properties": {
	            "project": {
	              "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/scores_questions_split/project",
	              "type": "integer"
	            },
	            "design": {
	              "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/scores_questions_split/design",
	              "type": "integer"
	            }
	          }
	        },
	        "added_time_buffer": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/added_time_buffer",
	          "type": "integer"
	        },
	        "timeline": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/timeline",
	          "type": "array",
	          "items": {
	            "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/timeline/50",
	            "type": "object",
	            "properties": {
	              "inserttime": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/timeline/50/inserttime",
	                "type": "integer"
	              },
	              "qno": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/timeline/50/qno",
	                "type": ["null","integer"]
	              },
	              "message": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/timeline/50/message",
	                "type": "string"
	              },
	              "id": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/timeline/50/id",
	                "type": "string"
	              }
	            }
	          },
	          "additionalItems": false
	        },
	        "max_score": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/max_score",
	          "type": "integer"
	        },
	        "candidate_details": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/candidate_details",
	          "type": "array",
	          "items": {},
	          "additionalItems": false
	        },
	        "invited": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/invited",
	          "type": "boolean"
	        },
	        "invite_details": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/invite_details",
	          "type": "object",
	          "properties": {}
	        },
	        "questions": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions",
	          "type": "array",
	          "items": {
	            "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2",
	            "type": "object",
	            "properties": {
	              "id": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/id",
	                "type": "integer"
	              },
	              "hash": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/hash",
	                "type": ["null","string"]
	              },
	              "unique_id": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/unique_id",
	                "type": "string"
	              },
	              "question": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/question",
	                "type": "string"
	              },
	              "type": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/type",
	                "type": "string"
	              },
	              "company_id": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/company_id",
	                "type": "integer"
	              },
	              "company_share": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/company_share",
	                "type": "integer"
	              },
	              "owner": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/owner",
	                "type": "integer"
	              },
	              "level": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/level",
	                "type": "string"
	              },
	              "created_at": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/created_at",
	                "type": "string"
	              },
	              "preview": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/preview",
	                "type": "string"
	              },
	              "text": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/text",
	                "type": "string"
	              },
	              "time_taken": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/time_taken",
	                "type": "integer"
	              },
	              "tags": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/tags",
	                "type": "array",
	                "items": {},
	                "additionalItems": false
	              },
	              "answered": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/answered",
	                "type": "boolean"
	              },
	              "score": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/score",
	                "type": "integer"
	              },
	              "status": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/status",
	                "type": "string"
	              },
	              "points": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/points",
	                "type": "integer"
	              },
	              "name": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/name",
	                "type": "string"
	              },
	              "submissions": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions",
	                "type": "array",
	                "items": {
	                  "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0",
	                  "type": "object",
	                  "properties": {
	                    "id": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/id",
	                      "type": "integer"
	                    },
	                    "aid": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/aid",
	                      "type": "integer"
	                    },
	                    "qid": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/qid",
	                      "type": "integer"
	                    },
	                    "answer": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/answer",
	                      "type": "string"
	                    },
	                    "score": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/score",
	                      "type": "integer"
	                    },
	                    "bonusscore": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/bonusscore",
	                      "type": "integer"
	                    },
	                    "processed": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/processed",
	                      "type": "boolean"
	                    },
	                    "inserttime": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/inserttime",
	                      "type": "string"
	                    },
	                    "metadata": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/metadata",
	                      "type": "string"
	                    },
	                    "frames": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/frames",
	                      "type": "string"
	                    },
	                    "status": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/status",
	                      "type": "integer"
	                    },
	                    "lang": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/submissions/0/lang",
	                      "type": "string"
	                    }
	                  }
	                },
	                "additionalItems": false
	              },
	              "multiple_files": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/multiple_files",
	                "type": "string"
	              },
	              "file_tree": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/file_tree",
	                "type": "array",
	                "items": {
	                  "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/file_tree/28",
	                  "type": "object",
	                  "properties": {
	                    "id": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/file_tree/28/id",
	                      "type": "string"
	                    },
	                    "text": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/file_tree/28/text",
	                      "type": "string"
	                    },
	                    "parent": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/file_tree/28/parent",
	                      "type": "string"
	                    },
	                    "permission": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/file_tree/28/permission",
	                      "type": "integer"
	                    },
	                    "type": {
	                      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/file_tree/28/type",
	                      "type": "string"
	                    }
	                  }
	                },
	                "additionalItems": false
	              },
	              "comments": {
	                "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/questions/2/comments",
	                "type": "array",
	                "items": {},
	                "additionalItems": false
	              }
	            }
	          },
	          "additionalItems": false
	        },
	        "scores_tags_split": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/scores_tags_split",
	          "type": "object",
	          "properties": {}
	        },
	        "plagiarism_details": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/plagiarism_details",
	          "type": "object",
	          "properties": {}
	        },
	        "plagiarism": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/plagiarism",
	          "type": "boolean"
	        },
	        "feedback": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/feedback",
	          "type": "string"
	        },
	        "rating": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/rating",
	          "type": "string"
	        },
	        "total_time_taken": {
	          "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/data/total_time_taken",
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
	        "scores_questions_split",
	        "added_time_buffer",
	        "timeline",
	        "max_score",
	        "candidate_details",
	        "invited",
	        "invite_details",
	        "questions",
	        "scores_tags_split",
	        "plagiarism_details",
	        "plagiarism",
	        "feedback",
	        "rating",
	        "total_time_taken"
	      ]
	    },
	    "status": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/status",
	      "type": "boolean"
	    },
	    "message": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/message",
	      "type": "string"
	    },
	    "http_status": {
	      "id": "https://www.hackerrank.com/x/api/v2/tests/{id}/candidates/{cid}/http_status",
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
	//console.log(result);
	if(result.valid == false){
		//console.log(tv4.error);
		errors.push("FAIL-Schema");
		errors.push(baseResult.error);
		errors.push("----------------------------------------------------");
		failed++;
		total++;
	}
	else{
		total++;
	}
	finalResult();
}

function finalResult(){
	var l=errors.length;
	for(var i=0;i<l;i++){
		console.log(errors[i]);
	}
	console.log("FAILED:"+failed+",TOTAL:"+total);
}

function startTesting(){
	makeApiReq(test_id,query,0);
}

program
	.version('0.0.1')
	.option('-a,--access_token [value]','Access Token')
	.option('-t,--testid <n>','Test id',parseInt)
	.option('-e,--email [value]','Name or email')
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

if(program.email)
	query['username'] = program.email;
else
{
	console.log('Username or email requried');
	process.exit(1);	
}

startTesting();
