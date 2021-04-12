require("dotenv").config();
const { json, send } = require("micro");
const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const http = axios.create({
      baseURL: process.env.CHAT_SERVICE_URL,
      headers: {
        Accept: "application/json",
        "x-app-id": process.env.APP_ID,
        "x-api-key": process.env.API_KEY,
      },
    });

    const { message, channelId } = await json(req);

    if (message?.metadata?.type === 'tip') {
      const username = message?.metadata?.author?.username ?? "";
      const amount = message?.metadata?.context?.tip?.amount;

      const thanksMessage = amount > 1
        ? amount > 2 ? `thank youuu ${username}! <3 (for ${amount} tks)` : `thank you soooo much ${username}! <3 (for ${amount} tks)`
        : `tnx ${username}. (for ${amount} tks)`;

      if (username) {
        console.log('sending message', {username, amount});
        await http.post("/messages", {
          channel: channelId,
          text: thanksMessage,
          message,
          as: 'channel',
        });
      }
    } else {
      const isOwner = message?.actor?.role === "owner";
      const username = message?.actor?.username ?? "";
  
      if (!isOwner) {
        await http.post("/messages", {
          channel: channelId,
          text: `thank you ${username}! <3`,
          message,
          as: 'channel',
        });
      }
    }

    console.log(
      `[${message?.actor?.username}]: ${message.message} [${
        message.timestamp
      }] (now: [${new Date().valueOf()}])`
    );

    send(res, 200, {});
  } catch (error) {
    console.log({ error: error.response?.data ?? error });
    send(res, 200, { ok: false });
  }
};
