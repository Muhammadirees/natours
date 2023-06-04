
export const displayMap = (locations) => {
   mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW1tYWRpZHJlZXMiLCJhIjoiY2xoNHk3ZzJzMDQ3dzNybXkwbjdrdXcxOSJ9.pL_YSW5lZiUvXhopXVOlGw';
   const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/muhammadidrees/clh52zt0f00qh01qy5xymcu78', // style URL
      scrollZoom: false,
      // center: [-118.113491, 34.111745], // starting position [lng, lat]
      // zoom: 9, // starting zoom
      // interactive: false
   });

   const bounds = new mapboxgl.LngLatBounds()

   locations.forEach(loc => {
      // Create marker
      const el = document.createElement('div')
      el.className = 'marker';

      // Add marker
      new mapboxgl.Marker({
         element: el,
         anchor: 'bottom'
      })
         .setLngLat(loc.coordinates)
         .addTo(map)

      // Add popup
      new mapboxgl.Popup({
         offset: 20
      })
         .setLngLat(loc.coordinates)
         .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
         .addTo(map)

      //Extends map bounds to include current locations
      bounds.extend(loc.coordinates)

   })
   map.fitBounds(bounds, {
      padding: {
         top: 200,
         bottom: 150,
         left: 100,
         right: 100
      }
   })
}