export const mapbox = {
  token: import.meta.env.VITE_MAPBOX_TOKEN,
  //   styles: [
  //     { name: "light", url: "mapbox://styles/mapbox/streets-v12" },
  //     { name: "dark", url: "mapbox://styles/mapbox/navigation-night-v1" },
  //     { name: "satellite", url: "mapbox://styles/mapbox/satellite-v9" },
  //   ],
  styles: [
    { name: "standard", url: "mapbox://styles/mapbox/standard" },
    { name: "streets", url: "mapbox://styles/mapbox/streets-v12" },
    { name: "outdoors", url: "mapbox://styles/mapbox/outdoors-v12" },
    { name: "light", url: "mapbox://styles/mapbox/light-v11" },
    { name: "dark", url: "mapbox://styles/mapbox/dark-v11" },
    { name: "satellite", url: "mapbox://styles/mapbox/satellite-v9" },
    {
      name: "satellite-streets",
      url: "mapbox://styles/mapbox/satellite-streets-v12",
    },
    { name: "navigation-day", url: "mapbox://styles/mapbox/navigation-day-v1" },
    {
      name: "navigation-night",
      url: "mapbox://styles/mapbox/navigation-night-v1",
    },
  ],
  styles2: {
    light: "mapbox://styles/mapbox/light-v11",
    dark: "mapbox://styles/mapbox/dark-v11",
    satellite: "mapbox://styles/mapbox/satellite-v9",
    standard: "mapbox://styles/mapbox/standard",
  },
};
