export const getPieColor = (index: number): string => {
  const pieColors = [
    "#90caf9", // blue
    "#ef9a9a", // red
    "#9fa8da", // indigo
    "#ffe082", // amber
    "#80cbc4", // teal
    "#ffcc80", // orange
    "#a5d6a7", // green
    "#fff59d", // yellow
    "#b0bec5", // blue-grey
    "#bcaaa4", // brown
    "#e6ee9c", // lime
    "#b39ddb", // deep-purple
    "#f48fb1", // pink
    "#ce93d8", // purple
    "#81d4fa", // light-blue
    "#eeeeee", // grey
  ];

  if (index < pieColors.length) {
    return pieColors[index];
  } else {
    const randomIndex = Math.floor(Math.random() * pieColors.length) + 1;
    return pieColors[randomIndex];
  }
};
