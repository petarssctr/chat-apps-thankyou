require("dotenv").config();
const { json, send } = require("micro");
const axios = require("axios");

module.exports = async (req, res) => {
  try {
    send(res, 200, {
      message: 'hello from chat app'
    });
  } catch (error) {
    console.log({ error });
    send(res, 200, { ok: false });
  }
};
