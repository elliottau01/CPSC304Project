const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-party-demotable", async (req, res) => {
    const { name, newParty } = req.body;
    console.log(req.body);
    const updateResult = await appService.updateNameDemotable(name, newParty);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } 
    else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});

router.post("/insert-Candidate-Party", async (request, response) => {
    const {name, party} = request.body;
    const insertResult = await appService.insertDemotable(name, party);
   if(insertResult){
        response.json({success: true});
    }
    else{
        response.status(500).json({success: false});
    }
})

router.post("/delete-party-demotable", async(request, response) => {
    const {name} = request.body;
    const deleteResult = await appService.deleteFromDemotable(name);
    if(deleteResult){
        response.json({success:true});
    }
    else{
        response.status(500).json({success: false})
    }
})

router.post("/initializeDB", async (request, response) => {
    const result = await appService.initializeDB();
    if(result){
        response.json({success:true});
    }
    else{
        response.status(500).json({success: false})
    }
})

router.post("/projection", async (request, response) => {
    const {query} = request.body;
    const result = await appService.projectDB(query);
    response.json = ({data: result});
})

router.post("/join", async (request,  response) => {
    const {name} = request.body;
    const result = await appService.joinDB(name);
    response.json = ({data: result});
})

router.get("/groupBy", async (request, response) => {
    const result = await appService.groupByDB();
    response.json = ({data: result});
})

router.get("/having", async (request, response) => {
    const result = await appService.havingDB();
    response.json = ({data: result});
})

router.get("/nestedGroupBy", async (request, response) => {
    const result = await appService.nestedGroupByDB();
    response.json = ({data: result});
})

router.get("/division", async (request, response) => {
    const result = await appService.divisionDB();
    response.json = ({data: result});
})
module.exports = router;