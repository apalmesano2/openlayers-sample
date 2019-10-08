<template>
  <main>
    <div class="text-center py-2">
      <v-btn color="primary" @click="toggleSarpyOutline()">Toggle Overlay</v-btn>
      <v-btn color="primary" @click="toggleCalls()">Toggle Clusters</v-btn>
      <v-btn color="warning" @click="heatmapExample()">Heat Map Example</v-btn>
      <v-btn color="primary" @click="changeToOSM()">View Street Map</v-btn>
      <v-btn color="primary" @click="changeToImagery()">View Imagery</v-btn>
    </div>
    <hr />
    <div id="map" class="map mx-auto mt-2"></div>
    <v-container class="legend mt-2 mx-auto text-center">
      <v-row>
        <v-col class="py-0">
          <div class="fire">Fire</div>
        </v-col>
        <v-col></v-col>
        <v-col class="py-0">
          <div class="ems">EMS</div>
        </v-col>
        <v-col></v-col>
        <v-col class="py-0">
          <div class="pc">Property Crime</div>
        </v-col>
        <v-col></v-col>
        <v-col class="py-0">
          <div class="vc">Violent Crime</div>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>
<script>
import Map from "ol/Map.js";
import View from "ol/View.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { Cluster, OSM, Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Stroke, Style, Circle as CircleStyle, Text } from "ol/style";
import KML from "ol/format/KML";
import BingMaps from "ol/source/BingMaps";

// base map
const baseView = new View({
  projection: "EPSG:4326",
  center: [-96.1, 41.1],
  zoom: 11,
  zIndex: 1
});

const baseLayer = new TileLayer({
  source: new OSM(),
  title: "osm"
});

const imageryLayer = new TileLayer({
  source: new BingMaps({
    key: "AnP2JM7KMMvWM594iLN5u9v_eZXgEW3Uz0y6Zv4FMvg5b5auwzuWBRKvWjO5RqHt ",
    imagerySet: "Aerial",
    maxZoom: 19
  }),
  title: "imagery",
  zIndex: 1
});

//#region
const sarpyOutlineData = new GeoJSON().readFeatures(
  require("../assets/sarpy-outline.json")
);

const sarpySource = new VectorSource({
  features: sarpyOutlineData
});

const sarpyOverlay = new VectorLayer({
  source: sarpySource,
  visible: this.sarpyVisible,
  style: new Style({
    stroke: new Stroke({
      color: "red",
      width: 2
    }),
    fill: new Fill({
      color: "rgba(255,0,0,0.15)"
    })
  }),
  title: "outline",
  zIndex: 2
});
//#endregion

// points and clusters
const mockCallData = new GeoJSON().readFeatures(
  require("../assets/mockCallData.json")
);

const callSource = new VectorSource({
  features: mockCallData
});

const callClusters = new Cluster({
  distance: 100,
  source: callSource
});

function callTypeStyle(feature) {
  const featureProps = feature.get("features")[0].getProperties().callType;

  let fillColor;
  let fillText;
  switch (featureProps) {
    case "Property Crime":
      fillColor = "orange";
      fillText = "P";
      break;
    case "Fire":
      fillColor = "red";
      fillText = "F";
      break;
    case "EMS":
      fillColor = "green";
      fillText = "E";
      break;
    case "Violent Crime":
      fillColor = "blue";
      fillText = "V";
      break;
    default:
      fillColor = "gray";
      break;
  }

  return new Style({
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: "black",
        width: 1
      }),
      fill: new Fill({
        color: fillColor
      })
    }),
    text: new Text({
      text: fillText,
      stroke: new Stroke({
        color: "white",
        width: 2
      })
    })
  });
}

const callLayer = new VectorLayer({
  source: callClusters,
  visible: this.callsVisible,
  style: callTypeStyle,
  title: "calls",
  zIndex: 3
});

export default {
  name: "Home",
  data: () => ({
    map: null,
    sarpyVisible: true,
    callsVisible: true,
    imageryLayer: imageryLayer,
    baseLayer: baseLayer
  }),
  mounted() {
    this.map = new Map({
      layers: [baseLayer, sarpyOverlay, callLayer],
      target: "map",
      view: baseView
    });
  },
  methods: {
    toggleSarpyOutline() {
      this.sarpyVisible = !this.sarpyVisible;
      sarpyOverlay.setVisible(this.sarpyVisible);
    },
    toggleCalls() {
      this.callsVisible = !this.callsVisible;
      callLayer.setVisible(this.callsVisible);
    },
    heatmapExample() {
      window.open(
        "https://openlayers.org/en/latest/examples/heatmap-earthquakes.html?q=heatmap"
      );
    },
    changeToOSM() {
      const layers = this.map.getLayers();
      layers.forEach(layer => {
        if (layer.get("title") === "imagery") {
          this.map.removeLayer(layer);
          this.map.addLayer(baseLayer);
        }
      });
    },
    changeToImagery() {
      const layers = this.map.getLayers();
      layers.forEach(layer => {
        if (layer.get("title") === "osm") {
          this.map.removeLayer(layer);
          this.map.addLayer(imageryLayer);
        }
      });
    }
  }
};
</script>
<style>
.map {
  width: 1200px;
  height: 750px;
}

.legend {
  border: 2px solid gray;
  height: 50px;
  width: 1200px;
}

.fire,
.ems,
.pc,
.vc {
  height: 25px;
  width: 200px;
}

.fire {
  background-color: red;
}

.ems {
  background-color: green;
}

.pc {
  background-color: orange;
}

.vc {
  background-color: blue;
}
</style>