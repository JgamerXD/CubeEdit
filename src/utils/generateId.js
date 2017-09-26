let takenIds = {};

export default function generateId(type) {
  if(takenIds[type])
    return ++takenIds[type];
  else {
    takenIds[type]=0;
    return 0;
  }
}
