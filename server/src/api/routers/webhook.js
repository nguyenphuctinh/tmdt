import express from "express";
import request from "request";
import pkg from "node-wit";
const { log, Wit } = pkg;

import { getAllProducts } from "./product.js";
import { transfer } from "../helpers/transfer.js";
const router = express.Router();

router.post("/", (req, res) => {
  let body = req.body;
  console.log(JSON.stringify(body));

  // Checks this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be multiple if batched

    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];

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

  let payload = received_postback.payload;
  console.log(payload);
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
  try {
    let response;

    if (received_message.text) {
      const client = new Wit({
        accessToken: process.env.WIT_AI_ACCESS_TOKEN,
      });
      var msg = received_message.text;
      var wit = await client.message(msg);
      const intents = wit.intents.map((intent) => intent["name"]);
      var reply = null;
      if (intents.includes("see_product_list")) {
        const products = await getAllProducts();
        callSendAPI(sender_psid, { text: "Bạn đợi mình chút nhé!" });
        if (wit.entities["product:name"]) {
          const names = wit.entities["product:name"];
          reply = await productTemplateList(
            products,
            transfer(names[0].value.toLowerCase()),
            "name"
          );
        } else {
          const categories =
            wit.entities["product:category"] || wit.entities["product:name"];
          console.log(wit.entities);
          if (!categories) {
            reply = { text: "Xin lỗi bạn, hiện tại không có sản phẩm nào" };
          } else {
            reply = await productTemplateList(
              products,
              transfer(categories[0].value.toLowerCase()),
              "category"
            );
          }
        }
        if (!reply || reply.attachment.payload.elements.length === 0) {
          callSendAPI(sender_psid, {
            text: "Xin lỗi bạn, hiện tại không có sản phẩm nào thuộc danh mục này",
          });
        } else {
          console.log(reply);
          callSendAPI(sender_psid, { ...reply });
        }
      } else if (intents.includes("see_other_products")) {
        callSendAPI(sender_psid, {
          text: "Bạn cho mình thêm thông tin để mình tìm sản phẩm cụ thể hơn (VD: loại sản phẩm, khoảng giá, màu sắc...)",
        });
      } else {
        let res = null;
        for (const key in responses) {
          if (Object.hasOwnProperty.call(responses, key)) {
            if (
              wit.traits &&
              wit.traits[key] &&
              wit.traits[key].length > 0 &&
              wit.traits[key][0].value
            ) {
              res =
                responses[key][
                  Math.floor(Math.random() * responses[key].length)
                ];
            }
          }
        }
        if (!res) {
          res =
            "Bạn có thể liên hệ qua sdt chăm sóc kh 0239872001 để được hỗ trợ nhé!";
        }
        callSendAPI(sender_psid, {
          text: res,
        });
      }
    }
  } catch (error) {
    console.log(error);
    handleMessage(sender_psid, received_message);
  }
}

function callSendAPI(sender_psid, response) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };
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
    "Chào bạn! Mình có thể giúp gì cho bạn?",
  ],
  thanks: ["Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!"],
  intro: [
    "Bạn có thể tìm kiếm sản phẩm theo các danh mục sau: điện thoại, máy tính bảng, laptop, đồng hồ. Bạn muốn tham khảo sản phẩm nào?",
  ],
  policy: [
    "Cửa hàng mình bảo hàng cho toàn bộ sản phẩm trong 2 năm, không áp dụng trả góp, đổi trả trong vòng 5 ngày, thanh toán khi nhận hàng. Nếu có bất kỳ vấn đề gì về sản phẩm, bạn có thể liên hệ với chúng tôi qua số điện thoại:123456789",
  ],
};

const productTemplateList = async (products, filterValue, type) => {
  let newArrivals = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [],
      },
    },
  };
  if (type === "name") {
    for (let index = 0; index < products.length; index++) {
      const product = { ...products[index] };
      if (
        product.productName.toLowerCase().includes(filterValue.toLowerCase())
      ) {
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
    }
  } else if (type === "category") {
    for (let index = 0; index < products.length; index++) {
      const product = { ...products[index] };
      if (product.category === filterValue) {
        if (newArrivals.attachment.payload.elements.length === 3) {
          break;
        }
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
    }
  }
  return newArrivals;
};
export default router;
