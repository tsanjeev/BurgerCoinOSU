var express = require("express");
var bodyParser = require("body-parser");
var handlebars = require("express-handlebars");
var path = require("path");
var https = require("https");
var randomstring = require("randomstring");
var querystring = require("querystring");

var nodemailer = require("nodemailer");
var request = require("request");

var freeTokensPage = "https://burgercoin-project-2018.herokuapp.com/";

var passcode = "";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "burgercoinosu@gmail.com",
    clientId:
      "1036091924534-1esr8b65m2tjv4k05fbdfbuo5s52d5s2.apps.googleusercontent.com",
    clientSecret: "9DFDTg_Nb_iCu9dAZqeAV6hH",
    refreshToken: "1/wF5AVG9MAO6mw5CAxUOo3I676vx2Xsg6UMqWaBszVRo"
  }
});

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.static('views/Logos'));
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.post("/", function(req, res) {
  var userEmail = req.body.email_input;
  var send_text = "456";
  var mailOptions = {
    from: "BurgerCoinOSU <BurgerCoinOsu@gmail.com>",
    to: userEmail,
    subject: "BurgerCoinOSU Free Tokens!!!",
    text: send_text
  };
  
  transporter.sendMail(mailOptions, function(err, res) {
    if (err) {
      console.log("Error");
    } else {
      console.log("Email Sent");
    }
  });

  res.render("start", {});
});

/************************
  USER SIGNUP
************************/

app.post("/u_signup", function(req, res) {
  var userEmail = req.body.email_input;

  // First, generate a random passcode to be associated with this address
  var i;
  var send_int = 0;
  var send_char = '';
  var send_string = "";
  for (i = 0; i < 16; i++)
  {
    send_int = Math.floor(Math.random() * 26);
    send_char = String.fromCharCode(send_int + 97);
    send_string = send_string + send_char;
  }
  passcode = send_string;
  
  // Second, send that passcode to the user's email address
  var mailOptions = {
    from: "BurgerCoinOSU <BurgerCoinOsu@gmail.com>",
    to: userEmail,
    subject: "BurgerCoinOSU Free Tokens!!!",
    text: send_string
  };
  transporter.sendMail(mailOptions, function(err, res) {
    if (err) {
      console.log("Error");
    } else {
      console.log("Email Sent");
    }
  });
  
  // Third, send an entry to the user database with that information
  var context = {};
  // context.p = send_string;
  context.e = userEmail;
  
  var payload = {};
  payload.passcode = send_string;
  payload.address = userEmail;
  
  // Send the post request to the server
  request({
    url: "https://my-project-1514223225812.appspot.com/account",
    method: "POST",
    json: true,   // <--Very important!!!
    body: payload
  }, function (error, response, body){
      console.log(response);
  });
  
  // render the view
  res.render("u_confirmed", context);
    
});

//app.post("/u_confirmed", function(req, res) {
//  res.render("user", {});
//});

app.post("/u_verified", function(req, res) {
  var userEmail = req.body.confirmed_email;
  var userPasscode = req.body.confirmed_passcode;
  var payload = {};
  payload.address = userEmail;
  payload.passcode = userPasscode;

  var context = {};
  // Send the post request to the server
  request({
    url: "https://my-project-1514223225812.appspot.com/account",
    method: "POST",
    json: true,   // <--Very important!!!
    body: payload
  }, function (error, response, body){
      var passed = response.body;
      if (passed == "verified")
      {
        // execute the transfer
        context.message1 = "Email verification and new account status successful!";
        context.message2 = "Please complete the transaction on you MetaMask wallet";
        res.render("user", context);
      }
      else if (passed == "exists")
      {
        context.message1 = "I'm sorry, that email address has already been used to collect free BurgerCoin";
        context.message2 = "IF you'd like, you may return to the signup page and try again";
        res.render("u_result", context);
      }
      else if (passed == 'wrongcode')
      {
        var newcontext = {};
        newcontext.e = userEmail;
        newcontext.r = "Uh oh.  The passcode doesn't match.  Would you like to try again?";
        res.render("u_confirmed", newcontext);
      }
  });
    
});


/************************
  RESTAURANT SIGNUP
************************/

app.post("/r_signup", function(req, res) {
  var restEmail = req.body.email_input;

  // First, generate a random passcode to be associated with this address
  var i;
  var send_int = 0;
  var send_char = '';
  var send_string = "";
  for (i = 0; i < 16; i++)
  {
    send_int = Math.floor(Math.random() * 26);
    send_char = String.fromCharCode(send_int + 97);
    send_string = send_string + send_char;
  }
  passcode = send_string;
  
  // Second, send that passcode to the user's email address
  var mailOptions = {
    from: "BurgerCoinOSU <BurgerCoinOsu@gmail.com>",
    to: restEmail,
    subject: "BurgerCoinOSU Free Tokens!!!",
    text: send_string
  };
  transporter.sendMail(mailOptions, function(err, res) {
    if (err) {
      console.log("Error");
    } else {
      console.log("Email Sent");
    }
  });
  
  // Third, send an entry to the user database with that information
  var context = {};
  // context.p = send_string;
  context.e = restEmail;
  
  var payload = {};
  payload.passcode = send_string;
  payload.address = restEmail;
  
  // Send the post request to the server
  request({
    url: "https://my-project-1514223225812.appspot.com/account",
    method: "POST",
    json: true,   // <--Very important!!!
    body: payload
  }, function (error, response, body){
      console.log(response);
  });
  
  // render the view
  res.render("r_confirmed", context);
    
});

//app.post("/r_confirmed", function(req, res) {
//  res.render("user", {});
//});

app.post("/r_verified", function(req, res) {
  var restEmail = req.body.confirmed_email;
  var restPasscode = req.body.confirmed_passcode;
  var payload = {};
  payload.address = restEmail;
  payload.passcode = restPasscode;

  var context = {};
  // Send the post request to the server
  request({
    url: "https://my-project-1514223225812.appspot.com/account",
    method: "POST",
    json: true,   // <--Very important!!!
    body: payload
  }, function (error, response, body){
      var passed = response.body;
      if (passed == "verified")
      {
        // execute the transfer
        context.message1 = "Email verification and new account status successful!";
        context.message2 = "Please complete the transaction on you MetaMask wallet";
        res.render("r_result", context);
      }
      else if (passed == "exists")
      {
        context.message1 = "I'm sorry, that email address has already been used to collect free BurgerCoin";
        context.message2 = "IF you'd like, you may return to the signup page and try again";
        res.render("r_result", context);
      }
      else if (passed == 'wrongcode')
      {
        var newcontext = {};
        newcontext.e = restEmail;
        newcontext.r = "Uh oh.  The passcode doesn't match.  Would you like to try again?";
        res.render("r_confirmed", newcontext);
      }
  });
    
});

app.get("/", function(req, res) {
  res.render("start", {});
});

app.get("/about", function(req, res) {
  res.render("about", {});
});

app.get("/transfer", function(req, res) {
  res.render("transfer", {});
});

app.get("/user", function(req, res) {
  res.render("user", {});
});

app.post("/user", function(req, res) {
  res.render("user", {});
});

app.get("/join", function(req, res) {
  res.render("join", {});
});

app.post("/join", function(req, res) {
  res.render("join", {});
});

app.get("/restaurant", function(req, res) {
  res.render("restaurant", {});
});

app.get("/u_signup", function(req, res) {
  res.render("u_signup", {});
});

app.get("/result", function(req, res) {
  res.render("transfer", {});
});

app.get("/r_signup", function(req, res) {
  res.render("r_signup", {});
});


app.listen(port, function() {
  console.log("BurgerCoin app listening on port " + port + "!");
});
