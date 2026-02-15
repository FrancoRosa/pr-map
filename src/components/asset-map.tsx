import "mapbox-gl/dist/mapbox-gl.css";
import { DeckGL } from "@deck.gl/react";
import { LineLayer } from "deck.gl";
import Map, { NavigationControl } from "react-map-gl/mapbox";

import { mapbox } from "../mapbox";
// import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { MapPinPenIcon } from "lucide-react";
import { useState } from "react";

const initialView = {
  longitude: -75.71097030022591,
  latitude: 36.100792741702854,
  zoom: 19,
  maxZoom: 25,
  pitch: 60,
  bearing: 0,
};

function AssetMap() {
  const [mapStyle, setMapStyle] = useState(mapbox.styles2.dark);
  const handleMapClick = (info: object) => {
    console.log(info);
  };

  console.log("... map refresh?");
  const handleMapStyle = () => {
    switch (mapStyle) {
      case mapbox.styles2.standard:
        setMapStyle(mapbox.styles2.dark);
        break;
      case mapbox.styles2.dark:
        setMapStyle(mapbox.styles2.satellite);
        break;
      case mapbox.styles2.satellite:
        setMapStyle(mapbox.styles2.light);
        break;
      case mapbox.styles2.light:
        setMapStyle(mapbox.styles2.standard);
        break;
      default:
        break;
    }
  };

  //   const handleToolTip = (e) => {
  //     const { layer, object } = e;

  //     if (layer && object) {
  //       switch (layer.id) {
  //         case "historic-paths":
  //           return {
  //             html: `<div>
  //                 <p>Previous location</p>
  //                 </div>`,
  //             style: {
  //               backgroundColor: "rgb(125,125,125, 0.5)",
  //               fontSize: "0.8em",
  //               color: "white",
  //             },
  //           };

  //         default:
  //           break;
  //       }
  //       if (layer.id.includes("realtime-")) {
  //         const lastUpdate =
  //           object.updated_at &&
  //           formatDistanceToNow(object.updated_at, {
  //             addSuffix: true,
  //           });

  //         return {
  //           html: `<div>
  //                   <p style="font-weight:bold;text-align:center">${
  //                     object.name
  //                   }</p>
  //                   ${lastUpdate ? `<p>Last Update: ${lastUpdate}</p>` : ""}
  //                   <p>Battery: ${object.battery}%</p>
  //                   <p>Activity: ${object.activity}</p>
  //                 </div>`,
  //           style: {
  //             backgroundColor: `rgb(125,125,125`,
  //             fontSize: "0.8em",
  //             color: "white",
  //             textTransform: "capitalize",
  //           },
  //         };
  //       }
  //     }
  //   };

  const layers = [
    new LineLayer({
      id: "arroyo-blocks",
      data: [],
      getColor: [249, 166, 2, 200],
      getSourcePosition: (d) => d.from,
      getTargetPosition: (d) => d.to,
      getWidth: 4,
      pickable: true,
    }),
  ];

  return (
    <>
      <DeckGL
        initialViewState={initialView}
        controller={{ dragPan: true }}
        // viewState={view}
        // onClick={storeView}
        // onViewStateChange={(e) => setView(e.viewState)}
        layers={layers}
        // style={{ height: "100vh", width: "100vw", marginLeft: "0" }}
        // getTooltip={handleToolTip}
        onClick={(info) => handleMapClick(info)}
      >
        <Map
          mapboxAccessToken={mapbox.token}
          mapStyle={mapStyle}
          //   mapStyle={mapbox.styles[parseInt(mapStyle)].url}
        >
          <NavigationControl
            showCompass={true}
            showZoom={false}
            visualizePitch={true}
          />
        </Map>
      </DeckGL>
      <div className="absolute p-4 flex gap-4">
        <Button onClick={handleMapStyle}>
          <MapPinPenIcon />
        </Button>
      </div>
    </>
  );
}
export default AssetMap;
