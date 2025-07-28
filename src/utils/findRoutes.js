import { trains } from "../data/trainData";

export function findRoutes(source, destination) {
  const direct = [];
  const split = [];

  for (const train of trains) {
    const route = train.route;
    const srcIndex = route.indexOf(source);
    const destIndex = route.indexOf(destination);

    if (srcIndex !== -1 && destIndex !== -1 && srcIndex < destIndex) {
      const hopCount = destIndex - srcIndex;

      const match = {
        train,
        from: source,
        to: destination,
        legs: [{ from: source, to: destination }],
      };

      if (hopCount === 1) {
        direct.push({ ...match, type: "Direct" });
      } else {
        split.push({ ...match, type: "Split in Same Train" });
      }
    }
  }

  return { direct, split };
}
