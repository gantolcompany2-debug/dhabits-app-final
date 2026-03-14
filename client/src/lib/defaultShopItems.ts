import { ShopItem } from "@/contexts/AppContext";
import { nanoid } from "nanoid";

// SVG-коды для различных предметов одежды
const clothingSVGs = {
  // Футболка красная
  redTshirt: `<rect x="35" y="45" width="30" height="35" fill="#E63946" rx="3"/>
             <rect x="25" y="50" width="15" height="25" fill="#E63946" rx="2"/>
             <rect x="60" y="50" width="15" height="25" fill="#E63946" rx="2"/>`,
  
  // Футболка синяя
  blueTshirt: `<rect x="35" y="45" width="30" height="35" fill="#457B9D" rx="3"/>
              <rect x="25" y="50" width="15" height="25" fill="#457B9D" rx="2"/>
              <rect x="60" y="50" width="15" height="25" fill="#457B9D" rx="2"/>`,
  
  // Штаны чёрные
  blackPants: `<rect x="38" y="80" width="12" height="50" fill="#1A1A1A" rx="2"/>
              <rect x="50" y="80" width="12" height="50" fill="#1A1A1A" rx="2"/>`,
  
  // Штаны синие
  bluePants: `<rect x="38" y="80" width="12" height="50" fill="#2E5090" rx="2"/>
             <rect x="50" y="80" width="12" height="50" fill="#2E5090" rx="2"/>`,
  
  // Кепка красная
  redCap: `<path d="M 30 20 Q 50 5 70 20 L 70 28 L 30 28 Z" fill="#D62828"/>
          <ellipse cx="50" cy="28" rx="20" ry="3" fill="#B91C1C"/>`,
  
  // Кепка чёрная
  blackCap: `<path d="M 30 20 Q 50 5 70 20 L 70 28 L 30 28 Z" fill="#1A1A1A"/>
            <ellipse cx="50" cy="28" rx="20" ry="3" fill="#0A0A0A"/>`,
  
  // Кроссовки красные
  redShoes: `<ellipse cx="42" cy="135" rx="8" ry="6" fill="#E63946"/>
            <ellipse cx="58" cy="135" rx="8" ry="6" fill="#E63946"/>`,
  
  // Кроссовки белые
  whiteShoes: `<ellipse cx="42" cy="135" rx="8" ry="6" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="0.5"/>
             <ellipse cx="58" cy="135" rx="8" ry="6" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="0.5"/>`,
  
  // Очки
  glasses: `<circle cx="38" cy="22" r="5" fill="none" stroke="#333333" stroke-width="1.5"/>
           <circle cx="62" cy="22" r="5" fill="none" stroke="#333333" stroke-width="1.5"/>
           <line x1="43" y1="22" x2="57" y2="22" stroke="#333333" stroke-width="1"/>`,
};

const backgroundSVGs = {
  // Маленький домик
  smallHouse: `<rect x="15" y="60" width="70" height="70" fill="#8B4513" rx="2"/>
              <polygon points="15,60 85,60 50,20" fill="#A0522D"/>
              <rect x="35" y="80" width="15" height="20" fill="#654321"/>
              <circle cx="42" cy="87" r="2" fill="#FFD700"/>`,
  
  // Большой дом
  bigHouse: `<rect x="10" y="50" width="80" height="80" fill="#CD853F" rx="2"/>
            <polygon points="10,50 90,50 50,10" fill="#D2691E"/>
            <rect x="25" y="70" width="20" height="25" fill="#8B4513"/>
            <rect x="55" y="70" width="20" height="25" fill="#8B4513"/>
            <circle x="35" y="82" r="2.5" fill="#FFD700"/>
            <circle x="65" y="82" r="2.5" fill="#FFD700"/>`,
  
  // Квартира/Небоскрёб
  apartment: `<rect x="20" y="40" width="60" height="90" fill="#696969" rx="2"/>
             <rect x="28" y="50" width="8" height="8" fill="#87CEEB"/>
             <rect x="40" y="50" width="8" height="8" fill="#87CEEB"/>
             <rect x="52" y="50" width="8" height="8" fill="#87CEEB"/>
             <rect x="28" y="65" width="8" height="8" fill="#87CEEB"/>
             <rect x="40" y="65" width="8" height="8" fill="#87CEEB"/>
             <rect x="52" y="65" width="8" height="8" fill="#87CEEB"/>
             <rect x="28" y="80" width="8" height="8" fill="#87CEEB"/>
             <rect x="40" y="80" width="8" height="8" fill="#87CEEB"/>
             <rect x="52" y="80" width="8" height="8" fill="#87CEEB"/>`,
};

const vehicleSVGs = {
  // Спортивная машина
  sportsCar: `<ellipse cx="50" cy="110" rx="35" ry="12" fill="#FFD700"/>
             <rect x="30" y="105" width="40" height="8" fill="#FFD700" rx="2"/>
             <circle cx="35" cy="122" r="4" fill="#333333"/>
             <circle cx="65" cy="122" r="4" fill="#333333"/>
             <rect x="45" y="100" width="10" height="6" fill="#87CEEB"/>`,
  
  // Внедорожник
  suv: `<rect x="25" y="105" width="50" height="15" fill="#228B22" rx="2"/>
       <rect x="30" y="100" width="40" height="6" fill="#228B22" rx="1"/>
       <circle cx="35" cy="120" r="5" fill="#333333"/>
       <circle cx="65" cy="120" r="5" fill="#333333"/>
       <rect x="50" y="102" width="8" height="5" fill="#87CEEB"/>`,
  
  // Мотоцикл
  motorcycle: `<circle cx="35" cy="120" r="6" fill="#333333"/>
              <circle cx="65" cy="120" r="6" fill="#333333"/>
              <rect x="40" y="105" width="20" height="12" fill="#DC143C" rx="2"/>
              <polygon points="50,100 55,95 50,98" fill="#DC143C"/>`,
};

export const defaultShopItems: ShopItem[] = [
  // Одежда - Футболки
  {
    id: nanoid(),
    name: "Red T-Shirt",
    emoji: "👕",
    price: 20,
    category: "character",
    slot: "body",
    folder: "default",
    purchased: false,
    assetPath: clothingSVGs.redTshirt,
  },
  {
    id: nanoid(),
    name: "Blue T-Shirt",
    emoji: "👕",
    price: 20,
    category: "character",
    slot: "body",
    folder: "default",
    purchased: false,
    assetPath: clothingSVGs.blueTshirt,
  },
  
  // Одежда - Штаны
  {
    id: nanoid(),
    name: "Black Pants",
    emoji: "👖",
    price: 25,
    category: "character",
    slot: "hands",
    folder: "default",
    purchased: false,
    assetPath: clothingSVGs.blackPants,
  },
  {
    id: nanoid(),
    name: "Blue Pants",
    emoji: "👖",
    price: 25,
    category: "character",
    slot: "hands",
    folder: "default",
    purchased: false,
    assetPath: clothingSVGs.bluePants,
  },
  
  // Одежда - Кепки
  {
    id: nanoid(),
    name: "Red Cap",
    emoji: "🧢",
    price: 15,
    category: "character",
    slot: "head",
    folder: "default",
    purchased: false,
    assetPath: clothingSVGs.redCap,
  },
  {
    id: nanoid(),
    name: "Black Cap",
    emoji: "🧢",
    price: 15,
    category: "character",
    slot: "head",
    folder: "default",
    purchased: false,
    assetPath: clothingSVGs.blackCap,
  },
  
  // Одежда - Обувь
  {
    id: nanoid(),
    name: "Red Sneakers",
    emoji: "👟",
    price: 18,
    category: "character",
    slot: "feet",
    folder: "default",
    purchased: false,
    assetPath: clothingSVGs.redShoes,
  },
  {
    id: nanoid(),
    name: "White Sneakers",
    emoji: "👟",
    price: 18,
    category: "character",
    slot: "feet",
    folder: "default",
    purchased: false,
    assetPath: clothingSVGs.whiteShoes,
  },
  
  // Одежда - Аксессуары
  {
    id: nanoid(),
    name: "Sunglasses",
    emoji: "😎",
    price: 12,
    category: "character",
    slot: "accessory",
    folder: "default",
    purchased: false,
    assetPath: clothingSVGs.glasses,
  },
  
  // Дома
  {
    id: nanoid(),
    name: "Small House",
    emoji: "🏠",
    price: 50,
    category: "background",
    slot: "background",
    folder: "default",
    purchased: false,
    assetPath: backgroundSVGs.smallHouse,
  },
  {
    id: nanoid(),
    name: "Big House",
    emoji: "🏡",
    price: 100,
    category: "background",
    slot: "background",
    folder: "default",
    purchased: false,
    assetPath: backgroundSVGs.bigHouse,
  },
  {
    id: nanoid(),
    name: "Apartment",
    emoji: "🏢",
    price: 150,
    category: "background",
    slot: "background",
    folder: "default",
    purchased: false,
    assetPath: backgroundSVGs.apartment,
  },
  
  // Машины
  {
    id: nanoid(),
    name: "Sports Car",
    emoji: "🏎️",
    price: 80,
    category: "vehicle",
    slot: "vehicle",
    folder: "default",
    purchased: false,
    assetPath: vehicleSVGs.sportsCar,
  },
  {
    id: nanoid(),
    name: "SUV",
    emoji: "🚙",
    price: 70,
    category: "vehicle",
    slot: "vehicle",
    folder: "default",
    purchased: false,
    assetPath: vehicleSVGs.suv,
  },
  {
    id: nanoid(),
    name: "Motorcycle",
    emoji: "🏍️",
    price: 60,
    category: "vehicle",
    slot: "vehicle",
    folder: "default",
    purchased: false,
    assetPath: vehicleSVGs.motorcycle,
  },
];
