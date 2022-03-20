import express from "express";
import request from "request";
import pkg from "node-wit";
const { log, Wit } = pkg;

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
    const category = payload.split("newArrival")[1].toLowerCase();

    const newProductTemplateList = await productTemplateList(category);
    response = {
      ...newProductTemplateList,
    };
  }
  // console.log(response.attachment.payload.elements);
  callSendAPI(sender_psid, response);
}
async function handleMessage(sender_psid, received_message) {
  let response;

  if (received_message.text) {
    const client = new Wit({
      accessToken: process.env.WIT_AI_ACCESS_TOKEN,
    });
    var msg = received_message.text;
    var wit = await client.message(msg);
    const intents = wit.intents.map((intent) => intent["name"]);
    var reply;
    if (intents.includes("see_product_list")) {
      callSendAPI(sender_psid, { text: "Bạn đợi mình chút nhé!" });
      const categories =
        wit.entities["product:category"] || wit.entities["product:name"];
      reply = await productTemplateList(categories[0].value.toLowerCase());
    } else {
      reply = {
        text: await nlp.handleMessage(wit.entities, wit.traits),
      };
    }
    response = { ...reply };
  }
  console.log(response);
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

const responses = {
  greetings: [
    "Chào bạn, bạn đang muốn tìm kiếm sản phẩm nào?",
    "Xin chào! Bạn cần mình giúp gì?",
    "Chào bạn!",
  ],
  thanks: ["Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!"],
};

const firstValue = (obj, key) => {
  const val =
    obj &&
    obj[key] &&
    Array.isArray(obj[key]) &&
    obj[key].length > 0 &&
    obj[key][0].value;
  if (!val) {
    return null;
  }
  return val;
};

export var nlp = {
  handleMessage: async (entities, traits) => {
    // làm vòng forr check các key trong response hợp lý hơn
    if (firstValue(traits, "greetings")) {
      return responses["greetings"][
        Math.floor(Math.random() * responses["greetings"].length)
      ];
    } else if (firstValue(traits, "thanks")) {
      return responses["thanks"][
        Math.floor(Math.random() * responses["thanks"].length)
      ];
    } else {
      return "Bạn có thể liên hệ qua sdt chăm sóc kh 0239872001";
    }
  },
};
const productTemplateList = async (category) => {
  try {
    const products = await getAllProducts();
    let newArrivals = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [],
        },
      },
    };

    products.forEach((product) => {
      if (product.category === category) {
        if (newArrivals.attachment.payload.elements.length === 5) return;
        newArrivals.attachment.payload.elements = [
          ...newArrivals.attachment.payload.elements,
          {
            title: product.productName,
            subtitle: "Tap a button to answer.",
            image_url: product.productVariants[0].imgSrcList[0].img,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: `https://ttcs-npt.web.app/product/${product.productName}`,
              },
            ],
          },
        ];
      }
    });
    if (newArrivals.attachment.payload.elements.length === 0) {
      return {
        text: "Xin lỗi bạn, hiện tại không có sản phẩm nào thuộc danh mục này",
      };
    }
    return newArrivals;
  } catch (error) {
    console.log(error);
  }
};
export default router;
