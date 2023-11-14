const { log } = require('console')
const crypto = require('crypto')

const router = require('express').Router()
const dns = require('dns')

const idUrlMap = new Map()
const urlIdMap = new Map()
let id = 0

router.post("/shorturl", (req, res) => {
    try {
        let { url: original_url } = req.body
        let url = new URL(original_url).origin
        url = url.replace(new RegExp("https*://"), "")
        if (urlIdMap.has(original_url)) return res.json({ original_url, short_url: urlIdMap.get(original_url) })

        dns.lookup(url, (err, address) => {
            if (err) {
                console.log(err);
                return res.json({ error: "Invalid URL" })
            }
            // id = crypto.randomBytes(5).toString('hex')
            // while (idUrlMap.has(id)) {
            //     id = crypto.randomBytes(5).toString('hex')
            // }
            id++
            idUrlMap.set(id, original_url)
            urlIdMap.set(original_url, id)
            console.log(idUrlMap);
            return res.json({ original_url, short_url: id })
        })

    } catch (error) {
        console.log(error);
        return res.json({ error: "Invalid URL" })
    }

})

router.get("/shorturl/:short", (req, res)=>{
    const { short } = req.params
    if(idUrlMap.has(id)) return res.redirect(idUrlMap.get(parseInt(short)))
    else return res.json({error:" Invalid shorturl"})
})

module.exports = router
