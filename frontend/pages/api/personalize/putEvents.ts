import * as AWS from 'aws-sdk';

const PERSONALIZE_EVENT_TRACKING_ID = 'e4f546d7-b8d2-448a-baf5-2c374d789ab0';

const personalizeevents = new AWS.PersonalizeEvents({
  region: process.env.NEXT_PUBLIC_REGION
});

export default async function handler(req, res) {
  const { eventType, itemId, userId } = req.query;

  const eventList = eventType === 'view' ?
    [
      {
        eventType: 'ProductViewed',
        sentAt: new Date(),
        itemId,
        properties: { "discount":"No" }
      }
    ] : [
      {
        eventType: 'ProductAdded',
        sentAt: new Date(),
        itemId,
        properties: { "discount":"No" }
      },
      {
        eventType: 'CheckoutStarted',
        sentAt: new Date(),
        itemId,
        properties: { "discount":"No" }
      },
      {
        eventType: 'OrderCompleted',
        sentAt: new Date(),
        itemId,
        properties: { "discount":"No" }
      }
    ];

  try {
    const params = {
      eventList,
      trackingId: PERSONALIZE_EVENT_TRACKING_ID,
      sessionId: userId,
      userId
    };

    await personalizeevents.putEvents(params).promise();
    console.log("Call Personalize putEvents successfully", params);

    res.status(200).json(params);
  } catch (e) {
    console.log(e);
  }
}
