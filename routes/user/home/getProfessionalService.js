import Joi from "joi";
import { getAggregate, insertNewDocument } from "../../../helpers/index.js";

import mongoose from "mongoose";

const schema = Joi.object({
  categoryId: Joi.string().required(),
  subCategorieId: Joi.string().required(),
  servieType: Joi.string().required(),
});

const getProfessionalService = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { categoryId, subCategorieId, servieType } = req.query;
console.log(req.query,"query");

    const proService = await getAggregate("proCategory", [
      {
        $match: { categoryId: new mongoose.Types.ObjectId(categoryId) }, // Match categoryId
      },
      {
        $project: {
          _id: 1,
          proId: 1,
          rating: 1,
          categoryId: 1,
          subCategories: {
            $filter: {
              input: "$subCategories",
              as: "sub",
              cond: {
                $and: [
                  {
                    $eq: [
                      "$$sub.id",
                      new mongoose.Types.ObjectId(subCategorieId),
                    ],
                  }, // Match subCategorieId
                  { $eq: [`$$sub.${servieType}`, true] }, // Check if serviceType is true
                ],
              },
            },
          },
        },
      },
      {
        $match: { "subCategories.0": { $exists: true } }, // Ensure at least one matching subCategory exists
      },
      {
        $lookup: {
          from: "users", // Join with users collection
          localField: "proId",
          foreignField: "_id",
          as: "proDetails",
        },
      },
      {
        $unwind: { path: "$proDetails", preserveNullAndEmptyArrays: true }, // Flatten user details
      },
      {
        $group: {
          _id: "$_id", // Group by proId (unique results)
          proId: { $first: "$proId" }, // Keep first occurrence of proId
          rating: { $first: "$rating" }, // Keep first occurrence of rating
          avgRating: { $first: "$avgReviewsPro" }, // Keep first occurrence of rating
          first_Name: { $first: "$proDetails.first_Name" }, // First occurrence of first_Name
          last_Name: { $first: "$proDetails.last_Name" }, // First occurrence of last_Name
        },
      },
      {
        $project: {
          _id: 1, // Remove _id from output
          proId: 1,
          rating: 1,
          avgRating:1,
          first_Name: 1,
          last_Name: 1,
        },
      },
    ]);

console.log(proService,"proservice");


    if (!proService || proService == 0) {
      return res
        .status(400)
        .json({ status: 400, message: "No professionals available for the selected service" });
    }

   

    return res.status(200).json({ status: 200, proService });
  } catch (e) {
    console.log("error");
    
    return res.status(400).json({ status: 400, message: e.message });
  }
};

export default getProfessionalService;
