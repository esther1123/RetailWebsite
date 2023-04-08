import * as AWS from 'aws-sdk';

export const RETAIL_TABLE_NAME = 'RetailItems';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.NEXT_PUBLIC_REGION
});

export default async function handler(req, res) {
  const { ids } = req.query;
  const expressionAttributeValues = {};
  const idParams = ids.split(',').map((id, idx) => {
    const idParam = `:id${idx}`;
    expressionAttributeValues[idParam] = id;
    return idParam;
  }).join(',');
  const getParams = {
    TableName: RETAIL_TABLE_NAME,
    IndexName: 'id-index',
    FilterExpression: `id IN (${idParams})`,
    ExpressionAttributeValues: expressionAttributeValues
  };

  const results = await dynamoDb.scan(getParams).promise();

  res.status(200).json(results);
}
