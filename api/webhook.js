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
    console.log({message});

    console.log(
      `[${message?.actor?.userMetadata?.displayName}]: ${message.message} [${
        message.timestamp
      }] (now: [${new Date().valueOf()}])`
    );

    const isOwner = message?.actor?.role === "owner";
    const username = message?.actor?.userMetadata?.displayName ?? "";

    if (!isOwner) {
      await http.post("/messages", {
        channel: channelId,
        text: `thank you ${username}! <3`,
        message,
      });
    }
    send(res, 200, {});
  } catch (error) {
    console.log({ error: error.response?.data ?? error });
    send(res, 200, { ok: false });
  }
};
