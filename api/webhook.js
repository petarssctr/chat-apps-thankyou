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

      // const thanksMessage = amount > 1
      //   ? amount > 2 ? `thank youuu ${username}! <3 (for ${amount} tks)` : `thank you soooo much ${username}! <3 (for ${amount} tks)`
      //   : `tnx ${username}. (for ${amount} tks)`;

      const tipMsg = message.metadata.context.tip.message;
      const thanksMessage = `${tipMsg.replace('[k6]', `[${process.env.APP_NAME || 'app'}]`)} ${message.message} [ts=${new Date().valueOf()}]`

      if (username) {
        console.log('sending message', {username, amount, thanksMessage});
        const r = await http.post("/messages", {
          channel: channelId,
          text: thanksMessage,
          as: 'channel',
        });

        console.log({response: r.data});
      }
    } else {
      const isOwner = message?.actor?.role === "owner";
      const username = message?.actor?.userMetadata?.username ?? "";
  
      if (!isOwner) {
        await http.post("/messages", {
          channel: channelId,
          text: `${message.message.replace('[k6]', `[${process.env.APP_NAME || 'app'}]`)} [ts=${new Date().valueOf()}]`,
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
