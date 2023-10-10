import MongoConnection from "./MongoConnection.mjs";
import express  from "express";
import workerpool from 'workerpool';
const pool = workerpool.pool('./totalThread.mjs'); //link to file containing thread registration im pool 
const app = express();
const port = process.env.port || 8181;
const server = app.listen(port);
server.on('listening', () => console.log(`server is listening on port ${port}; processId: ${process.pid}`));
const dbConnection = new MongoConnection(`mongodb+srv://root:${process.env.MONGO_PASSWORD}@cluster0.axdldgw.mongodb.net/college?retryWrites=true&w=majority`, 'college');
const studentsCollection = dbConnection.getCollection("students");

app.get('/performance/total', (req,res) => {
    const count = +req.query.count;
    pool.exec("total", [count], {
        on: payload => {
            if(payload.event == 'partition' ) {
                res.write(payload.data + '\n');
                console.log(payload.data);
            } else {

                res.end(JSON.stringify(payload.data));
            }     
        }
    })
    
});
app.get('/performance/students', async (req, res) => {
    const startTime = new Date();
    const students = await studentsCollection.find({}).toArray();
    res.send({pid: process.pid, api: 'node', total: students.length, time: new Date().getTime() - startTime.getTime()});
})
