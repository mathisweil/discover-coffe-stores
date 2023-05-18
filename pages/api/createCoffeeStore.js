import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";

const createCoffeeStore = async (req, res) => {
    
    if(req.method === 'POST') {

        const {id, name, address, neighbourhood, votes, imgUrl} = req.body;
        
        try {
            if(id) {
                const records = await findRecordByFilter(id);
                if(records.length !== 0) {
                    res.status(200);
                    res.json(records );
                } else {
                    if(name) {
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    neighbourhood,
                                    votes,
                                    imgUrl
                                },
                            },
                        ]);
                        const records = getMinifiedRecords(createRecords);
                        res.status(200);
                        res.json(records);
                    } else {
                        res.status(400);
                        res.json({message: "Name is missing"});
                    }
                }
            } else {
                res.status(400);
                res.json({message: "Id is missing"});
            }
        } catch(error) {
            res.status(500);
            res.json({message: "Something went wrong: ", error})
        }
    } else {
        res.status(500);
        res.json({message: "get method"})
    }
}

export default createCoffeeStore;