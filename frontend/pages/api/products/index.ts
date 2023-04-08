import * as AWS from 'aws-sdk';

export const RETAIL_TABLE_NAME = 'RetailItems';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.NEXT_PUBLIC_REGION
});

export default async function handler(req, res) {
  const { category } = req.query;

  const getParams = {
    TableName: RETAIL_TABLE_NAME,
    KeyConditionExpression: 'category = :category',
    ExpressionAttributeValues: {
      ':category': category
    },
    Limit: 40
  };
  const results = await dynamoDb.query(getParams).promise();

  res.status(200).json(results);
}
