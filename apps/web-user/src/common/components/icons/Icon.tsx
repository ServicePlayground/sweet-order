import type { CSSProperties } from "react";
import clsx from "clsx";

import Cart from "./icons/cart.svg";
import ChevronLeft from "./icons/chevron-left.svg";
import Arrow from "./icons/arrow.svg";
import Favorite from "./icons/favorite.svg";
import FavoriteFilled from "./icons/favorite-filled.svg";
import FavoriteShadow from "./icons/favoriteShadow.svg";
import FavoriteShadowFilled from "./icons/favoriteShadowFilled.svg";
import Close from "./icons/close.svg";
import Calendar from "./icons/calendar.svg";
import SelectArrow from "./icons/select-arrow.svg";
import AddPhoto from "./icons/add-photo.svg";
import RemovePhoto from "./icons/remove-photo.svg";
import Takeout from "./icons/takeout.svg";
import Trash from "./icons/trash.svg";
import Minus from "./icons/minus.svg";
import Plus from "./icons/plus.svg";
import Warning from "./icons/warning.svg";
import Star from "./icons/star.svg";
import Quantity from "./icons/quantity.svg";
import Location from "./icons/location.svg";
import Search from "./icons/search.svg";
import Bullet from "./icons/bullet.svg";
import Alarm from "./icons/alarm.svg";
import Home from "./icons/home.svg";
import Map from "./icons/map.svg";
import Mypage from "./icons/mypage.svg";
import CloseCircle from "./icons/close_circle.svg";
import CheckCircle from "./icons/check_circle.svg";
import AlertCircle from "./icons/alert_circle.svg";

interface IconProps {
  name: keyof typeof iconTypes;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

export const iconTypes = {
  cart: Cart,
  chevronLeft: ChevronLeft,
  arrow: Arrow,
  favorite: Favorite,
  favoriteFilled: FavoriteFilled,
  favoriteShadow: FavoriteShadow,
  favoriteShadowFilled: FavoriteShadowFilled,
  close: Close,
  calendar: Calendar,
  selectArrow: SelectArrow,
  addPhoto: AddPhoto,
  removePhoto: RemovePhoto,
  takeout: Takeout,
  trash: Trash,
  minus: Minus,
  plus: Plus,
  warning: Warning,
  star: Star,
  quantity: Quantity,
  location: Location,
  search: Search,
  bullet: Bullet,
  alarm: Alarm,
  home: Home,
  map: Map,
  mypage: Mypage,
  closeCircle: CloseCircle,
  checkCircle: CheckCircle,
  alertCircle: AlertCircle,
};

export default function Icon({ name, width, height, className, ...props }: IconProps) {
  const IconComponent = iconTypes[name];
  return (
    <span className={clsx("inline-flex items-center", className)} {...props}>
      <IconComponent width={width} height={height} className="h-auto max-w-full" /> 
    </span>
  );
}
