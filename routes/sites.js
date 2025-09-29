const express = require('express');
const { SiteModel, validateSite } = require('../models/siteModel');
const router = express.Router();

router.get("/", async (req, res) => {
  let perPage = Math.min(20, parseInt(req.query.perPage)) || 2;
  let page = parseInt(req.query.page) || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse === "yes" ? 1 : -1;
  try {
    const sites = await SiteModel
      .find()
      .sort({ [sort]: reverse })
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// router.get('/', async (req, res) => {
//   try {

//     const sites = await SiteModel.find({});
//     res.json(sites);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: 'err', err });
//   }
// });

router.get('/:id', async (req, res) => {
  try {
    const site = await SiteModel.findById(req.params.id);
    if (!site) return res.status(404).json({ msg: 'Site not found' });
    res.json(site);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'err', err });
  }
});

router.post('/', async (req, res) => {
  const validBody = validateSite(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let site = new SiteModel(req.body);
    await site.save();
    res.status(201).json(site);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'err', err });
  }
});

router.put('/:id', async (req, res) => {
  const validBody = validateSite(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let data = await SiteModel.updateOne({ _id: req.params.id }, req.body);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'err', err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await SiteModel.deleteOne({ _id: req.params.id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'err', err });
  }
});

module.exports = router;