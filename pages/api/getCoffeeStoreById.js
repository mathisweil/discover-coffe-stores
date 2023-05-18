import { findRecordByFilter } from "@/lib/airtable";

const getCoffeeStoreById = async (req, res) => {
    const {id} = req.query;

    try {
        if(id) {
            const records = await findRecordByFilter(id);
            if(records.length !== 0) {
                res.status(200);
                res.json(records );
            } else {
                res.status(400);
                res.json({message: `id could not be found`});
            }
        } else {
            res.status(400);
            res.json({message: "id is missing"});
        }
        
    } catch(error) {
        res.status(500);
        res.json({message: "something went wrong (getById): ", error});
    }
}

export default getCoffeeStoreById;