module.exports = (req, res) => {
    const path = req.path.replace('.html', '')
    res.writeHead(302, { Location: path })
    res.end()
}