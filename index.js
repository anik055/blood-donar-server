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

// const uri =
//   "mongodb+srv://emaJhon:emajhoncommerce@cluster0.rzm4j.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority";
const uri =
  "mongodb+srv://eBachelor:3ApXHf3IoUtd5zGI@cluster0.rzm4j.mongodb.net/bachelorCommerce?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("err",err);
  const productsCollection = client
    .db("bachelorCommerce")
    .collection("products");
  const ordersCollection = client.db("bachelorCommerce").collection("orders");
  const packageCollection = client.db("bachelorCommerce").collection("package");
  const cartCollection = client.db("bachelorCommerce").collection("cart");
  const adminCollection = client.db("bachelorCommerce").collection("admin");
  const reviewCollection = client.db("bachelorCommerce").collection("reviews");
  const newOrderCollection = client.db("bachelorCommerce").collection("newOrder");
  const bloodDetails = client.db("blood-donation").collection("bloodDetails");
  const userDetails = client.db("blood-donation").collection("userDetails");

app.post("/AddUserDetails", (req, res) => {
  const order = req.body;
  userDetails.insertOne(order).then((result) => {
    console.log(result);
    res.send(result.insertedCount > 0);
  });
});

  app.put("/UpdateUserDetails", (req, res) => {
   const {email, name, group, groupId, location, locationId, phone} = req.body

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
            phone:phone
          },
        }
      )
      .then((result) => {
        console.log(result, 'resulllllllllllllllllllllllllllllllllll');
      });
  });

  app.post("/GetUserDetails", (req, res) => {
    console.log(req?.body?.email);
    userDetails
      .find({email:req.body.email  })
      .toArray((err, documents) => {
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
    }
    else if (req?.query?.groupId && !req?.query?.locationId) {
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
      bloodDetails.find().toArray((err, documents) => {
        res.send(documents);
      });
    }
  });

    app.patch("/update/:id", (req, res) => {
      console.log(req.params.id);
      ordersCollection
        .updateOne(
          { _id: ObjectID(req.params.id) },
          {
            $set: { status: req.body.status },
          }
        )
        .then((result) => {
          console.log(result);
        });
    });

    app.post("/addOrder", (req, res) => {
      const order = req.body;
      ordersCollection.insertOne(order).then((result) => {
        res.send(result.insertedCount > 0);
      });
    });

  app.post("/addAdmin", (req, res) => {
    const email = req.body;
    adminCollection.insertOne(email).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/orders", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.post("/ordersByUser", (req, res) => {
    const email = req.body.email;
    console.log(email);
    ordersCollection.find({ email: email }).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email }).toArray((err, doctors) => {
      // console.log(doctors);
      res.send(doctors.length > 0);
    });
  });

  app.post("/appointmentsByDate", (req, res) => {
    const date = req.body;
    const email = req.body.email;
    ordersCollection.find({ email: email }).toArray((err, doctors) => {
      const filter = { date: date.date };
      if (doctors.length === 0) {
        filter.email = email;
      }
      orderCollection.find(filter).toArray((err, documents) => {
        res.send(documents);
      });
    });
  });
  app.post("/addReview", (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const location = req.body.location;
    reviewCollection
      .insertOne({ name, location, description })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  app.post("/addAPackage", (req, res) => {
    const file = req.files.file;
        const name = req.body.name;
        const description = req.body.description;
        const price = req.body.price;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        packageCollection.insertOne( {name, price, description, image})
            .then(result => {
                res.send(result.insertedCount > 0);
            })
  });

  app.get("/packages", (req, res) => {
    packageCollection.find({}).toArray((err, documents) => {
      res.send(documents);
      console.log(documents);
    });
  });

  app.get("/reviews", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addToOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("/deleteOldOrder", (req, res) => {
    const id = ObjectID(req.params.id);
    newOrderCollection.deleteMany().then((documents) => {
      console.log(document);
      res.send(!!documents.value);
    });
  });

  app.get("/newOrder", (req, res) => {
    newOrderCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addNewOrder", (req, res) => {
    const order = req.body;
    console.log(order);
    newOrderCollection.insertOne(order).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    packageCollection.findOneAndDelete({ _id: id }).then((documents) => {
      res.send(!!documents.value);
    });
  });
});

app.listen(process.env.PORT || port);