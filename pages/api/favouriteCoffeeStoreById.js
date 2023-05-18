import { table, findRecordByFilter, getMinifiedRecords } from "@/lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
    if(req.method === 'PATCH') {
        const {id} = req.body;

        try {
            if(id) {
                const records = await findRecordByFilter(id);
                if(records.length !== 0) {
                    const record = records[0];
                    const calculateVotes = parseInt(record.votes) + 1;
                    const updateRecord = await table.update([
                        {
                            id: record.recordId,
                            fields: {
                                votes: calculateVotes
                            }
                        }
                    ])

                    if(updateRecord) {
                        const minifiedRecord = getMinifiedRecords(updateRecord);
                        res.status(200);
                        res.json(minifiedRecord);
                    } else {
                        res.status(400);
                        res.json({message: "Couldn't update record"});
                    }
                } else {
                    res.status(400);
                    res.json({message: `id could not be found: ${id}`});
                }
            } else {
                res.status(400);
                res.json({message: "id is missing"});
            }
        } catch(error) {
            res.status(400);
            res.json({message: "Error upvoting", error});
        }
    } else {
        res.status(500);
        res.json({message: "wrong method"});
    }
    
}

export default favouriteCoffeeStoreById;