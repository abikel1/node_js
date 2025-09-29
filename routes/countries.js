const express = require("express");
const { auth } = require("../middlewares/auth");
const { CountryModel, validCountry } = require("../models/countryModel");
const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const countries = await CountryModel.find({ user_id: req.tokenData.id });
        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", auth, async (req, res) => {
    const validBody = validCountry(req.body);
    if (validBody.error) return res.status(400).json(validBody.error.details);

    try {
        const country = new CountryModel(req.body);
        country.user_id = req.tokenData.id; // <-- id
        await country.save();
        res.status(201).json(country);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await CountryModel.deleteOne({
            _id: req.params.id,
            user_id: req.tokenData.id   // <-- id
        });

        if (deleted.deletedCount === 0) {
            return res.status(404).json({ msg: 'Country not found or not yours' });
        }
        res.json(deleted);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'err', err });
    }
});

router.put('/:id', auth, async (req, res) => {
    const validBody = validCountry(req.body);
    if (validBody.error) return res.status(400).json(validBody.error.details);

    try {
        const updated = await CountryModel.updateOne(
            { _id: req.params.id, user_id: req.tokenData.id }, // <-- id
            req.body
        );

        if (updated.matchedCount === 0) {
            return res.status(404).json({ msg: 'Country not found or not yours' });
        }
        res.json(updated);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'err', err });
    }
});



module.exports = router;