const { log } = require('console')
const crypto = require('crypto')

const router = require('express').Router()
const dns = require('dns')

const addressSet = new Map()

router.post("/shorturl", (req, res) => {
    try {
        let id
        dns.lookup(req.body.url, (err, address)=>{
            if(err) {
                console.log(err);
                return res.json({error: "Invalid URL"})
            }
            id = crypto.randomBytes(5).toString('hex')
            while(addressSet.has(id)){
                id = crypto.randomBytes(5).toString('hex')
            }
            addressSet.set(id, address)
            return res.json({original_url: req.body.url, short_url: id})
        }) 
        
    } catch (error) {
        console.log(error);
        return res.json({error: "Invalid URL"})
    }
    
})

module.exports =  router
