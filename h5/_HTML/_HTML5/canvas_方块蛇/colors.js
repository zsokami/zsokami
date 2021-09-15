function HSV2Color(h, s, v) {
  if(s == null) s = 1;
  if(v == null) v = 1;
  let a = h % 60 / 60, b = Math.floor(h / 60), c = b & 1;
  let color = (
    ((255 * (v - (c ? a : 1 - a) * s * v)) << (((b + 1) % 3) << 3)) | 
    ((255 * v) << (((b + c + 2) % 3) << 3)) | 
    ((255 * (v - s * v)) << (((b + c * 2) % 3) << 3))).toString(16);
  return '#000000'.slice(0, -color.length) + color;
}