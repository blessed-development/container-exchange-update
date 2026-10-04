# Location hero image workflow

Each location page requires one unique, real, commercially usable or owner-supplied city photograph. Homepage card visuals are not landing-page hero images and must never be reused.

## Required standards

- WebP, approximately 1600–1920 pixels wide; target 150–300 KB and under 400 KB when practical.
- A real, recognizable skyline, waterfront, or metropolitan photograph for the exact market.
- No AI-generated images, watermarks, generic container yards, generic cranes, or reused photos.
- The key city landmark must remain visible under the dark left-to-right hero overlay.
- Combined markets use the primary city: Los Angeles / Long Beach → Los Angeles; Vancouver / Delta → Vancouver; New York / Newark → New York; San Francisco / Oakland → San Francisco; Worcester / Boston → Boston; Halifax / Dartmouth → Halifax.

## Adding and activating an image

1. Put the approved WebP at the exact path below.
2. Run `npm run locations:check` to confirm it exists and its registered path is unique.
3. Run `npm run locations:activate` to generate the status file. It activates only valid, unique WebP paths.
4. Verify the resulting page and commit the supplied image with the generated status change.

## Registry

| Location | Expected WebP path | Required subject / preferred landmark | Ready | Status |
| --- | --- | --- | --- | --- |
| Houston, TX | `/images/locations/houston-tx-hero.webp` | Houston skyline; downtown towers | Yes | Approved |
| Chicago, IL | `/images/locations/us/chicago-il-hero.webp` | Chicago skyline; Lake Michigan or Willis Tower | No | Missing |
| Toronto, ON | `/images/locations/canada/toronto-on-hero.webp` | Toronto skyline; CN Tower | No | Missing |
| Dallas, TX | `/images/locations/us/dallas-tx-hero.webp` | Dallas skyline; Reunion Tower or downtown | No | Missing |
| Montreal, QC | `/images/locations/canada/montreal-qc-hero.webp` | Montreal skyline or waterfront; Mount Royal | No | Missing |
| Savannah, GA | `/images/locations/us/savannah-ga-hero.webp` | Savannah riverfront or historic skyline | No | Missing |
| Vancouver / Delta, BC | `/images/locations/vancouver-delta-bc-hero.webp` | Vancouver skyline; harbour and mountains | No | Missing |
| Los Angeles / Long Beach, CA | `/images/locations/los-angeles-long-beach-ca-hero.webp` | Los Angeles skyline; downtown towers | Yes | Approved |
| Calgary, AB | `/images/locations/calgary-ab-hero.webp` | Calgary skyline; Bow River or tower cluster | No | Missing |
| Halifax / Dartmouth, NS | `/images/locations/halifax-dartmouth-ns-hero.webp` | Halifax waterfront or harbour skyline | No | Missing |
| Atlanta, GA | `/images/locations/atlanta-ga-hero.webp` | Atlanta skyline; downtown or Midtown | No | Missing |
| Charlotte, NC | `/images/locations/charlotte-nc-hero.webp` | Charlotte skyline; Uptown towers | No | Missing |
| Columbus, OH | `/images/locations/columbus-oh-hero.webp` | Columbus skyline; Scioto waterfront | No | Missing |
| El Paso, TX | `/images/locations/el-paso-tx-hero.webp` | El Paso skyline; Franklin Mountains | No | Missing |
| Kansas City, KS | `/images/locations/kansas-city-ks-hero.webp` | Kansas City skyline; downtown | No | Missing |
| Louisville, KY | `/images/locations/louisville-ky-hero.webp` | Louisville skyline; Ohio River | No | Missing |
| Mobile, AL | `/images/locations/mobile-al-hero.webp` | Mobile waterfront or skyline | No | Missing |
| Norfolk, VA | `/images/locations/norfolk-va-hero.webp` | Norfolk waterfront or skyline | No | Missing |
| Raleigh, NC | `/images/locations/raleigh-nc-hero.webp` | Raleigh skyline; downtown | No | Missing |
| Tampa, FL | `/images/locations/tampa-fl-hero.webp` | Tampa skyline; bayfront | No | Missing |
| Saskatoon, SK | `/images/locations/saskatoon-sk-hero.webp` | Saskatoon riverfront; bridges or skyline | No | Missing |
| Bakersfield, CA | `/images/locations/bakersfield-ca-hero.webp` | Bakersfield downtown or metropolitan aerial | No | Missing |
| Laredo, TX | `/images/locations/laredo-tx-hero.webp` | Laredo skyline; Rio Grande corridor | No | Missing |
| Memphis, TN | `/images/locations/memphis-tn-hero.webp` | Memphis skyline; Mississippi River | No | Missing |
| Nashville, TN | `/images/locations/nashville-tn-hero.webp` | Nashville skyline; downtown towers | No | Missing |
| Omaha, NE | `/images/locations/omaha-ne-hero.webp` | Omaha skyline; riverfront | No | Missing |
| Salt Lake City, UT | `/images/locations/salt-lake-city-ut-hero.webp` | Salt Lake City skyline; Wasatch Mountains | No | Missing |
| Seattle, WA | `/images/locations/seattle-wa-hero.webp` | Seattle skyline; Space Needle or waterfront | No | Missing |
| Temecula, CA | `/images/locations/temecula-ca-hero.webp` | Temecula city or valley aerial | No | Missing |
| Baltimore, MD | `/images/locations/baltimore-md-hero.webp` | Baltimore skyline; Inner Harbor | No | Missing |
| Cincinnati, OH | `/images/locations/cincinnati-oh-hero.webp` | Cincinnati skyline; Ohio River | No | Missing |
| Denver, CO | `/images/locations/denver-co-hero.webp` | Denver skyline; Rocky Mountains | No | Missing |
| Indianapolis, IN | `/images/locations/indianapolis-in-hero.webp` | Indianapolis skyline; Monument Circle | No | Missing |
| Las Vegas, NV | `/images/locations/las-vegas-nv-hero.webp` | Las Vegas skyline; Strip or downtown | No | Missing |
| Miami, FL | `/images/locations/miami-fl-hero.webp` | Miami skyline; Biscayne Bay | No | Missing |
| New Orleans, LA | `/images/locations/new-orleans-la-hero.webp` | New Orleans skyline; Mississippi River | No | Missing |
| Phoenix, AZ | `/images/locations/phoenix-az-hero.webp` | Phoenix skyline; desert mountains | No | Missing |
| San Antonio, TX | `/images/locations/san-antonio-tx-hero.webp` | San Antonio skyline; River Walk district | No | Missing |
| St. Louis, MO | `/images/locations/st-louis-mo-hero.webp` | St. Louis skyline; Gateway Arch | No | Missing |
| Wilmington, NC | `/images/locations/wilmington-nc-hero.webp` | Wilmington riverfront or skyline | No | Missing |
| Edmonton, AB | `/images/locations/edmonton-ab-hero.webp` | Edmonton skyline; river valley | No | Missing |
| Winnipeg, MB | `/images/locations/winnipeg-mb-hero.webp` | Winnipeg skyline; Forks riverfront | No | Missing |
| Charleston, SC | `/images/locations/charleston-sc-hero.webp` | Charleston waterfront; historic skyline | No | Missing |
| Cleveland, OH | `/images/locations/cleveland-oh-hero.webp` | Cleveland skyline; Lake Erie | No | Missing |
| Detroit, MI | `/images/locations/detroit-mi-hero.webp` | Detroit skyline; riverfront | No | Missing |
| Jacksonville, FL | `/images/locations/jacksonville-fl-hero.webp` | Jacksonville skyline; St. Johns River | No | Missing |
| Minneapolis, MN | `/images/locations/minneapolis-mn-hero.webp` | Minneapolis skyline; Mississippi River | No | Missing |
| New York / Newark, NY / NJ | `/images/locations/new-york-newark-ny-nj-hero.webp` | New York skyline; Manhattan landmarks | No | Missing |
| Portland, OR | `/images/locations/portland-or-hero.webp` | Portland skyline; Willamette River | No | Missing |
| San Francisco / Oakland, CA | `/images/locations/san-francisco-oakland-ca-hero.webp` | San Francisco skyline; Bay Bridge or waterfront | No | Missing |
| Tacoma, WA | `/images/locations/tacoma-wa-hero.webp` | Tacoma waterfront; Mount Rainier or skyline | No | Missing |
| Worcester / Boston, MA | `/images/locations/worcester-boston-ma-hero.webp` | Boston skyline; harbour or downtown | No | Missing |
| Regina, SK | `/images/locations/regina-sk-hero.webp` | Regina skyline; Wascana area | No | Missing |
