#Crawlr.io

**What?**

Application to create, share and review routes. In this first iteration, a route is a PubCrawl ([link](http://en.wikipedia.org/wiki/Pub_crawl)).

This is the proposed user flow:

- Land on Crawlr.io
- Give permissions for geolocation (if not, wateva)
- Click randomly on the map
- Click fired Google Places Radar Search (hardcoded for `types:bar` but can be changed)
- Click on found location brings up more info about the establishment
- If desired, the user will click `Add to Crawl` adding it to the current route
- If `route.length > 1` fire Google directions service (type: walking)
- Continue until satisfied
- Some mechanism to rearrange order is probably important

**Desired**

- Print.css to print and hand out the nights crawl
- Mobile view with dramatically reduced info density
  - Tap: "I've had my drink"
  - See: "Next bar is out the door and 200 meters to the right"
- Community Ratings and Discovery Mechanisms
- User accounts
- Social sharing before/during/after crawl
-  ???


**Build**:

- clone
- npm install
- grunt serve
- beer