var MongoClient = require("mongodb").MongoClient;
var assert = require('assert');
var Fiber = require('fibers');

var mongoUrl = 'mongodb://localhost:27017/mongobench';

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 22; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Fiber(function () {
    //connect
    var fiber = Fiber.current;
    var db;
    MongoClient.connect(mongoUrl, (err, dbCon) => {
        assert.equal(null, err);
        db = dbCon;
        fiber.run();
    });
    Fiber.yield();


    var Items = db.collection('items');


    // console.log('deleting')
    // fiber = Fiber.current;
    // Items.drop().then((data) => {
    //     fiber.run();
    // })
    // Fiber.yield();

    // //insert 10k with bobbington jones
    // console.log("Inserting 100k ")
    // var itemsToInsert = [];
    // for (var i = 0; i < 100000; ++i) {
    //     itemsToInsert.push({
    //         itemName: "bobbington jones",
    //         dumbo: makeid(),
    //         num: 44.4444,
    //         date: new Date(),
    //         obj: {
    //             test: makeid(),
    //             junk: "this is some funk"
    //         }
    //     })
    // }

    // fiber = Fiber.current;
    // Items.insertMany(itemsToInsert, (err, result) => {
    //     fiber.run();
    // });
    // Fiber.yield();

    // //insert 100k random
    // console.log("Inserting 1000k")
    // var itemsToInsert = [];
    // for (var i = 0; i < 1000000; ++i) {
    //     itemsToInsert.push({
    //         itemName: makeid(),
    //         dumbo: makeid(),
    //         num: 44.4444,
    //         date: new Date(),
    //         obj: {
    //             test: makeid(),
    //             junk: "this is some funk"
    //         }
    //     })
    // }

    // fiber = Fiber.current;
    // Items.insertMany(itemsToInsert, (err, result) => {
    //     fiber.run();
    // });
    // Fiber.yield();

    // //Create index
    console.log("creating index")
    var fiber = Fiber.current;
    Items.createIndex({
        dumbo: 1
    }).then((data) => {
        console.log(data)
        fiber.run();
    })
    Fiber.yield();

    console.log("creating index")
    var fiber = Fiber.current;
    Items.createIndex({
        "obj.test": 1
    }).then((data) => {
        console.log(data)
        fiber.run();
    })
    Fiber.yield();

    console.log("creating index")
    var fiber = Fiber.current;
    Items.createIndex({
        itemName: 1
    }).then((data) => {
        console.log(data)
        fiber.run();
    })
    Fiber.yield();

    var reverse = false;

    console.log('counting')
    var fiber = Fiber.current;
    Items.find({
        itemName: reverse ? "ableton momo mammy" : "bobbington jones"
    }).count().then((data) => {
        console.log("number is ", data)
        fiber.run();
    })
    Fiber.yield();



    //test update
    console.log("updating");
    console.time("update")
    var fiber = Fiber.current;
    Items.update({
        itemName: reverse ? "ableton momo mammy" : "bobbington jones"
    }, {
            $set: {
                itemName: reverse ? "bobbington jones" : "ableton momo mammy"
            }
        }, {
            multi: true
        }).then((data) => {
            console.log(data.result);
            fiber.run();
        });
    Fiber.yield();
    console.timeEnd("update");



    // Items.count().then((num) => {console.log(num)});

    db.close();
}).run();

