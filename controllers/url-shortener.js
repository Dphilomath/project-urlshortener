const { log } = require('console')
const crypto = require('crypto')

const router = require('express').Router()
const dns = require('dns')

const idUrlMap = new Map()
const urlIdMap = new Map()

router.post("/shorturl", (req, res) => {
    try {
        let id
        let { url: original_url } = req.body
        let url = original_url.replace(new RegExp("https*://"), "")
        if (urlIdMap.has(url)) return res.json({ original_url, short_url: urlIdMap.get(url) })

        dns.lookup(url, (err, address) => {
            if (err) {
                console.log(err);
                return res.json({ error: "Invalid URL" })
            }
            id = crypto.randomBytes(5).toString('hex')
            while (idUrlMap.has(id)) {
                id = crypto.randomBytes(5).toString('hex')
            }
            idUrlMap.set(id, url)
            urlIdMap.set(url, id)
            return res.json({ original_url, short_url: id })
        })

    } catch (error) {
        console.log(error);
        return res.json({ error: "Invalid URL" })
    }

})

router.get("/shorturl/:id", (req, res)=>{
    const { id } = req.params
    if(idUrlMap.has(id)) return res.redirect("http://"+idUrlMap.get(id))
    else return res.json({error:" Invalid shorturl"})
})

module.exports = router
