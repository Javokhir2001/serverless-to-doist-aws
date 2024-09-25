import json
import boto3
from boto3.dynamodb.conditions import Key
import os

def get_user_id(event):
    return event['requestContext']['authorizer']['claims']['sub']

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('ToDoTable')
    user_id = get_user_id(event)

    http_method = event['httpMethod']
    path = event['path']
    response = {
        'headers': {
            'Content-Type': 'application/json'
        }
    }

    try:
        if http_method == 'GET' and path == '/todos':
            # Get all to-do items for the user
            result = table.query(
                KeyConditionExpression=Key('UserID').eq(user_id)
            )
            response['statusCode'] = 200
            response['body'] = json.dumps(result['Items'])

        elif http_method == 'POST' and path == '/todos':
            # Create a new to-do item
            data = json.loads(event['body'])
            todo_id = str(int(boto3.client('sts').get_caller_identity()['Account']) + int(context.aws_request_id, 16))
            item = {
                'UserID': user_id,
                'ToDoID': todo_id,
                'Title': data.get('Title'),
                'Completed': False
            }
            table.put_item(Item=item)
            response['statusCode'] = 201
            response['body'] = json.dumps(item)

        elif http_method == 'PUT' and path.startswith('/todos/'):
            # Update an existing to-do item
            todo_id = event['pathParameters']['id']
            data = json.loads(event['body'])
            table.update_item(
                Key={
                    'UserID': user_id,
                    'ToDoID': todo_id
                },
                UpdateExpression='SET #title = :title, Completed = :completed',
                ExpressionAttributeNames={
                    '#title': 'Title'
                },
                ExpressionAttributeValues={
                    ':title': data.get('Title'),
                    ':completed': data.get('Completed')
                },
                ReturnValues='UPDATED_NEW'
            )
            response['statusCode'] = 200
            response['body'] = json.dumps({'message': 'Item updated'})

        elif http_method == 'DELETE' and path.startswith('/todos/'):
            # Delete a to-do item
            todo_id = event['pathParameters']['id']
            table.delete_item(
                Key={
                    'UserID': user_id,
                    'ToDoID': todo_id
                }
            )
            response['statusCode'] = 200
            response['body'] = json.dumps({'message': 'Item deleted'})

        else:
            response['statusCode'] = 404
            response['body'] = json.dumps({'error': 'Not found'})

    except Exception as e:
        response['statusCode'] = 500
        response['body'] = json.dumps({'error': str(e)})

    return response
