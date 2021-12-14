import mongoose from "mongoose";

const db = mongoose.connection;
var collectionName = "accidents";
var collection = db.collection(collectionName);

export const getAccidents = async (req, res) => {
    try {
        collection.find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
    catch (err) {
        res.json({
            message: err
        });
    }
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

        try {
            collection.insertMany(dataToInsert, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Inserted documents into the collection");
                }
            });
        }
        catch (err) {
            res.json({
                message: err
            });
        }

    });
}

export const deleteAllData = async (req, res) => {
    collection.deleteMany().then(() => {
        res.json({
            message: "All data deleted"
        });
    });
}

export const deleteAccidentRow = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        collection.deleteOne({ accident_index: id }).then(() => {
            res.json({
                message: "accident deleted"
            });
        });
    }
    catch (err) {
        res.json({
            message: "err"
        });
    }
}

export const updateAccidentRow = async (req, res) => {
    const { id } = req.params;
    const {
        location_easting_osgr,
        location_northing_osgr,
        longitude,
        latitude,
        police_force,
        accident_severity,
        number_of_vehicles,
        number_of_casualties,
        date,
        day_of_week,
        time,
        local_authority_district,
        local_authority_highway,
        first_road_class,
        road_type,
        speed_limit,
        junction_detail,
        junction_control,
        second_road_class,
        pedestrian_crossing_human_control,
        pedestrian_crossing_physical_facilities,
        light_conditions,
        weather_conditions,
        road_surface_conditions,
        special_conditions_at_site,
        carriageway_hazards,
        urban_or_rural_area,
        did_police_officer_attend_scene_of_accident,
        lsoa_of_accident_location,
    } = req.body;

    try {
        collection.updateOne({ accident_index: id }, {
            $set: {
                location_easting_osgr,
                location_northing_osgr,
                longitude,
                latitude,
                police_force,
                accident_severity,
                number_of_vehicles,
                number_of_casualties,
                date,
                day_of_week,
                time,
                local_authority_district,
                local_authority_highway,
                first_road_class,
                road_type,
                speed_limit,
                junction_detail,
                junction_control,
                second_road_class,
                pedestrian_crossing_human_control,
                pedestrian_crossing_physical_facilities,
                light_conditions,
                weather_conditions,
                road_surface_conditions,
                special_conditions_at_site,
                carriageway_hazards,
                urban_or_rural_area,
                did_police_officer_attend_scene_of_accident,
                lsoa_of_accident_location,
            }
        }).then(() => {
            res.json({
                message: "accident updated"
            });
        });
    }
    catch (err) {
        res.json({
            message: "err"
        });
    }
};

export const getAccident = async (req, res) => {
    const { id } = req.params;

    try {
        const accident = await collection.find({ accident_index: id }).toArray();
        res.status(201).json(accident);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}