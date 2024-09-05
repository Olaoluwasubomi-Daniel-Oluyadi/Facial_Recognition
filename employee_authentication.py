import boto3
import json

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition', region_name = "ca-central-1")
dynamodbTableName = 'employee'
dynamodb = boto3.resource('dynamodb', region_name='ca-central-1')
employeeTable = dynamodb.Table(dynamodbTableName)
bucketName = 'subomi-vistor-images'


def buildResponse(statusCode, body=None):
    response = {'statusCode':statusCode,
                'handlers':{
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                }
    }
    if body is not None:
        response['body'] = json.dumps(body)
    return response


def lambda_handler(event,context):
    print(event)
    objectKey = event['queryStringParameters']['objectKey']
    image_bytes = s3.get_object(Bucket=bucketName, Key=objectKey)['Body'].read()
    response = rekognition.search_faces_by_image(
        CollectionId = 'employee',
        Image = {'Bytes':image_bytes}
    )
    for match in response['FaceMatches']:
        print(match['Face']['FaceId'],match['Face']['Confidence'])

        face = employeeTable.get_item(
            Key = {
                'rekognitionId':match['Face']['FaceId']

            }
        )
        if 'Item' in face:
            print('Person Found: ', face['Item'])
            return buildResponse(200,{
                'Message':'Success',
                'firstName':face['Item']['FirstName'],
                'lastName':face['Item']['LastName']
            })
        print('Person could not be recognized.')
        return buildResponse(403,{'Message': 'Person Not Found'})
                                 
                                 
                                 
        





    