const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const UserModel = require('../models/User');

router.get('/', function(req, res, next) {
  res.render('index', { title: "Harshit's Application" });
});

router.post('/login', async function(req, res, next) {
  const { email = "", password = "" } = req.body;

  if (email.length > 0 && password.length > 0) {
    try {
      const user = await UserModel.findOne({
        email
      });
      if (user === null) {
        return res.status(404).send({
          status: "failed",
          error: "User does not exist"
        });
      }
      if (await bcrypt.compare(password, user.password)) {
        return res.status(200).send({
          status: "success",
          user
        });
      }
      return res.status(401).send({
        status: "failed",
        error: "Invalid Credentials"
      });
    } catch (error) {
      return res.status(500).send({
        status: "failed",
        error
      });
    }
  }

  return res.status(400).send({
    status: "failed",
    error: "email and password are required"
  });
});

router.post('/register', async function(req, res, next) {
  const { email = "", password = "", firstName = "", lastName = "" } = req.body;

  if (email.length > 0 && password.length > 0 && firstName.length > 0) {
    // create new user
    try {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        firstName,
        email,
        password: encryptedPassword,
        lastName
      });
      return res.status(200).send({
        status: "success",
        user: newUser
      });
    } catch (error) {
      return res.status(500).send({
        status: "failed",
        error
      });
    }
  }

  return res.status(400).send({
    status: "failed",
    error: "firstName, email and password are required"
  });
});



module.exports = router;
