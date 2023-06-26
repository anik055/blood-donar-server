const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const app = express();
const port = 4200;
app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("welcome to eBachelor server");
});
const pass = ["3ApXHf3IoUtd5zGI", "eBachelor"];

const uri =
  "mongodb+srv://eBachelor:HT1srzZ4rnXNkt94@cluster0.rzm4j.mongodb.net/bachelorCommerce?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const bloodDetails = client.db("blood-donation").collection("bloodDetails");
  const userDetails = client.db("blood-donation").collection("userDetails");

  app.get("/AvailableDonars", (req, res) => {
    if (req?.query?.groupId && req?.query?.locationId) {
      // console.log(typeof req.query.groupId)
      userDetails
        .find({
          groupId: parseInt(req.query.groupId),
          locationId: parseInt(req.query.locationId),
          status: true,
        })
        .toArray((err, documents) => {
          res.send(documents);
        });
    } else if (req?.query?.groupId && !req?.query?.locationId) {
      userDetails
        .find({ groupId: parseInt(req.query.groupId), status: true })
        .toArray((err, documents) => {
          res.send(documents);
        });
    } else if (!req?.query?.groupId && req?.query?.locationId) {
      userDetails
        .find({ locationId: parseInt(req.query.locationId), status: true })
        .toArray((err, documents) => {
          res.send(documents);
        });
    } else {
      userDetails.find({ status: true }).toArray((err, documents) => {
        res.send(documents);
      });
    }
  });

  app.post("/AddUserDetails", (req, res) => {
    const order = req.body;
    userDetails.insertOne(order).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  app.put("/UpdateUserDetails", (req, res) => {
    const { email, name, group, groupId, location, locationId, phone, status } =
      req.body;
    console.log(req.body);
    userDetails
      .updateOne(
        { email: email },
        {
          $set: {
            name: name,
            group: group,
            groupId: groupId,
            locationId: locationId,
            location: location,
            phone: phone,
            status: status,
          },
        }
      )
      .then((result) => {
        // console.log(result.matchedCount)
        res.send(result);
      });
  });

  app.post("/GetUserDetails", (req, res) => {
    console.log(req?.body?.email);
    userDetails.find({ email: req.body.email }).toArray((err, documents) => {
      // console.log(documents,err)
      res.send(documents);
    });
  });

  app.post("/AddBloodDetails", (req, res) => {
    const order = req.body;
    bloodDetails.insertOne(order).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/FilterBloodDetails", (req, res) => {
    // console.log(typeof req?.query?.groupId);
    bloodDetails
      .find({ groupId: parseInt(req?.query?.groupId) })
      .toArray((err, documents) => {
        // console.log(documents,err)
        res.send(documents);
      });
  });

  app.get("/AllBloodDetails", (req, res) => {
    if (req?.query?.groupId && req?.query?.locationId) {
      // console.log(typeof req.query.groupId)
      bloodDetails
        .find({
          groupId: parseInt(req.query.groupId),
          locationId: parseInt(req.query.locationId),
        })
        .toArray((err, documents) => {
          res.send(documents);
        });
    } else if (req?.query?.groupId && !req?.query?.locationId) {
      bloodDetails
        .find({ groupId: parseInt(req.query.groupId) })
        .toArray((err, documents) => {
          res.send(documents);
        });
    } else if (!req?.query?.groupId && req?.query?.locationId) {
      bloodDetails
        .find({ locationId: parseInt(req.query.locationId) })
        .toArray((err, documents) => {
          res.send(documents);
        });
    } else {
      console.log("first");
      bloodDetails.find().toArray((err, documents) => {
        console.log(documents, err);
        res.send(documents);
      });
    }
  });
});


app.listen(process.env.PORT || port);
