import type { EmissionCategory } from "@sinai/shared";
import type { SvgIconComponent } from "@mui/icons-material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import FlightIcon from "@mui/icons-material/Flight";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import TrainIcon from "@mui/icons-material/Train";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import YardIcon from "@mui/icons-material/Yard";
import DeleteIcon from "@mui/icons-material/Delete";
import RecyclingIcon from "@mui/icons-material/Recycling";

export const ACTIVITY_ICONS: Record<string, SvgIconComponent> = {
  gasoline_car: DirectionsCarIcon,
  gasoline_car_daily: DirectionsCarIcon,
  electric_car: ElectricCarIcon,
  motorcycle: TwoWheelerIcon,
  short_haul_flight: FlightIcon,
  long_haul_flight: FlightIcon,
  bus: DirectionsBusIcon,
  train: TrainIcon,
  electricity: BoltIcon,
  natural_gas: LocalFireDepartmentIcon,
  propane: LocalGasStationIcon,
  fuel_oil: LocalGasStationIcon,
  beef: RestaurantIcon,
  pork: RestaurantIcon,
  chicken: RestaurantIcon,
  fish: RestaurantIcon,
  dairy: RestaurantIcon,
  vegetables: YardIcon,
  landfill: DeleteIcon,
  recycled: RecyclingIcon,
  composted: YardIcon,
};

export interface CategoryMeta {
  Icon: SvgIconComponent;
  description: string;
  color: string;
}

export const CATEGORY_META: Record<EmissionCategory, CategoryMeta> = {
  transportation: {
    Icon: DirectionsCarIcon,
    description: "Tell us how you get around",
    color: "#2e7d32",
  },
  energy: {
    Icon: BoltIcon,
    description: "Your home energy use",
    color: "#f57c00",
  },
  diet: {
    Icon: RestaurantIcon,
    description: "Your food choices",
    color: "#7b1fa2",
  },
  waste: {
    Icon: DeleteIcon,
    description: "Your waste habits",
    color: "#0288d1",
  },
};
