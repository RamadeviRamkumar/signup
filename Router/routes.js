// const express = require('express');
// const app = express();
// const router = express.Router();
// const bodyParser = require('body-parser');
// const twilio = require('twilio');
// const send= require('../model/model.js'); 

// const user_Signup = require('../model/model.js'); 
// const accountSid = "AC87a8fc73b94fbe3d3c380c0848d31c77";
// const authToken = "d5e2448480ff2aca6406fae02203cb77";
// const twilioPhoneNumber = "+12565677073";

// const client = new twilio(accountSid, authToken);
// //client.messaging.v1.services
//   //.create({friendlyName: 'friendly_name'})
//   //.then(service => console.log(service.sid));

// app.use(bodyParser.urlencoded({ extended: false }));

// const phoneNumbers = {};
// function generateOTP() {
//     let otp =Math.floor(100000 + Math.random() * 900000);
//     console.log(otp);
//   return otp;
// }

// function sendOTP(phoneNumber, otp) {
//   return client.messages.create({
//     body: `Your OTP is: ${otp}`,
//     from: twilioPhoneNumber,
//     to: phoneNumber
//   });
// }

// router.get('/api', function (req, res) {
//   res.json({
//     status: 'API Works',
//     message: 'Welcome to User Signin/Signup API'
//   });
// });
// router.post('/signin', (req, res) => {
//   const { phoneNumber } = req.body;

//   if (!phoneNumber ) {
//     return res.status(400).json({ error: 'Invalid phone number' });
//   }
//   const otp = generateOTP();
//   sendOTP(phoneNumber, otp)
//     .then(() => {
//       res.json({ success: true, message: 'OTP sent successfully' });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to send OTP' });
//     });
// });
// router.post('/verifyOTP', (req, res) => {
//   const { phoneNumber,otp} = req.body;

//   if (!phoneNumber || !otp) {
//     return res.status(400).json({ error: 'Phone number and OTP are required' });
//   }

//   if (phoneNumbers[phoneNumber] && phoneNumbers[phoneNumber] == otp) {
    
//     res.json({ success: true, message: 'OTP is valid' });
//   } else {
//     console.log("phoneNumber",phoneNumber)
//     console.log("otp",otp)
//     res.status(401).json({ error: 'Invalid OTP' });
//   }
// });
// const mobilecount = require('../model/model.js');

//     // router.post('/register',async (req,callback) => {
        
    
//     //     var user = new user_Signup();
//     //     user.userName  = req.body.userName;       
//     //     user.phoneNumber   = req.body.phoneNumber;
      
//     //    await user.save(function (err) {              
//     //             if(err)        
//     //                 callback.json("User already signup by using this mobilenumber")    
                
//     //             else {                    
//     //             callback.json({
//     //             message : "*** New user signup ***",
//     //              data: {
                    
//     //                 userName  : req.body.userName,
//     //                 phoneNumber   : req.body.phoneNumber,
//     //                 otp  : req.body.otp
//     //             }
//     //             })            
//     //         }
//     //     })       
//     //     }) 

//     router.post('/register', async (req, res) => {
//       try {
//         const user = new user_Signup({
//           userName: req.body.userName,
//           phoneNumber: req.body.phoneNumber,
      
//         });
    
//         await user.save();
    
//         res.json({
//           message: 'New user signed up successfully',
//           data: {
//             userName: user.userName,
//             phoneNumber: user.phoneNumber,
//             otp: user.otp,
//           },
//         });
//       } catch (error) {
//         if (error.code === 11000) {
//           res.status(400).json('User already signed up using this phone number');
//         } else {
//           console.log(error)
//           res.status(500).json('Internal Server Error',error);
//         }
//       }
//     });

// var Controller = require('../controller/controllers.js');
// router.route('/user')
// .get(Controller.index)

// router.route('/user/:number')
// .get(Controller.view)
// .patch(Controller.update)
// .put(Controller.update)
// .delete(Controller.Delete);

// module.exports = router;


const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const twilio = require('twilio');
const user_Signup = require('../model/model.js');
const Controller = require('../controller/controllers.js');
var mongoose = require('mongoose');
var User = mongoose.model('list');

const accountSid = "AC87a8fc73b94fbe3d3c380c0848d31c77";
const authToken = "d5e2448480ff2aca6406fae02203cb77";
const twilioPhoneNumber = "+12565677073";

const client = new twilio(accountSid, authToken);

router.use(bodyParser.urlencoded({ extended: false }));

const phoneNumbers = {};

function generateOTP() {
  let otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);
  return otp;
}

function sendOTP(phoneNumber, otp) {
  return client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: twilioPhoneNumber,
    to: phoneNumber
  });
}

router.get('/api', function (req, res) {
  res.json({
    status: 'API Works',
    message: 'Welcome to User Signin/Signup API'
  });
});

router.post('/signin', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  // Generate a new OTP
  const otp = generateOTP();

  try {
    // Find or create a user with the phone number and update the OTP
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
    }
    
    user.otp = otp;
    await user.save();

    // Send the OTP via Twilio (replace with your Twilio code)
    await sendOTP(phoneNumber, otp);

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/verifyOTP', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  try {
    // Find the user by phone number and verify the OTP
    const user = await User.findOne({ phoneNumber });

    if (user && user.otp === otp) {
      res.json({ success: true, message: 'OTP is valid' });
    } else {
      console.log("phoneNumber", phoneNumber);
      console.log("otp", otp);
      res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});


router.post('/register', async (req, res) => {
  try {
    const user = new user_Signup({
      userName: req.body.userName,
      phoneNumber: req.body.phoneNumber,
      // Add other properties as needed
    });

    await user.save();

    res.json({
      message: 'New user signed up successfully',
      data: {
        userName: user.userName,
        phoneNumber: user.phoneNumber,
        // Add other properties as needed
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json('User already signed up using this phone number');
    } else {
      console.log(error);
      res.status(500).json('Internal Server Error', error);
    }
  }
});

router.route('/user')
  .get(Controller.index);

router.route('/user/:number')
  .get(Controller.view)
  .patch(Controller.update)
  .put(Controller.update)
  .delete(Controller.Delete);

module.exports = router;

