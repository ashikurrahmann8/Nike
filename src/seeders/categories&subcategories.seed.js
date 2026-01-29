import mongoose from "mongoose";
import { MONGO_URI } from "../constants/constants.js";
import { Category } from "../models/catagory.model.js";
import { Subcategory } from "../models/subcategory.model.js";
import { imageSeed } from "./image.seed.js";

const seedData = [
  {
    name: "Food",
    slug: "food",
    image: { url: "", public_id: "" },
    subcategories: [
      { name: "Groceries", slug: "groceries", image: { url: "", public_id: "" } },
      { name: "Restaurants", slug: "restaurants", image: { url: "", public_id: "" } },
      { name: "Snacks & Drinks", slug: "snacks-drinks", image: { url: "", public_id: "" } },
    ],
  },

  {
    name: "Transport",
    slug: "transport",
    image: { url: "", public_id: "" },
    subcategories: [
      { name: "Fuel", slug: "fuel", image: { url: "", public_id: "" } },
      { name: "Public Transport", slug: "public-transport", image: { url: "", public_id: "" } },
      { name: "Ride Sharing", slug: "ride-sharing", image: { url: "", public_id: "" } },
    ],
  },
];

// {
//     name: "Housing",
//     slug: "housing",
//     image: { url: "", public_id: "" },
//     subcategories: [
//       { name: "Rent", slug: "rent", image: { url: "", public_id: "" } },
//       { name: "Utilities", slug: "utilities", image: { url: "", public_id: "" } },
//       { name: "Maintenance", slug: "maintenance", image: { url: "", public_id: "" } },
//     ],
//   },

//   {
//     name: "Health",
//     slug: "health",
//     image: { url: "", public_id: "" },
//     subcategories: [
//       { name: "Medical Bills", slug: "medical-bills", image: { url: "", public_id: "" } },
//       { name: "Medicine", slug: "medicine", image: { url: "", public_id: "" } },
//       { name: "Health Insurance", slug: "health-insurance", image: { url: "", public_id: "" } },
//     ],
//   },

//   {
//     name: "Entertainment",
//     slug: "entertainment",
//     image: { url: "", public_id: "" },
//     subcategories: [
//       { name: "Streaming Service", slug: "streaming-service", image: { url: "", public_id: "" } },
//       { name: "Movies & Shows", slug: "movies-shows", image: { url: "", public_id: "" } },
//       { name: "Games & Apps", slug: "games-apps", image: { url: "", public_id: "" } },
//     ],
//   },

//   {
//     name: "Personal Care",
//     slug: "personal-care",
//     image: { url: "", public_id: "" },
//     subcategories: [
//       { name: "Salon", slug: "salon", image: { url: "", public_id: "" } },
//       { name: "Cosmetics", slug: "cosmetics", image: { url: "", public_id: "" } },
//       { name: "Fitness", slug: "fitness", image: { url: "", public_id: "" } },
//     ],
//   },

//   {
//     name: "Education",
//     slug: "education",
//     image: { url: "", public_id: "" },
//     subcategories: [
//       { name: "Tuition Fees", slug: "tuition-fees", image: { url: "", public_id: "" } },
//       { name: "Books & Supplies", slug: "books-supplies", image: { url: "", public_id: "" } },
//       { name: "Online Courses", slug: "online-courses", image: { url: "", public_id: "" } },
//     ],
//   },

//   {
//     name: "Shopping",
//     slug: "shopping",
//     image: { url: "", public_id: "" },
//     subcategories: [
//       { name: "Clothing", slug: "clothing", image: { url: "", public_id: "" } },
//       { name: "Electronics", slug: "electronics", image: { url: "", public_id: "" } },
//       { name: "Household Items", slug: "household-items", image: { url: "", public_id: "" } },
//     ],
//   },

//   {
//     name: "Travel",
//     slug: "travel",
//     image: { url: "", public_id: "" },
//     subcategories: [
//       { name: "Flights", slug: "flights", image: { url: "", public_id: "" } },
//       { name: "Hotels", slug: "hotels", image: { url: "", public_id: "" } },
//       { name: "Tours", slug: "tours", image: { url: "", public_id: "" } },
//     ],
//   },

//   {
//     name: "Others",
//     slug: "others",
//     image: { url: "", public_id: "" },
//     subcategories: [
//       { name: "Charity", slug: "charity", image: { url: "", public_id: "" } },
//       { name: "Gifts", slug: "gifts", image: { url: "", public_id: "" } },
//       { name: "Miscellaneous", slug: "miscellaneous", image: { url: "", public_id: "" } },
//     ],
//   }

export async function seedCategories() {
  await mongoose.connect(MONGO_URI);
  console.log("DB connected");

  await Category.deleteMany({});
  await Subcategory.deleteMany({});

  const imageSeedData = await imageSeed();
  imageSeedData.forEach((image) => {
    seedData.forEach((category) => {
      if (category.name === image.original_filename) {
        category.image.url = image.url;
        category.image.public_id = image.public_id;
      } else {
        category.subcategories.map((subcategory) => {
          if (subcategory.name === image.original_filename) {
            subcategory.image.url = image.url;
            subcategory.image.public_id = image.public_id;
          }
        });
      }
    });
  });
  console.log("Image seeding done");
  for (const item of seedData) {
    const category = await Category.create({
      name: item.name,
      slug: item.slug,
      image: item.image,
    });

    const subcategories = item.subcategories.map((sub) => ({
      ...sub,
      category: category._id,
    }));
    console.log("Sub 1");

    await Subcategory.insertMany(subcategories);

    console.log("Sub 2");
  }
  console.log("Categories seeded successfully");
}  

