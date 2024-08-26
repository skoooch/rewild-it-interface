# Dev Instructions

Download Expo Go app on IOS.

In apple settings, under the Expo Go settings, make sure **Local Network** is set to on.

From the root directory, run `npm install`.

Then, run `npx expo start --tunnel` to start the Metro Bundler.

Scan barcode on the your phone, and you will redirected to the Expo Go app where the app will be displayed.

**IMPORTANT**: Touch will only be activated in the app once you do a **three-finger, hard press** on the screen. I have no idea why, thats just how the dumb app works...

# rewild-it
Mobile application aimed to improve biodiversity in Toronto through volunteer rewilding initiatives.
# Our goal
Toronto is in a biodiversity crisis. Decades of rapid growth and economic expansion have coincided with the mass destruction of the city’s natural habitats. Toronto has fewer bird species, butterflies and bees today than ever before in history. Polling by Ipsos [(Young Canadians' Attitudes on Climate Change)](https://www.ipsos.com/sites/default/files/ct/news/documents/2021-10/CYACA%20Report%2020211004_0.pdf) has shown that threats to the environment/climate change ranks among the most important issues for young people in Canada. Despite this, 60% of young people feel that their generation is “not doing enough” to address the issue. Rewild.TO will empower young people to take action to improve biodiversity in their local community by organizing grassroots-led rewilding initiatives in every corner of the city.
This article [“Identifying urban rewilding opportunity spaces in a metropolis: Chongqing as an example - ScienceDirect”](https://www.sciencedirect.com/science/article/pii/S1470160X24002358) published this month in Ecological Indicators details the importance of identifying and acting upon urban rewilding projects. These rewilding initiatives can effectively target areas for restoration and conservation efforts, which not only enhances regional biodiversity and ecosystem health, but also contributes to sustainable regional development amidst rapid urbanization.
# Our idea
Our app will give residents the tools to identify, share and organize rewilding initiatives in their local community. Users will contribute to a layered map of Toronto, where regions with potential for rewilding can be marked with relevant photos and information. A discussion board will be created for each region so that users can discuss the best approaches for rewilding (what flowers, bird boxes, bee habitats etc) that are appropriate for the area’s wildlife needs. The map will be layered and color-coded for types of rewilding projects (e.g. blue for birdboxes, red for wildflower projects). Neighborhoods will also have notice boards where local events and initiatives can be shared.
# useful stuff
https://github.com/react-native-maps/react-native-maps
