require('dotenv')
  .config({
    path: `./lib/config/${process.env.NODE_ENV}.env`
  })

const app = require('./lib/app')
const port = process.env.PORT || 3000
app.listen(port)
