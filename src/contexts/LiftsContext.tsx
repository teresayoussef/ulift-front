import React, { useContext, useState, useEffect, PropsWithChildren } from "react";
import { Driver, Lift, Route, Vehicle } from "../pages/Inicio";



// export const useUser = () => {
//   return useContext(UserContext);
// };
export interface lifts {
  lift: Lift
  driver: Driver
  route: Route
  vehicle: Vehicle
}

interface data {
    liftsList: lifts[],
    setLiftList: React.Dispatch<React.SetStateAction<lifts[]>>
}

export const LiftContext = React.createContext({} as data);

export const LiftProvider = ({ children }: PropsWithChildren) => {

  const [liftsList, setLiftList] = useState<lifts[]>([])

  return <LiftContext.Provider value={{liftsList,setLiftList}}>{children}</LiftContext.Provider>;
};

