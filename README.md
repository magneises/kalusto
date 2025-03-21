# Kalusto - Stock Market Watchlist & Dashboard

Link to live site: https://kalusto-frontend.onrender.com/

API Routes
Stock Market API
GET	/api/stocks/:symbol	Get stock details
GET	/api/stocks/history/:symbol?range=1W	Get historical data
GET	/api/ticker	Get real-time stock updates

Watchlist API
GET	/api/watchlist/:userId	Fetch user watchlist
POST	/api/watchlist/:userId	Add stock to watchlist
DELETE	/api/watchlist/:userId/:symbol	Remove stock from watchlist
PUT	/api/watchlist/:userId/:symbol	Update stock note

General Resources
Stock ticker
https://blog.pixelfreestudio.com/how-to-implement-real-time-stock-tickers-in-web-applications/ 

Authentication and Authorization in React
https://medium.com/@ghimiresamana666/authentication-and-authorization-in-react-8fc76a496ba0

MPM jsonwebtoken docs
https://www.npmjs.com/package/jsonwebtoken



