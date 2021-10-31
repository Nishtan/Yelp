const express = require('express')
const app = express()
const path = require('path');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const mongoose = require('mongoose');
const Campground = require("../models/campground")
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Open!!");

    }).catch((er) => {
        console.log("erorr 404");

    });
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20)+10
        const camp = new Campground({
            author:"617ae20c78d8ee91c70fcd4d",
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)}  ${sample(places)}`,
            geometry: { type: 'Point', coordinates: [ `${cities[random1000].longitude}`, `${cities[random1000].latitude}` ] },
            images: [
                {
                  url: 'https://res.cloudinary.com/djhcnbsvg/image/upload/v1635580313/YelpCamp/kvecrsvzti2ib9uuxqay.jpg',
                  filename: 'YelpCamp/kvecrsvzti2ib9uuxqay',
                }
              ],
            
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti soluta dolores expedita ad praesentium dolor minima rerum quo sed inventore ipsum nulla, quaerat ipsa quidem nesciunt nostrum. Vitae, dicta tenetur?",
            price:price
        })
        await camp.save()
    }
}
seedDb().then(() => { mongoose.connection.close() }
)