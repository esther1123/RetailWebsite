import * as AWS from 'aws-sdk';
import { RETAIL_TABLE_NAME } from './index';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.NEXT_PUBLIC_REGION
});

export default async function handler(req, res) {
  const { productId } = req.query;
  const getParams = {
    TableName: RETAIL_TABLE_NAME,
    IndexName: 'id-index',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': productId
    }
  };

  const results = await dynamoDb.query(getParams).promise();

  res.status(200).json(results);
}