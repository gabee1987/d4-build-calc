import { createContext } from "react";

const PointsContext = createContext({
  totalPoints: 60,
  allocatedPoints: 0,
  remainingPoints: 60,
  updatePoints: () => {},
});

export default PointsContext;
