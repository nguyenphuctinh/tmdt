import express from "express";
import request from "request";

import { getAllProducts } from "./product.js";
const router = express.Router();
router.post("/", (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log("event" + webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});
async function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;
  console.log(payload);
  // Set the response based on the postback payload
  if (payload === "yes") {
    response = { text: "Thanks!" };
  } else if (payload === "no") {
    response = { text: "Oops, try sending another image." };
  } else if (payload === "Bat dau") {
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "iPhone",
              subtitle: "Tap a button to answer.",
              image_url:
                "https://ttcs-npt.web.app/static/media/logo.b2a56a22.png",
              buttons: [
                {
                  type: "postback",
                  title: "Xem sản phẩm mới nhất",
                  payload: "newArrivalPhone",
                },
                {
                  type: "postback",
                  title: "Xem sản phẩm bán chạy nhất",
                  payload: "bestSellerPhone",
                },
              ],
            },
            {
              title: "iPad",
              subtitle: "Tap a button to answer.",
              image_url:
                "https://ttcs-npt.web.app/static/media/logo.b2a56a22.png",
              buttons: [
                {
                  type: "postback",
                  title: "Xem sản phẩm mới nhất",
                  payload: "newArrivalTablet",
                },
                {
                  type: "postback",
                  title: "Xem sản phẩm bán chạy nhất",
                  payload: "bestSellerTablet",
                },
              ],
            },
            {
              title: "Mac",
              subtitle: "Tap a button to answer.",
              image_url:
                "https://ttcs-npt.web.app/static/media/logo.b2a56a22.png",
              buttons: [
                {
                  type: "postback",
                  title: "Xem sản phẩm mới nhất",
                  payload: "newArrivalLaptop",
                },
                {
                  type: "postback",
                  title: "Xem sản phẩm bán chạy nhất",
                  payload: "bestSellerLaptop",
                },
              ],
            },
            {
              title: "Watch",
              subtitle: "Tap a button to answer.",
              image_url:
                "https://ttcs-npt.web.app/static/media/logo.b2a56a22.png",
              buttons: [
                {
                  type: "postback",
                  title: "Xem sản phẩm mới nhất",
                  payload: "newArrivalWatch",
                },
                {
                  type: "postback",
                  title: "Xem sản phẩm bán chạy nhất",
                  payload: "bestSellerWatch",
                },
              ],
            },
          ],
        },
      },
    };
  } else if (
    payload === "newArrivalPhone" ||
    payload === "newArrivalTablet" ||
    payload === "newArrivalLaptop" ||
    payload === "newArrivalWatch"
  ) {
    try {
      const category = payload.split("newArrival")[1].toLowerCase();
      const products = await getAllProducts();
      let newArrivals = [];
      products.forEach((product) => {
        if (product.category === category) {
          newArrivals = [
            ...newArrivals,
            {
              title: product.productName,
              subtitle: "Tap a button to answer.",
              image_url: product.productVariants[0].imgSrcList[0],
              buttons: [
                {
                  type: "web_url",
                  title: "Xem chi tiết",
                  url: `https://ttcs-npt.web.app/product/${product.productName}`,
                },
                {
                  type: "postback",
                  title: "Xem sản phẩm bán chạy nhất",
                  payload: "bestSellerIPhone",
                },
              ],
            },
          ];
        }
      });

      response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              ...newArrivals,
              {
                title: "Test ?",
                subtitle: "Tap a button to answer.",
                image_url:
                  "https://ttcs-npt.web.app/static/media/logo.b2a56a22.png",
                buttons: [
                  {
                    type: "postback",
                    title: "Yes!",
                    payload: "yes",
                  },
                  {
                    type: "postback",
                    title: "No!",
                    payload: "no",
                  },
                ],
              },
            ],
          },
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
  console.log(response.attachment.payload.elements);
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}
function handleMessage(sender_psid, received_message) {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an attachment!`,
    };
  }
  // Get the URL of the message attachment
  response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Test gửi ảnh?",
            subtitle: "Tap a button to answer.",
            image_url:
              "https://ttcs-npt.web.app/static/media/logo.b2a56a22.png",
            buttons: [
              {
                type: "postback",
                title: "Yes!",
                payload: "yes",
              },
              {
                type: "postback",
                title: "No!",
                payload: "no",
              },
            ],
          },
        ],
      },
    },
  };

  // Send the response message
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}
router.get("/", (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the q uery string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
export default router;
