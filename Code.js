// Load the Open Buildings dataset
var build_polygon = ee.FeatureCollection('GOOGLE/Research/open-buildings/v3/polygons');

// Load the Building Height dataset
var heightImage = ee.Image("JRC/GHSL/P2023A/GHS_BUILT_H/2018").select('built_height');

// Define ROI using bounding box: xmin, ymin, xmax, ymax
// Example coordinates (replace with your own)
var xmin = -70.25;
var ymin = -20.30;
var xmax = -70.05;
var ymax = -20.15;
var roi = ee.Geometry.Rectangle([xmin, ymin, xmax, ymax]);

// Filter buildings within ROI and with confidence ≥ 0.65
var filteredBuildings = build_polygon
  .filterBounds(roi)
  .filter(ee.Filter.gte('confidence', 0.65));
  
// Reduce raster height to each building polygon (max height within polygon)
var buildingHeights = heightImage.reduceRegions({
  collection: filteredBuildings,
  reducer: ee.Reducer.max(),
  scale: 1  // or 30 depending on resolution
});

// Export the result to Google Drive
Export.table.toDrive({
  collection: buildingHeights,
  description: 'Iquique',
  folder: 'GEE_exports',
  fileFormat: 'GeoJSON'
});
