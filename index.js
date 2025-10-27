// STEP 1: Import the required packages
const mongoose = require("mongoose"); // Mongoose helps us talk to MongoDB easily
require("dotenv").config(); // Loads our secret MongoDB link from the .env file

// STEP 2: Connect to MongoDB Atlas using the URI from .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Helps Mongoose handle connection strings better
    useUnifiedTopology: true, // Makes connection stable
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ============================
// STEP 3: Create a Person Schema
// ============================
// Think of a schema like a blueprint of what each "person" should look like
const personSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Every person must have a name
  age: Number, // Age is optional
  favoriteFoods: [String], // An array (list) of favorite foods
});

// Create the model from the schema
// A model lets us interact with the "people" collection in MongoDB
const Person = mongoose.model("Person", personSchema);

// ============================
// STEP 4: Create and Save a Single Person
// ============================
function createAndSavePerson() {
  // We make a new person based on our schema
  const person = new Person({
    name: "Hellen", // Your name or any test name
    age: 22,
    favoriteFoods: ["Pizza", "Burger"],
  });

  // .save() actually saves this person into the database
  person.save((err, data) => {
    if (err) return console.error(err);
    console.log("✅ Person saved successfully:", data);
  });
}

// ============================
// STEP 5: Create Many People at Once
// ============================
function createManyPeople() {
  const arrayOfPeople = [
    { name: "Mary", age: 25, favoriteFoods: ["Rice", "Fish"] },
    { name: "John", age: 20, favoriteFoods: ["Burger", "Fries"] },
    { name: "Lucy", age: 30, favoriteFoods: ["Pasta", "Salad"] },
  ];

  // Model.create() allows saving multiple people at once
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return console.error(err);
    console.log("✅ Many people added:", data);
  });
}

// ============================
// STEP 6: Find People by Name
// ============================
function findPeopleByName(personName) {
  // Finds everyone who has the given name
  Person.find({ name: personName }, (err, data) => {
    if (err) return console.error(err);
    console.log(`✅ People named ${personName}:`, data);
  });
}

// ============================
// STEP 7: Find One Person by Favorite Food
// ============================
function findOneByFood(food) {
  // Finds one person who has this food in their favoriteFoods
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return console.error(err);
    console.log(`✅ Person who likes ${food}:`, data);
  });
}

// ============================
// STEP 8: Find a Person by Their ID
// ============================
function findPersonById(personId) {
  // Finds one person using their unique MongoDB _id
  Person.findById(personId, (err, data) => {
    if (err) return console.error(err);
    console.log("✅ Person found by ID:", data);
  });
}

// ============================
// STEP 9: Update Favorite Foods (Classic Method)
// ============================
function findEditThenSave(personId) {
  const foodToAdd = "Hamburger"; // What we want to add

  // First, find the person by ID
  Person.findById(personId, (err, person) => {
    if (err) return console.error(err);
    if (!person) return console.log("⚠️ Person not found");

    // Add the new food
    person.favoriteFoods.push(foodToAdd);

    // Save the updated document back to DB
    person.save((err, updatedData) => {
      if (err) return console.error(err);
      console.log("✅ Person updated successfully:", updatedData);
    });
  });
}

// ============================
// STEP 10: Find and Update Using findOneAndUpdate
// ============================
function findAndUpdate(personName) {
  const ageToSet = 20;

  // This updates one person’s age by their name
  Person.findOneAndUpdate(
    { name: personName }, // Find person by name
    { age: ageToSet }, // Set their age to 20
    { new: true }, // Return the updated version
    (err, data) => {
      if (err) return console.error(err);
      console.log("✅ Updated person:", data);
    }
  );
}

// ============================
// STEP 11: Delete One Person by ID
// ============================
function removeById(personId) {
  // This removes one document using its unique ID
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) return console.error(err);
    console.log("🗑️ Person deleted successfully:", data);
  });
}

// ============================
// STEP 12: Delete Many People by Name
// ============================
function removeManyPeople() {
  // Removes all documents where name = "Mary"
  Person.remove({ name: "Mary" }, (err, result) => {
    if (err) return console.error(err);
    console.log("🗑️ All Marys deleted:", result);
  });
}

// ============================
// STEP 13: Chain Query Helpers (Advanced but simple)
// ============================
// Find people who like burritos, sort alphabetically by name,
// limit results to 2, and hide the 'age' field
function chainSearch() {
  Person.find({ favoriteFoods: "burritos" })
    .sort("name")
    .limit(2)
    .select("-age") // The minus means hide the age field
    .exec((err, data) => {
      if (err) return console.error(err);
      console.log("✅ Chained search results:", data);
    });
}

// ============================
// STEP 14: Run one test at a time
// ============================
// Uncomment ONE function at a time to test it, then re-comment it after checking results.

// createAndSavePerson();
// createManyPeople();
// findPeopleByName("Mary");
// findOneByFood("Pizza");
// findPersonById("PUT_ID_HERE");
// findEditThenSave("PUT_ID_HERE");
// findAndUpdate("John");
// removeById("PUT_ID_HERE");
// removeManyPeople();
// chainSearch();
