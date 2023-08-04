import multiplier110 from "../assets/110.png";
import multipler25 from "../assets/25.png";
import multipler10 from "../assets/10.png";
import multipler5 from "../assets/5.png";
import multipler3 from "../assets/3.png";
import multipler2 from "../assets/2.png";
import multipler05 from "../assets/05.png";
import multipler03 from "../assets/03.png";
import test from "../assets/test.png";

const multiplier = {
  110: {
    label: "110",
    img: multiplier110,
  },
  88: {
    label: "88",
    img: test,
  },
  41: {
    label: "41",
  },
  33: {
    label: "33",
  },
  25: {
    label: "25",
    img: multipler25,
  },
  18: {
    label: "18",
  },
  15: {
    label: "15",
  },
  10: {
    label: "10",
    img: multipler10,
  },
  5: {
    label: "5",
    img: multipler5,
  },
  3: {
    label: "3",
    img: multipler3,
  },
  2: {
    label: "2",
    img: multipler2,
  },
  1.5: {
    label: "1.5",
  },
  1: {
    label: "1",
  },
  0.5: {
    label: "0.5",
    img: multipler05,
  },
  0.3: {
    label: "0.3",
    img: multipler03,
  },
};

export function getMultiplier(value) {
  return multiplier[value];
}

export const multiplyBlocks16Rows = [
  getMultiplier(110),
  getMultiplier(25),
  getMultiplier(10),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(2),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.3),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(2),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(10),
  getMultiplier(25),
  getMultiplier(110),
];
