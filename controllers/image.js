const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 72a1c7e7e7ed4feba91fe9186f54c269");

const USER_ID = "lpkyrius";
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = "72a1c7e7e7ed4feba91fe9186f54c269";
const APP_ID = "face-recognition-brain";

// Models: https://clarifai.com/clarifai/main/models 
// face recognition -------------
// const MODEL_ID = "FACE_DETECT_MODEL"; //"face-detection";
const MODEL_VERSION_ID =  "face-detection";

// "a403429f2ddf4b49b307e318f00e528b" <<<<<
// "6dc7e46bc9124c5c8824be4822abe105"; 
// "aa7f35c01e0642fda5cf400f543e7c40";

// general image recognition -------------
// const MODEL_ID = 'general-image-recognition'
// const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40'

// Change this to whatever image URL you want to process
// const raw = JSON.stringify({
//   user_app_id: {
//     user_id: USER_ID,
//     app_id: APP_ID,
//   },
//   inputs: [
//     {
//       data: {
//         image: {
//           url: IMAGE_URL,
//         },
//       },
//     },
//   ],
// });

// const requestOptions = {
//   method: "POST",
//   headers: {
//     Accept: "application/json",
//     Authorization: "Key " + PAT,
//   },
//   body: raw,
// };

/* 
----------------------------------------------
In order to verify if Clarify Face-Detection 
is working, access:
https://www.clarifai.com/models/face-detection 
----------------------------------------------
*/ 

// Use the 2 lines bellow to check Clarify model number
// const Clarifai = require('clarifai');
// console.log(Clarifai);

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
        model_id: MODEL_VERSION_ID,
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        inputs: [{data: {image: {url: req.body.input}}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }

        console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
        console.log(response);
        res.json(response);
    }
  );
  }





// const handleApiCall = (req, res) => {
//   // console.log('req.body.input: ', req.body.input); OK!!!
//   fetch(
//     "https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs",
//       {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Authorization': 'Key ' + PAT,
//         },
//         body: JSON.stringify({
//           user_app_id: {
//             user_id: USER_ID,
//             app_id: APP_ID,
//           },
//           inputs: [
//             {
//               data: {
//                 image: {
//                   url: req.body.input,
//                 },
//               },
//             },
//           ],
//         }),
//       }
//   )
//     .then(data => {
//       res.json(data);
//     })
//     .catch(err => res.status(400).json('unable to work with API'))
// }
const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')  
    .then(entries => {
      res.json(entries[0].entries);  
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = { 
    handleImage,
    handleApiCall 
}