import { APIGatewayProxyEventV2 } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const personalize = new AWS.PersonalizeRuntime({ region: 'us-west-2' });

export const getRecommendationHandler = async (event: APIGatewayProxyEventV2) => {
  const recommendations = await personalize.getRecommendations({
    campaignArn: 'arn:aws:personalize:us-west-2:180271428986:campaign/retail-campaign',
    numResults: 16,
    userId: event.queryStringParameters?.userId
  }).promise();

  return recommendations;
};

export const getSimilarItemsHandler = async (event: APIGatewayProxyEventV2) => {
  const similarItems = await personalize.getRecommendations({
    campaignArn: 'arn:aws:personalize:us-west-2:180271428986:campaign/retail-similar-item-campagin',
    numResults: 4,
    itemId: event.queryStringParameters?.itemId
  }).promise();

  return similarItems;
};
