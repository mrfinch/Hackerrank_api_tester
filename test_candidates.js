var https = require('https');
var querystring = require('querystring');
var tv4 = require('tv4');
var program = require('commander');
var _ = require('lodash');
var host = "";
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

function makeApiReq(test_id,data,callhelper,host){
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
				checkSchema(jresp,query['limit'],jresp.total,strt,callhelper);
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

function getData(num){
	if(num==0){
		var d = 
		{
	    "data": [
	        {
	            "id": 939697,
	            "email": "shravanashok@gmail.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2014-09-15T12:29:41Z",
	            "endtime": "2014-09-15T13:28:34Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/939697/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=939697&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139322",
	                "139323",
	                "139324"
	            ],
	            "ip_address": "111.93.139.74",
	            "scores_tags_split": [],
	            "scores_questions_split": {
	                "project": 0,
	                "design": 0
	            },
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139322",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139323",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "3533 seconds"
	        },
	        {
	            "id": 952299,
	            "email": "a@b.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2014-09-25T06:05:21Z",
	            "endtime": "2014-09-25T06:12:51Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/952299/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=952299&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139322",
	                "139323",
	                "139324"
	            ],
	            "ip_address": "125.17.1.38",
	            "scores_tags_split": [],
	            "scores_questions_split": {
	                "project": 0,
	                "design": 0
	            },
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139322",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139323",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "450 seconds"
	        },
	        {
	            "id": 957540,
	            "email": "a1@b.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2014-09-30T10:06:24Z",
	            "endtime": "2014-09-30T10:21:27Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/957540/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=957540&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139322",
	                "139323",
	                "139324"
	            ],
	            "ip_address": "115.249.242.252",
	            "scores_tags_split": [],
	            "scores_questions_split": {
	                "project": 0,
	                "design": 0
	            },
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139322",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139323",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "903 seconds"
	        },
	        {
	            "id": 969208,
	            "email": "shravanashok1@gmail.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2014-10-10T06:14:43Z",
	            "endtime": "2014-10-10T06:58:14Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/969208/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=969208&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139322",
	                "139323",
	                "139324"
	            ],
	            "ip_address": "122.167.84.231",
	            "scores_tags_split": [],
	            "scores_questions_split": {
	                "project": 0,
	                "design": 0
	            },
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139322",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139323",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "2611 seconds"
	        },
	        {
	            "id": 977189,
	            "email": "shravan+1@hackerrank.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2014-10-17T08:48:56Z",
	            "endtime": "2014-10-17T08:51:22Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/977189/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=977189&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139322",
	                "139323",
	                "139324"
	            ],
	            "ip_address": "111.93.139.74",
	            "scores_tags_split": {},
	            "scores_questions_split": {},
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139322",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139323",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "146 seconds"
	        },
	        {
	            "id": 1004924,
	            "email": "shravanashok+1@gmail.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2014-11-07T04:36:40Z",
	            "endtime": "2014-11-07T04:44:46Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/1004924/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=1004924&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139322",
	                "139323",
	                "139324"
	            ],
	            "ip_address": "106.216.148.175",
	            "scores_tags_split": {},
	            "scores_questions_split": {},
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139322",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139323",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "486 seconds"
	        },
	        {
	            "id": 1005383,
	            "email": "shravan@interviewstreet.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2014-11-07T09:39:02Z",
	            "endtime": "2014-11-07T10:38:53Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/1005383/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=1005383&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139322",
	                "139323",
	                "139324"
	            ],
	            "ip_address": "122.178.242.242",
	            "scores_tags_split": {},
	            "scores_questions_split": {},
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139322",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139323",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                },
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "3591 seconds"
	        },
	        {
	            "id": 1013065,
	            "email": "shravanashok+2@gmail.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2014-11-11T11:19:28Z",
	            "endtime": "2014-11-11T12:17:39Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/1013065/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=1013065&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139324"
	            ],
	            "ip_address": "111.93.139.74",
	            "scores_tags_split": {},
	            "scores_questions_split": {},
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "3491 seconds"
	        },
	        {
	            "id": 1015920,
	            "email": "sruthi@hackerrank.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2014-11-13T10:19:28Z",
	            "endtime": "2014-11-13T10:33:13Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/1015920/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=1015920&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139324"
	            ],
	            "ip_address": "117.249.165.166",
	            "scores_tags_split": {},
	            "scores_questions_split": {},
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "825 seconds"
	        },
	        {
	            "id": 1050453,
	            "email": "test@hackerrank.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2014-12-05T08:02:55Z",
	            "endtime": "2014-12-05T08:02:59Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/1050453/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=1050453&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139324"
	            ],
	            "ip_address": "123.63.241.66",
	            "scores_tags_split": {},
	            "scores_questions_split": {},
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "4 seconds"
	        },
	        {
	            "id": 1098407,
	            "email": "shrava@hr.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2015-01-21T07:00:53Z",
	            "endtime": "2015-01-21T07:01:30Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/1098407/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=1098407&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139324"
	            ],
	            "ip_address": "111.93.139.74",
	            "scores_tags_split": {},
	            "scores_questions_split": {},
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "37 seconds"
	        },
	        {
	            "id": 1098470,
	            "email": "spathak@altimetrik.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2015-01-21T07:46:19Z",
	            "endtime": "2015-01-21T07:46:29Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/1098470/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=1098470&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139324"
	            ],
	            "ip_address": "223.227.26.105",
	            "scores_tags_split": {},
	            "scores_questions_split": {},
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "10 seconds"
	        },
	        {
	            "id": 1100626,
	            "email": "shravanashok@hackerrank.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2015-01-22T09:46:51Z",
	            "endtime": "2015-01-22T10:19:24Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/1100626/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=1100626&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139324"
	            ],
	            "ip_address": "182.74.246.98",
	            "scores_tags_split": {},
	            "scores_questions_split": {},
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "1953 seconds"
	        },
	        {
	            "id": 1124485,
	            "email": "shravan-ashok@hackerrank.com",
	            "tid": 31972,
	            "score": 0,
	            "starttime": "2015-02-05T11:38:19Z",
	            "endtime": "2015-02-05T11:50:45Z",
	            "status": 7,
	            "ats_state": 1,
	            "report_url": "https://www.hackerrank.com/x/tests/31972/candidates/1124485/report/?authkey=8695cb659f16c094ba035902f21dad4c",
	            "pdf_url": "https://www.hackerrank.com/x/api/v1/tests/31972/pdf?aids[]=1124485&cmd=download&usecache=true&authkey=8695cb659f16c094ba035902f21dad4c",
	            "questions_array": [
	                "139324"
	            ],
	            "ip_address": "182.74.184.138",
	            "scores_tags_split": {},
	            "scores_questions_split": {},
	            "added_time_buffer": 0,
	            "candidate_details": [],
	            "invited": false,
	            "invite_details": {},
	            "questions": [
	                {
	                    "qid": "139324",
	                    "answered": false,
	                    "score": 0,
	                    "answer": ""
	                }
	            ],
	            "plagiarism_details": {},
	            "plagiarism": false,
	            "feedback": "",
	            "rating": "Zero",
	            "total_time_taken": "746 seconds"
	        }
	    ],
	    "status": true,
	    "message": "Success",
	    "total": 14,
	    "http_status": 200,
	    "length": 14
		};
		return d;
	}
	return "";
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

function checkSchema(response,exp_num,total_num,strt,callhelper){
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
	if(callhelper==1){
		compareData(response); 
	}
	//helperTesting(response);
}

function compareData(data){
	var base = getData(0);
	var result = _.isEqual(data,base);
	if(!result){
		console.log("FAILED-Data comparison");
	}
	else{
		console.log("PASSED-Data Comparison");
	}
}

function startTesting(){
	makeApiReq(test_id,query,0,host);
}

function helperTesting(resp,callhelper){
	//console.log(resp);
	query['limit'] = resp.total;
	query['start'] = 0;
	if(callhelper==1)
		makeApiReq(test_id,query,callhelper,host);
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
	console.log("TOTAL-FAILED:"+failed_sum+",TOTAL-TESTS:"+total_sum);
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
	.option('-n,--startnum <n>','Start',parseInt)
	.option('-s,--starttime [value]','Starttime')
	.option('-e,--endtime [value]','Endtime')
	.option('-x,--host [value]','Hostname')
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

if(program.host)
	host = program.host
else
	host = "www.hackerrank.com"
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
