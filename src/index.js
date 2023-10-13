
let __version__ = "0.0.2"
// Global Values!
let globalMap = void 0;
let JapanCitysLeafletData = void 0;
let japanCitys = void 0;

let Maingeo = void 0;
let JapanLeafletData = void 0;

let STATE = 0

window.onload = () => {
    MapInit()
}



function MapInit () {
    var map = L.map('main', {
        center : [37.9161 , 139.0364],
        zoom: 7,
        minZoom: 5.5,
        maxZoom: 9,
        preferCanvas:true
    })
    globalMap = map

        fetch("../src/geojson/Cities.json").then(r => r.ok ? r.json() : null).then(geojson => {
            const japanCitysGeo = L.geoJSON(geojson, {
                style : function(geojson) {
                    return {
                        weight : 0.3,
                        color: "#999999",
                        fillColor : "#081a1a"
                    }
                }
            }).addTo(map)
            JapanCitysLeafletData = japanCitysGeo
            japanCitys = geojson
        })
        
        fetch("../src/geojson/japan.json").then(r => r.ok ? r.json() : null).then(geojson => {
            const japanCitysGeo = L.geoJSON(geojson, {
                style : function(geojson) {
                    return {
                        weight : 1,
                        color: "#999999",
                        fillColor : "#081a1a"
                  }
                }
            }).addTo(map)

            Maingeo = geojson
            JapanLeafletData = japanCitysGeo
        })

        
        const elem = document.getElementsByClassName('leaflet-right')
        if (0 < elem.length) {
            [...elem].forEach(v => { return v.remove() })
        }
       //
       const button = document.getElementsByClassName('leaflet-control-zoom')
       if (0 < button.length) {
           [...button].forEach(v => { return v.remove() })
       }

        STATE = 1

        DisplayWarning()
        console.log(`Version ${__version__}`)
}