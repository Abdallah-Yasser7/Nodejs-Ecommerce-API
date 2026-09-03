const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const APIfeatures = require("../utils/apiFeatures");
const slugify = require("slugify");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError("Document not found", 404));
    }
    res.status(204).json({ message: "Document deleted successfully" });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const document = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!document) {
      return next(new ApiError("Document not found", 404));
    }

    //trigger the save middleware to recalculate average ratings and quantity
    await document.save();

    res
      .status(200)
      .json({ message: "Document updated successfully", data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const document = await Model.create(req.body);
    res
      .status(201)
      .json({ message: "Document created successfully", data: document });
  });

exports.getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    let query = Model.findById(id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const document = await query;

    if (!document) {
      return next(new ApiError("Document not found", 404));
    }
    res
      .status(200)
      .json({ data: document, message: "Document fetched successfully" });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    const modelCount = await Model.countDocuments();
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    // build query
    const apiFeatures = new APIfeatures(
      Model.find(filter),
      req.query,
    )
      .filter()
      .paginate(modelCount)
      .sort()
      .limitFields()
      .search();

    const { paginationResult, mongooseQuery } = apiFeatures;
    const documents = await mongooseQuery;
    res.status(200).json({
      results: documents.length,
      paginationResult: paginationResult,
      data: documents,
      message: "Documents fetched successfully",
    });
  });
