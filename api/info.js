require("dotenv").config();
const { send } = require("micro");

module.exports = async (req, res) => {
  try {
    send(res, 200, {
      message: 'hello from chat app'
    });
  } catch (error) {
    console.log('error', { error });
    send(res, 200, { ok: false });
  }
};
