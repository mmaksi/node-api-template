const fs = require("fs");
const colors = require("colors");
const { mongoConnect } = require("./services/mongo");
const bootcampsDatabase = require("./models/Bootcamp.mongo");
const courseDatabase = require("./models/Course.mongo");

// Connect to DB
mongoConnect();

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
// );

// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
// );

// Import into DB
async function importData() {
  try {
    await bootcampsDatabase.create(bootcamps);
    await courseDatabase.create(courses);
    // await User.create(users);
    // await Review.create(reviews);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

// Delete data
const deleteData = async () => {
  try {
    await bootcampsDatabase.deleteMany();
    await courseDatabase.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
