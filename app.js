const express = require('express');
const app = express();

const expressIp = require('express-ip');
const device = require('express-device');
const fs = require('fs');
const converter = require('json2csv')
const fetch = require('node-fetch')


const port = 3299;

app.use(express.json());
app.use(expressIp().getIpInfoMiddleware);
app.use(device.capture());

const returnBasicInfo = (req, res) => {
    const time = new Date()
    const timeString = time.toLocaleTimeString()
    const dateString = time.toLocaleDateString()
    const ip = req.ipInfo
    const device = req.device.type;
    let location = ""
    let apiUrl = `http://api.ipstack.com/${ip}?access_key=d3ee74298708ab4255710e7ba6381638`

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => location = data.city);

    res.json({
        Time: timeString,
        Date: dateString,
        Device: device,
        Location: location
    })
}
const writeToFile = async(req, res) => {
   
    const time = new Date()
    const timeString = time.toLocaleTimeString()
    const dateString = time.toLocaleDateString()
    const ip = req.ipInfo
    const device = req.device.type;
   
    let apiUrl = `http://api.ipstack.com/${ip}?access_key=d3ee74298708ab4255710e7ba6381638` //! Does not work on local host

    const response = await fetch(apiUrl)
    const responseData = await response.json()
    const location = responseData.city
    const users = req.body
    const data = users.map(({name, username, interests}) => ({
        name, 
        username, 
        interests,
        time: timeString,
        date: dateString,
        device,
        location,
        }))

    const fields = ["name", "username", "interests", "time", "date", "device", "location"];

    const jsonParser = new converter.Parser({fields})
    try {
        const csv = jsonParser.parse(data)
        fs.appendFileSync('./users.csv', csv);
    }catch(err){
        console.error(err)
        res.status(500).send('Incorrect data format')
    }
    res.status(200).send(`successfully added users`)
}
const deleteUserFromFile = (req, res) => {
    const path = "./users.csv"
    const reqUsername = req.params.username

    if(!reqUsername){
        res.status(500).send(`user not specified`)
    }
    
       if(!fs.existsSync('./users.csv')){
          res.status(500).send( `${path} does not exist on server`)
       }else{
           fs.readFile(path, 'utf8', (err, data) => {

            const fields = ["name", "username", "interests", "time", "date", "device", "location"];
            //Creates an array of arrays to read change into an object
            const csvToArrays = data.split("\n").slice(1).map(line => line.split(','));
            //Creates objects to iterate over to filter out the requested username
            const buildObjects = csvToArrays.map(entry => {
                let obj = {}
                entry.forEach((value, key) => {
                    obj[fields[key]] = JSON.parse(value)
                })
                return obj
            })

            const filterUsername = buildObjects.filter(({username}) => username !== reqUsername)
            //converts the JSON back into csv format and writes the updated file
            const jsonParser = new converter.Parser({fields})
            try {
                const csv = jsonParser.parse(filterUsername)
                fs.writeFile(path, csv, (err) => {
                    if(err) throw err
                });
            }catch(err){
                console.error(err)
            
            }
            res.status(200).send(`successfully deleted ${reqUsername}`)
           });  
        }
}


app.get('/getData', returnBasicInfo)
app.post('/createUsers', writeToFile)
app.delete('/deleteUser/:username', deleteUserFromFile)

app.listen(port, (err) => {
    if(err){
        console.log(`${err} has occoured. Please try again`)
    }else{
        console.log(`App listening on Port: ${port}`)
    }
})