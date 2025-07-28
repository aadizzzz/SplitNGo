export const stations = [
  "Kanpur", "Lucknow", "Prayagraj", "Varanasi", "Gorakhpur", "Agra", "Delhi", "Jaipur"
];

export const trains = [
  {
    id: "T001",
    name: "Ganga Express",
    route: ["Kanpur", "Lucknow", "Prayagraj", "Varanasi"],
    departure: "06:00",
    arrival: "14:00",
  },
  {
    id: "T002",
    name: "Yamuna Express",
    route: ["Agra", "Delhi", "Kanpur"],
    departure: "07:30",
    arrival: "13:45",
  },
  {
    id: "T003",
    name: "Awadh Express",
    route: ["Lucknow", "Kanpur", "Agra", "Delhi", "Jaipur"],
    departure: "09:00",
    arrival: "18:00",
  },
  {
    id: "T004",
    name: "Purvanchal Special",
    route: ["Varanasi", "Gorakhpur", "Lucknow"],
    departure: "10:00",
    arrival: "17:30",
  },
];
