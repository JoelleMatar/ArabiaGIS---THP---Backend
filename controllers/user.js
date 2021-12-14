import mongoose from "mongoose";
import { response } from "express";
import User from "../models/user.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = "secret";
import csvtojson from "csvtojson";

export const signup = async (req, res) => {
    var { username, email, password } = req.body;

    console.log(req.body);

    if (!username || !email || !password) {
        res.status(400).send("Please enter all the fields");
    }

    bycrypt.hash(password, 10)
        .then(hashedpassword => {
            User.findOne({ email: email })
                .then(user => {
                    if (user) {
                        res.status(400).send("User already exists");
                    } else {
                        const newUser = new User({
                            username,
                            email,
                            password: hashedpassword
                        });
                        newUser.save()
                            .then(user => {
                                const token = jwt.sign({ id: user._id }, JWT_SECRET)
                                res.json({ token: token, message: "Registered successfully" });
                            })
                            .catch(err => {
                                res.status(400).send(err);
                            })
                    }
                }).catch((err) => {
                    console.log(err)
                })
        });
};

export const signin = async (req, res) => {
    var { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send("Please enter all the fields")
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.status(400).send("User does not exist")
            }
            bycrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        res.status(400).send("Invalid Credentials")
                    }
                    const token = jwt.sign({ id: user._id }, JWT_SECRET)
                    res.json({ token: token, message: "Logged in successfully" });
                })
        });
}

export const getUsers = async (req, res) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(400).send(err);
        })
}

export const importData = async (req, res) => {
    const fileName = "D:/joelle/ArabiaGIS/Accidents0515.csv";

    var dataToInsert = [];
    csvtojson().fromFile(fileName).then(async (jsonObj) => {
        for (var i = 0; i < jsonObj.length; i++) {
            var oneRow = {
                accident_index: jsonObj[i]["Accident_Index"],
                location_easting_osgr: jsonObj[i]["Location_Easting_OSGR"],
                location_northing_osgr: jsonObj[i]["Location_Northing_OSGR"],
                longitude: jsonObj[i]["Longitude"],
                latitude: jsonObj[i]["Latitude"],
                police_force: jsonObj[i]["Police_Force"],
                accident_severity: jsonObj[i]["Accident_Severity"],
                number_of_vehicles: jsonObj[i]["Number_of_Vehicles"],
                number_of_casualties: jsonObj[i]["Number_of_Casualties"],
                date: jsonObj[i]["Date"],
                day_of_week: jsonObj[i]["Day_of_Week"],
                time: jsonObj[i]["Time"],
                local_authority_district: jsonObj[i]["Local_Authority_(District)"],
                local_authority_highway: jsonObj[i]["Local_Authority_(Highway)"],
                first_road_class: jsonObj[i]["1st_Road_Class"],
                road_type: jsonObj[i]["Road_Type"],
                speed_limit: jsonObj[i]["Speed_limit"],
                junction_detail: jsonObj[i]["Junction_Detail"],
                junction_control: jsonObj[i]["Junction_Control"],
                second_road_class: jsonObj[i]["2nd_Road_Class"],
                pedestrian_crossing_human_control: jsonObj[i]["Pedestrian_Crossing-Human_Control"],
                pedestrian_crossing_physical_facilities: jsonObj[i]["Pedestrian_Crossing-Physical_Facilities"],
                light_conditions: jsonObj[i]["Light_Conditions"],
                weather_conditions: jsonObj[i]["Weather_Conditions"],
                road_surface_conditions: jsonObj[i]["Road_Surface_Conditions"],
                special_conditions_at_site: jsonObj[i]["Special_Conditions_at_Site"],
                carriageway_hazards: jsonObj[i]["Carriageway_Hazards"],
                urban_or_rural_area: jsonObj[i]["Urban_or_Rural_Area"],
                did_police_officer_attend_scene_of_accident: jsonObj[i]["Did_Police_Officer_Attend_Scene_of_Accident"],
                lsoa_of_accident_location: jsonObj[i]["LSOA_of_Accident_Location"],
            };
            dataToInsert.push(oneRow);
        }

        var collectionName = "accidents";
        var collection = mongoose.connection.db.collection(collectionName);
        collection.insertMany(dataToInsert, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Inserted documents into the collection");
            }
        });
    });
}