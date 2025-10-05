window.myNamespace = Object.assign({}, window.myNamespace, {  
    mySubNamespace: {  
        // Enables custom icons to be used as gauge markers
        pointToLayer: function(feature, latlng, context){
            const drop = L.icon({
                iconUrl: '/assets/Pepper.png',
                iconSize: [24, 44],  // Adjust the size as needed
                iconAnchor: [12, 44]  // Adjust the anchor point as needed
            });
            return L.marker(latlng, {icon: drop});
        },  

        // When hovering over a gauge, shows information about it
        stationHover: function(feature, layer, context) {
            console.log("stationHover function called");
            // Extract latitude and longitude
            const lat = feature.geometry.coordinates[1]; // Latitude
            const lng = feature.geometry.coordinates[0]; // Longitude
            
            // Bind the tooltip to display latitude and longitude
            layer.bindTooltip(`Lat: ${lat}, Lng: ${lng}`);
        },

                   
    }  
});
