import express from "express";
import request from "request";
import pkg from "node-wit";
const { log, Wit } = pkg;

import { getAllProducts } from "./product.js";
import { transfer } from "../helpers/transfer.js";
const router = express.Router();

router.post("/", (req, res) => {
  let body = req.body;
  // console.log(JSON.stringify(body));

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
                  title: "Xem s???n ph???m m???i nh???t",
                  payload: "newArrivalPhone",
                },
                {
                  type: "postback",
                  title: "Xem s???n ph???m b??n ch???y nh???t",
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
                  title: "Xem s???n ph???m m???i nh???t",
                  payload: "newArrivalTablet",
                },
                {
                  type: "postback",
                  title: "Xem s???n ph???m b??n ch???y nh???t",
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
                  title: "Xem s???n ph???m m???i nh???t",
                  payload: "newArrivalLaptop",
                },
                {
                  type: "postback",
                  title: "Xem s???n ph???m b??n ch???y nh???t",
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
                  title: "Xem s???n ph???m m???i nh???t",
                  payload: "newArrivalWatch",
                },
                {
                  type: "postback",
                  title: "Xem s???n ph???m b??n ch???y nh???t",
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
  await callSendAPI(sender_psid, response);
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
      console.log(JSON.stringify(wit));
      if (intents.includes("see_product_list")) {
        const products = await getAllProducts();
        await callSendAPI(sender_psid, { text: "B???n ?????i m??nh ch??t nh??!" });
        if (wit.entities["product:name"]) {
          const names = wit.entities["product:name"];
          let productsFilteredByName = filterProductsByName(
            products,
            transfer(names[0].value.toLowerCase())
          );
          if (wit.entities["color:color"]) {
            const colors = wit.entities["color:color"];
            let productsFilteredByColorAndName = await productTemplateList(
              productsFilteredByName.filter((product) => {
                console.log(
                  product.productVariants.map((productVariant) =>
                    productVariant.color.toLowerCase()
                  ),
                  colors[0].value.toLowerCase()
                );
                return product.productVariants
                  .map((productVariant) => productVariant.color.toLowerCase())
                  .includes(colors[0].value.toLowerCase());
              })
            );
            reply = productsFilteredByColorAndName;
          } else {
            reply = await productTemplateList(productsFilteredByName);
          }
        } else {
          const categories =
            wit.entities["product:category"] || wit.entities["product:name"];
          console.log(wit.entities);
          if (!categories) {
            reply = { text: "Xin l???i b???n, hi???n t???i kh??ng c?? s???n ph???m n??o" };
          } else {
            reply = await productTemplateList(
              products.filter(
                (product) =>
                  product.category.toLowerCase() ===
                  transfer(categories[0].value.toLowerCase())
              )
            );
          }
        }
        if (!reply || reply.attachment.payload.elements.length === 0) {
          await callSendAPI(sender_psid, {
            text: "Xin l???i b???n, hi???n t???i kh??ng c?? s???n ph???m n??o thu???c danh m???c n??y",
          });
        } else {
          console.log(reply);
          await callSendAPI(sender_psid, { ...reply });
        }
      } else if (intents.includes("see_other_products")) {
        await callSendAPI(sender_psid, {
          text: "B???n cho m??nh th??m th??ng tin ????? m??nh t??m s???n ph???m c??? th??? h??n (VD: lo???i s???n ph???m, kho???ng gi??, m??u s???c...)",
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
          res = "B???n c?? th??? li??n h??? qua sdt ch??m s??c kh ????? ???????c h??? tr??? nh??!";
        }
        await callSendAPI(sender_psid, {
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
  return new Promise((resolve, reject) => {
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
          resolve();
          console.log("message sent!");
        } else {
          reject();
          console.error("Unable to send message:" + err);
        }
      }
    );
  });
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
    "Ch??o b???n, b???n ??ang mu???n t??m ki???m s???n ph???m n??o?",
    "Xin ch??o! B???n c???n m??nh gi??p g???",
    "Ch??o b???n! M??nh c?? th??? gi??p g?? cho b???n?",
  ],
  thanks: ["C???m ??n b???n ???? tin t?????ng v?? s??? d???ng d???ch v??? c???a ch??ng t??i!"],
  intro: [
    "B???n c?? th??? t??m ki???m s???n ph???m theo c??c danh m???c sau: ??i???n tho???i, m??y t??nh b???ng, laptop, ?????ng h???. B???n mu???n tham kh???o s???n ph???m n??o?",
  ],
  policy: [
    "C???a h??ng m??nh b???o h??ng cho to??n b??? s???n ph???m trong 2 n??m, kh??ng ??p d???ng tr??? g??p, ?????i tr??? trong v??ng 5 ng??y, thanh to??n khi nh???n h??ng. N???u c?? b???t k??? v???n ????? g?? v??? s???n ph???m, b???n c?? th??? li??n h??? v???i ch??ng t??i qua s??? ??i???n tho???i:123456789",
  ],
};

const productTemplateList = async (products) => {
  let newArrivals = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [],
      },
    },
  };
  for (let index = 0; index < products.length; index++) {
    const product = { ...products[index] };
    newArrivals.attachment.payload.elements = [
      ...newArrivals.attachment.payload.elements,
      {
        title: product.productName,
        subtitle: "Tap a button to answer.",
        image_url: product.productVariants[0].imgSrcList[0].img,
        buttons: [
          {
            type: "web_url",
            title: "Xem chi ti???t",
            url: `https://ttcs-npt.web.app/product/${product.productName}`,
          },
        ],
      },
    ];
  }
  return newArrivals;
};
function filterProductsByName(arr, q) {
  return arr.filter((product) => {
    let ok = 1;
    const words = q.split(" ");
    words.forEach((word) => {
      if (
        product.productName.toLowerCase().indexOf(word.toLowerCase()) === -1
      ) {
        ok = 0;
      }
    });
    return ok;
  });
}

export default router;
