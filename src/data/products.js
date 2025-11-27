import ori from '../assets/images/ori.png';
import carica from '../assets/images/carica.png';
import mango from '../assets/images/mango.png';
import naga from '../assets/images/naga.png';
import plain from '../assets/images/plain.jpg';
import ca from '../assets/images/ca.png';
import na from '../assets/images/na.png';
import co from '../assets/images/co.png';
import me from '../assets/images/me.png';

export const PRODUCTS = [
    // CATEGORY A: DRINK YOGURT
    { id: 1, name: "Drink Yogurt Original", category: "drink", price: 15000, img: ori, desc: "Classic creamy yogurt drink.", color: "#A5E5FF", textColor: "#115AA6", bgColor: "#F0F9FF" },
    { id: 2, name: "Drink Yogurt Carica", category: "drink", price: 18000, img: carica, desc: "Signature Carica fruit blend.", featured: true, color: "#FFD734", textColor: "#000000", bgColor: "#FFFBEB" },
    { id: 6, name: "Drink Yogurt Carica Less Sugar", category: "drink", price: 19000, img: carica, desc: "Less sugar, same great Carica taste.", color: "#7ED957", textColor: "#064E3B", bgColor: "#F0FDF4", badge: "Less Sugar" },

    { id: 3, name: "Drink Yogurt Dragon Fruit", category: "drink", price: 17000, img: naga, desc: "Vibrant dragon fruit flavor.", color: "#D43259", textColor: "#FFFFFF", bgColor: "#FFF1F2" },
    { id: 9, name: "Drink Yogurt Dragon Fruit Less Sugar", category: "drink", price: 18000, img: naga, desc: "Lighter, less sugar dragon fruit.", color: "#7ED957", textColor: "#064E3B", bgColor: "#F0FDF4", badge: "Less Sugar" },

    { id: 4, name: "Drink Yogurt Mango", category: "drink", price: 17000, img: mango, desc: "Sweet tropical mango.", color: "#FFD734", textColor: "#000000", bgColor: "#FFFBEB" },
    { id: 10, name: "Drink Yogurt Mango Less Sugar", category: "drink", price: 18000, img: mango, desc: "Guilt-free mango goodness.", color: "#7ED957", textColor: "#064E3B", bgColor: "#F0FDF4", badge: "Less Sugar" },

    // CATEGORY B: SCOOP YOGURT
    { id: 5, name: "Plain Yogurt", category: "scoop", price: 25000, img: plain, desc: "Light, creamy texture.", color: "#A5E5FF", textColor: "#115AA6", bgColor: "#F0F9FF" },
    { id: 11, name: "Yogurt Carica Cup", category: "scoop", price: 28000, img: "https://images.unsplash.com/photo-1571212515416-f786d79a8388?auto=format&fit=crop&w=600&q=80", desc: "Scoopable delight with Carica chunks.", color: "#FFD734", textColor: "#000000", bgColor: "#FFFBEB" },

    // CATEGORY C: ICE LOLLY
    { id: 7, name: "Ice Lolly Yogurt Carica", category: "ice", price: 5000, img: ca, desc: "Frozen delight.", color: "#FFD734", textColor: "#000000", bgColor: "#FFFBEB" },
    { id: 8, name: "Ice Lolly Yogurt Dragon Fruit", category: "ice", price: 5000, img: na, desc: "Frozen dragon fruit.", color: "#D43259", textColor: "#FFFFFF", bgColor: "#FFF1F2" },
    { id: 12, name: "Ice Lolly Milk Coco Pandan", category: "ice", price: 5000, img: co, desc: "Classic coco pandan flavor.", color: "#7ED957", textColor: "#064E3B", bgColor: "#F0FDF4" },
    { id: 13, name: "Ice Lolly Milk Melon", category: "ice", price: 5000, img: me, desc: "Refreshing melon milk.", color: "#7ED957", textColor: "#064E3B", bgColor: "#ECFCCB" },
];
